import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import UserModal from "./UserModal"; 
import ConfirmationModal from "./ConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";


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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User| null>(null);
  const router = useRouter();

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

  const fetchUsers = async () => {
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
      if(response.status == 403){
        router.push("/");
      }else if(response.status == 401){
        router.replace("/login");
      }
      const data = await response.json();
      setUsers(data["data"]);
    } catch (error) {
      toast.error("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

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
        toast.success("User created successfully");
        const clipboardData = `Username: ${data?.data.username}\nPassword: ${data?.data.password}`
        await navigator.clipboard.writeText(clipboardData);
        toast.success("Username and Password copied to clipboard");
      } else {
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
      await getRoles();
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
            "role": roleMap.get(userData.role),
            "is_admin": false
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(user => user.username === userData.username ? userData : user));
        setIsModalOpen(false);
        toast.success("User updated successfully");
      } else {
        toast.error("An error occured while updating user");
      }
    }catch(e){
      toast.error("An error occured while updating user");
    }
  };

  const handleDelete = async (username: string) => {
    try{
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/admin/users/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter(user => user.username !== username));
        toast.success("User deleted successfully");
      } else {
        toast.error("An error occured while deleting user");
      }
    }catch(e){
      toast.error("An error occured while deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Users</h2>
        <button className="create-user-btn" onClick={() =>{
          setUserToEdit(null);
          setIsModalOpen(true);
        }}>
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
                      onClick={() => {
                        setUserToEdit(user);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="user-delete-btn"
                      onClick={() => {
                        setUserToDelete(user);
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

      <button className="fab" onClick={() =>{
        setUserToEdit(null);
        setIsModalOpen(true);
      }}>
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

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        message={`Are you sure you want to delete the role "${userToDelete?.username}"?`}
        onConfirm={async () =>{
          await handleDelete(userToDelete?.username || "");
          setIsDeleteModalOpen(false);
          
        }} 
        onCancel={() => setIsDeleteModalOpen(false)}/>

    
      <ToastContainer/>
    </div>
  );
};

export default Users;
