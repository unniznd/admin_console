import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

// Define the interface for user data
interface User {
  username: string;
  name: string;
  is_active: boolean;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);  // Use User interface here
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEdit = (username: string) => {
    console.log(`Edit user: ${username}`);
  };

  const handleDelete = (username: string) => {
    console.log(`Delete user: ${username}`);
  };

  const handleCreateUser = () => {
    console.log("Create User clicked");
  };

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/users/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setUsers(data["data"]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); 
      }
    };

    getUsers();
  }, []);

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
          {isLoading ? (
            <tr>
              <td colSpan={5} className="loading-cell">
                {/* Loading indicator */}
                <div className="loader"></div>
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
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
            ))
          )}
        </tbody>
      </table>

      {/* Floating action button for creating user */}
      <button className="fab" onClick={handleCreateUser}>
        <FaPlus />
      </button>
    </div>
  );
};

export default Users;
