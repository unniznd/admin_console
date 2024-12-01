import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Role {
  id: number;
  role: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        <button className="create-role-btn">
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
                    <button className="role-edit-btn">
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

      <ToastContainer />
    </div>
  );
};

export default Roles;
