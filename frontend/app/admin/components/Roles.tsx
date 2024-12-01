import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import RoleModal from "./RoleModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Role {
  id: number;
  role: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Fetch roles data
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/roles/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setRoles(data?.data || []);
      } else {
        toast.error("Failed to fetch roles");
      }
    } catch (error) {
      toast.error("An error occurred while fetching roles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleCreate = async (roleData: { role: string }) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/roles/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(roleData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRoles([...roles, data.data]);
        toast.success("Role created successfully");
      } else {
        toast.error("Failed to create role");
      }
    } catch (error) {
      toast.error("An error occurred while creating the role");
    }
  }

  const handleEditRole = async (roleData: {id: number, role:string}) =>{
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/roles/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(roleData),
        }
      );
      if (response.ok) {
        setRoles(roles.map((role) => role.id === roleData.id ? roleData : role));
        toast.success("Role updated successfully");
      } else {
        const data = await response.json();
        toast.error(data?.errors?.role[0] || "Failed to update role");
      }
    } catch (error) {
      toast.error("An error occurred while updating the role");
    }
  }

  // Delete role
  const handleDeleteRole = async (roleId: number) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/admin/roles/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id: roleId }),
        }
      );
      if (response.ok) {
        setRoles(roles.filter((role) => role.id !== roleId));
        toast.success("Role deleted successfully");
      } else {
        toast.error("Failed to delete role");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the role");
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="roles-container">
      <div className="roles-header">
        <h2>Roles</h2>
        <button 
         className="create-role-btn"
          onClick={() => {
            setRoleToEdit(null);
            setIsModalOpen(true);
          }}
         >
          <FaPlus /> Create Role
        </button>
      </div>

      <table className="roles-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={2} className="loading-cell">
                <div className="loader"></div>
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.id}>
                <td>{role.role}</td>
                <td>
                  <div className="role-action-buttons">
                    <button 
                      className="role-edit-btn"
                      onClick={() => {
                        setRoleToEdit(role);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="role-delete-btn"
                      onClick={() => {
                        setRoleToDelete(role);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={`Are you sure you want to delete the role "${roleToDelete?.role}"?`}
        onConfirm={async () => {
          if (roleToDelete) {
            await handleDeleteRole(roleToDelete.id);
          }
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Role Modal for Create and Edit */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleRoleCreate}
        onEdit={handleEditRole}
        roleToEdit={roleToEdit}/>

      <ToastContainer />
    </div>
  );
};

export default Roles;
