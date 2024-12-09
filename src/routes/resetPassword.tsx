import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/resetPassword")({
  component: ResetPassword,
});

function ResetPassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedToken = localStorage.getItem("resetPasswordToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setMessage("Token not found. Please request a password reset.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!token) {
      setMessage("No valid token found.");
      return;
    }

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting...");
        setTimeout(() => navigate({ to: "/signIn" }), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error resetting password.");
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Reset Password</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate, useLocation } from "react-router-dom";

// const ResetPassword = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = new URLSearchParams(location.search).get("token");

//   const mutation = useMutation(
//     async (newPassword) => {
//       const response = await fetch(
//         "https://api-ticketmanagement.onrender.com/v1.0/user/reset-password/:token",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ token, newPassword }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to reset password");
//       }

//       return response.json();
//     },
//     {
//       onSuccess: () => {
//         navigate("/login");
//       },
//       onError: (err) => {
//         // Handle error
//         setError(err.message);
//       },
//     }
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     mutation.mutate(newPassword);
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="newPassword">New Password</label>
//           <input
//             type="password"
//             id="newPassword"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="confirmPassword">Confirm Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <button type="submit" disabled={mutation.isLoading}>
//           {mutation.isLoading ? "Resetting..." : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;
