import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import UserModal from "./UserModal"; // Import the modal component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface User {
  username: string;
  name: string;
  is_active: boolean;
  role: string;
}


const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const roleMap = new Map<String, number>();



  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = (username: string) => {
    console.log(`Delete user: ${username}`);
  };

  const handleCreateUser = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const getRoles = async () =>{
    try{
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

      if(data?.data){
        for(let i = 0; i<data.data.length; i++){
          roleMap.set(data.data[i]["role"], data.data[i]["id"]);
        }
      }else{
        toast.error("Failed to fetch roles")
      }
    }catch(e){
      toast.error("Failed to fetch roles")
    }
  }

  const handleCreate = async (userData: { username: string; name: string; is_active: boolean; role: string }) => {
    try{
      await getRoles();

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            "username": userData.username,
            "name": userData.name,
            "is_active": userData.is_active,
            "role": roleMap.get(userData.role),
            "is_admin": false
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers([...users, userData]);
        setIsModalOpen(false);
      } else {
        console.log(data?.errors);
        if (data?.errors){
          if(data.errors?.username){
            toast.error(data.errors["username"][0])
          }else if(data.errors?.role){
            toast.error(data.errors["role"][0])
          }
        }else{
          toast.error("An error occured while creating user");
        }
      }
    } catch (error) {
      toast.error("An error occured while creating user");
    }
  };

  const handleEditUser = async (userData: { username: string; name: string; is_active: boolean; role: string }) => {
    try{
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/admin/users/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            "username": userData.username,
            "name": userData.name,
            "is_active": userData.is_active,
            "role": userData.role,
            "is_admin": false
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(user => user.username === userData.username ? userData : user));
        setIsModalOpen(false);
      } else {console.log(data?.error);
        toast.error("An error occured while updating user");
      }
    }catch(e){
      toast.error("An error occured while updating user");
    }
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
      <div className="users-header">
        <h2>Users</h2>
        <button className="create-user-btn" onClick={handleCreateUser}>
          Create User
        </button>
      </div>

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
                      onClick={() => handleEdit(user)}
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

      <button className="fab" onClick={handleCreateUser}>
        <FaPlus />
      </button>

      {/* User Modal for Create and Edit */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreate} 
        onEdit={handleEditUser} 
        userToEdit={userToEdit} 
      />
      <ToastContainer/>
    </div>
  );
};

export default Users;
