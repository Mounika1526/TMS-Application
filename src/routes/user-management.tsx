import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/user-management")({
  component: UserManagement,
});

function UserManagement() {
  const [userType, setUserType] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("accessToken");

  const fetchUsers = async (type: string) => {
    if (!token) {
      setMessage("You need to log in to view the users.");
      return;
    }

    setLoading(true);
    setMessage("");
    setUsers([]);

    try {
      const response = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/user/${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setUsers(data.data || []);
      } else {
        setMessage(data.message || `Failed to fetch ${type}s.`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!token) {
      setMessage("Authorization token is missing. Please log in again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this profile? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //   console.log("Response Status:", response.status);
      //   const responseClone = response.clone();
      //   console.log(responseClone);
      console.log("Response Body:", await response.text());
      if (response.ok) {
        setMessage("Profile deleted successfully.");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setMessage("");
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setMessage(errorData.message || "Failed to delete profile.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Network error. Please try again later.");
    }
  };

  const handleButtonClick = (type: string) => {
    setUserType(type);
    fetchUsers(type);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>User Management</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleButtonClick("user")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Users
        </button>
        <button
          onClick={() => handleButtonClick("developer")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Developers
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : message ? (
        <p style={{ color: "red" }}>{message}</p>
      ) : users.length > 0 ? (
        <div>
          <h3>{userType === "user" ? "All Users" : "All Developers"}</h3>
          <table
            style={{
              margin: "0 auto",
              borderCollapse: "collapse",
              width: "80%",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  User Id
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Email
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Role
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.id}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.full_name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.email}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.user_type}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        userType && (
          <p>No {userType === "user" ? "users" : "developers"} found.</p>
        )
      )}
    </div>
  );
}

export default UserManagement;
