import React from "react";

const Logs = () => {
  const logData = [
    { username: "johndoe", message: "Logged in successfully", timestamp: "2024-11-30 10:15:00" },
    { username: "janedoe", message: "Failed login attempt", timestamp: "2024-11-30 10:20:00" },
    { username: "alexsmith", message: "Logged out", timestamp: "2024-11-30 10:25:00" },
  ];

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
          {logData.map((log, index) => (
            <tr key={index}>
              <td>{log.username}</td>
              <td>{log.message}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
