import React, { useState, useEffect } from "react";

interface Role{
  id: number;
  role: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose:  () => void;
  onCreate: (userData: { 
    username: string; name: string; is_active: boolean; role: string 
  }) => void;
  onEdit: (userData: { 
    username: string; name: string; is_active: boolean; role: string 
  }) => void;
  userToEdit?: { 
    username: string; name: string; is_active: boolean; role: string 
  } | null; 
}

const UserModal: React.FC<CreateUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  onEdit, 
  userToEdit 
}) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);


  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null); // Reset any previous error

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

      if (data?.data) {
        setRoles(data.data);
      } else {
        setError("No roles available");
      }
    } catch (error) {
      setError("An error occurred while fetching roles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userToEdit) {
      onEdit({ username, name, is_active: isActive, role });
    } else {
      onCreate({ username, name, is_active: isActive, role });
    }
    onClose();
  };

  // Fetch roles on mount
  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username);
      setName(userToEdit.name);
      setIsActive(userToEdit.is_active);
      setRole(userToEdit.role);
    }else{
      setUsername("");
      setName("");
      setIsActive(true);
      setRole("");
    }

    fetchRoles();
  }, [userToEdit]);

  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{userToEdit ? "Edit User" : "Create User"}</h3>

        {/* Show loading indicator while roles are being fetched */}
        {isLoading ? (
          <div className="loader"></div> // Show spinner here
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={!!userToEdit}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isActive">Is Active:</label>
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive((prev) => !prev)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select a role</option>
                {roles.map((roleOption, index) => (
                  <option key={index} value={roleOption.role}>
                    {roleOption.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="create-btn">
                {userToEdit ? "Save Changes" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserModal;
