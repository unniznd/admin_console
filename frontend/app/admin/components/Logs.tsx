import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Log {
  id:number,
  user:string,
  action:string,
  date:string
}

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const router = useRouter();

  const fetchLogs = async () => {
    try{
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/logs/",
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
      }
      const data = await response.json();
      if (response.ok) {
        setLogs(data?.data || []);
      } else {
        toast.error("Failed to fetch logs");
      }
    }catch(error){
      toast.error("An error occurred while fetching logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="logs-container">
      {/* Header */}
      <h2>Logs</h2>

      {/* Table */}
      <table className="logs-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Logs;
