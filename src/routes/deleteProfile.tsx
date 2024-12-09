import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/deleteProfile")({
  component: DeleteProfile,
});

function DeleteProfile() {
  const [message, setMessage] = useState<string>("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("You need to log in to delete your profile.");
      return;
    }
  }, [token]);

  const handleDelete = async () => {
    if (!token) {
      setMessage("Authorization token is missing. Please log in again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/profile",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Your profile has been successfully deleted.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        setTimeout(() => navigate({ to: "/signIn" }), 1000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to delete profile.");
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Delete Profile</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <Button onClick={handleDelete}>Delete Profile</Button>
    </div>
  );
}

export default DeleteProfile;
