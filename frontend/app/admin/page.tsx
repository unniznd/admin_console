"use client";

import "./styles.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import SideBar from "./components/SideBar";
import BottomNav from "./components/BottomNav";
import Users from "./components/Users";
import Roles from "./components/Roles";
import Logs from "./components/Logs";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // Redirect to login if token is null
    }else{
      setIsLoading(false);
    }
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <Users />;
      case "roles":
        return <Roles />;
      case "logs":
        return <Logs />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="admin-container">
      {isLoading ? (
        <div className="admin-loading">
        <div className="loader"></div>
        </div>
      ):(
        <>
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content">{renderContent()}</div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </>
      )}
    </div>
  );
};

export default AdminPage;
