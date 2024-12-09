import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/forgotPassword")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const token = localStorage.getItem("accessToken");
  // if (!token) {
  //   setMessage("You need to be logged in to reset your password.");
  //   return;
  // }
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("You need to be logged in to reset your password.");
    }
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/password/forgot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        setMessage("Check your email for a reset link!");
        setTimeout(() => navigate({ to: "/resetPassword" }), 5000);
      } else {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        setMessage(
          errorData.message || "Error sending reset email. Please try again."
        );
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {message && (
          <p
            style={{
              color: message.includes("error") ? "red" : "green",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}
        <Button type="submit">Send Reset Link</Button>
      </form>
    </div>
  );
}

export default ForgotPassword;
