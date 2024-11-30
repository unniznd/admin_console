"use client";

import React from "react";
import { FaUsers, FaUserShield, FaListAlt } from "react-icons/fa"; // Import icons

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideBar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <button
        className={activeTab === "users" ? "active" : ""}
        onClick={() => setActiveTab("users")}
      >
        <FaUsers size={20} /> {/* Icon for Users */}
        <span>Users</span> {/* Label to the right of the icon */}
      </button>
      <button
        className={activeTab === "roles" ? "active" : ""}
        onClick={() => setActiveTab("roles")}
      >
        <FaUserShield size={20} /> {/* Icon for Roles */}
        <span>Roles</span> {/* Label to the right of the icon */}
      </button>
      <button
        className={activeTab === "logs" ? "active" : ""}
        onClick={() => setActiveTab("logs")}
      >
        <FaListAlt size={20} /> {/* Icon for Logs */}
        <span>Logs</span> {/* Label to the right of the icon */}
      </button>
    </div>
  );
};

export default SideBar;
