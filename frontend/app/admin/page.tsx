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

  const checkIfAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/user/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (!data?.data.is_admin) {
          router.replace("/"); 
        }else{
          setIsLoading(false);
        }
      } else {
        router.replace("/login"); 
      }
    } catch (error) {
      router.replace("/login"); 
    } 
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, redirect to login
      router.replace("/login");
    } else {
      // If token exists, check if the user is an admin
      checkIfAdmin();
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
      ) : (
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
