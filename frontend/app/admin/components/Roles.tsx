import React from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const Roles = () => {
  const roleData = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Editor" },
    { id: 3, name: "Viewer" },
  ];

  const handleEdit = (roleName: string) => {
    console.log(`Edit role: ${roleName}`);
  };

  const handleDelete = (roleName: string) => {
    console.log(`Delete role: ${roleName}`);
  };

  const handleCreateRole = () => {
    console.log("Create Role clicked");
  };

  return (
    <div className="roles-container">
      {/* Header with Create Role button */}
      <div className="roles-header">
        <h2>Roles</h2>
        <button className="create-role-btn" onClick={handleCreateRole}>
          Create Role
        </button>
      </div>

      {/* Table for displaying roles */}
      <table className="roles-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roleData.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                <div className="role-action-buttons">
                  <button
                    className="role-edit-btn"
                    onClick={() => handleEdit(role.name)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="role-delete-btn"
                    onClick={() => handleDelete(role.name)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="fab" onClick={handleCreateRole}>
        <FaPlus />
      </button>
    </div>
  );
};

export default Roles;
