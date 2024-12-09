import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/updateProfile")({
  component: UpdateProfile,
});

function UpdateProfile() {
  const [profile, setProfile] = useState<any>({ full_name: "", email: "" });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{
    full_name?: string;
    email?: string;
  }>({});
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("You need to log in to update your profile.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://api-ticketmanagement.onrender.com/v1.0/user/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile({
            full_name: data.data.full_name,
            email: data.data.email,
          });
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to fetch profile.");
        }
      } catch (error) {
        setMessage("Network error. Please try again later.");
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile: any) => ({
      ...prevProfile,
      [name]: value,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Authorization token is missing. Please log in again.");
      return;
    }

    setLoading(true);
    setMessage("");
    setFieldErrors({});

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => navigate({ to: "/profile" }), 2000); // Redirect after success
      } else {
        const errorData = await response.json();
        if (response.status === 422 && errorData.errorData?.nested) {
          setFieldErrors(errorData.errorData.nested);
        } else {
          setMessage(errorData.message || "Failed to update profile.");
        }
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p>{message}</p>;
  }

  return (
    <div style={{ textAlign: "left", marginTop: "50px" }}>
      <h2 style={{ textAlign: "center" }}>Update Profile</h2>
      {message && (
        <p style={{ color: message.includes("success") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <Label>
            Full Name:
            <Input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleInputChange}
            />
          </Label>
          {fieldErrors.full_name && (
            <p style={{ color: "red" }}>{fieldErrors.full_name}</p>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Label>
            Email:
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
            />
          </Label>
          {fieldErrors.email && (
            <p style={{ color: "red" }}>{fieldErrors.email}</p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            type="submit"
            disabled={loading}
            style={{ padding: "10px 20px", textAlign: "center" }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
