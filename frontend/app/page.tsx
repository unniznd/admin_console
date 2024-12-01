"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  username: string;
  name: string;
  role: string;
  is_admin: boolean;
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const handleAdminConsoleClick = () => {
    setIsLoading(true)
    router.push("/admin");
  };

  const fetchUser = async () => {
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
        setUser(data?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // Redirect to login if token is null
    } else {
      fetchUser();
    }
  }, [router]);

  return (
    <>
      {isLoading ? (
        <div className="home-loading">
          <div className="loader"></div>
        </div>
      ) : user ? ( 
        <>
          <div className="home-container">
            <div className="user-info">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            {user.is_admin && (
              <button className="admin-button" onClick={handleAdminConsoleClick}>
                Go to Admin Console
              </button>
            )}
          </div>
          <ToastContainer />
        </>
      ) : (
        <div className="home-container">
          <p>No user data available.</p>
        </div>
      )}
    </>
  );
}
