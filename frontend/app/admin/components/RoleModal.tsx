import React, { useState, useEffect } from "react";

interface Role {
  id: number;
  role: string;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roleData: { role: string }) => void;
  onEdit: (roleData: { id:number, role: string }) => void;
  roleToEdit?:  {id:number, role:string}  | null;
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  roleToEdit,
}) => {
  const [roleName, setRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (roleToEdit) {
      setRoleName(roleToEdit.role);
    }else{
      setRoleName("");
    }
  }, [roleToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (roleToEdit) {
        onEdit({ id: roleToEdit.id, role: roleName });
      } else {
        onCreate({ role: roleName });
      }
      onClose();
    } catch (err) {
      setError("An error occurred while saving the role.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{roleToEdit ? "Edit Role" : "Create Role"}</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="roleName">Role Name:</label>
            <input
              id="roleName"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : roleToEdit ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;