import React from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

const Users = () => {
  const userData = [
    { username: "johndoe", name: "John Doe", is_active: true, role: "Admin" },
    { username: "janedoe", name: "Jane Doe", is_active: false, role: "Editor" },
    { username: "alexsmith", name: "Alex Smith", is_active: true, role: "Viewer" },
  ];

  const handleEdit = (username: string) => {
    console.log(`Edit user: ${username}`);
  };

  const handleDelete = (username: string) => {
    console.log(`Delete user: ${username}`);
  };

  const handleCreateUser = () => {
    console.log("Create User clicked");
  };

  return (
    <div className="users-container">
      {/* Top bar with Create User button */}
      <div className="users-header">
        <h2>Users</h2>
        <button className="create-user-btn" onClick={handleCreateUser}>
          Create User
        </button>
      </div>

      {/* Table to display user data */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Is Active</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>
                {user.is_active ? (
                  <FaCheck className="active-icon" />
                ) : (
                  <FaTimes className="inactive-icon" />
                )}
              </td>
              <td>{user.role}</td>
              <td>
                <div className="user-action-buttons">
                  <button
                    className="user-edit-btn"
                    onClick={() => handleEdit(user.username)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="user-delete-btn"
                    onClick={() => handleDelete(user.username)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="fab" onClick={handleCreateUser}>
        <FaPlus />
      </button>
    </div>
  );
};

export default Users;
