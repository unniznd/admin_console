"use client";

import React from "react";
import { FaUsers, FaUserShield, FaListAlt } from "react-icons/fa"; // Import icons

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bottom-nav">
      <button
        className={activeTab === "users" ? "active" : ""}
        onClick={() => setActiveTab("users")}
      >
        <FaUsers size={24} /> {/* Icon for Users */}
        <span>Users</span> {/* Label below icon */}
      </button>
      <button
        className={activeTab === "roles" ? "active" : ""}
        onClick={() => setActiveTab("roles")}
      >
        <FaUserShield size={24} /> {/* Icon for Roles */}
        <span>Roles</span> {/* Label below icon */}
      </button>
      <button
        className={activeTab === "logs" ? "active" : ""}
        onClick={() => setActiveTab("logs")}
      >
        <FaListAlt size={24} /> {/* Icon for Logs */}
        <span>Logs</span> {/* Label below icon */}
      </button>
    </div>
  );
};

export default BottomNav;
