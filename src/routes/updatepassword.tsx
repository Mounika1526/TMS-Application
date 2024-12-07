import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
export const Route = createFileRoute("/updatepassword")({
  component: RouteComponent,
});
function RouteComponent() {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [oldPassError, setOldPassError] = React.useState("");
  const [newPassError, setNewPassError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  interface PasswordUpdateParams {
    oldPass: string;
    newPass: string;
  }
  const mutation = useMutation({
    mutationFn: async ({ oldPass, newPass }: PasswordUpdateParams) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Your access token was not in your localstorage");
      }
      const res = await axios.patch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/password/update",
        { oldPassword: oldPass, newPassword: newPass },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      return res.data;
    },
    onSuccess: () => {
      alert("password updated succesfully");
      navigate({ to: "/" });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  const validateInputs = () => {
    let isValid = true;
    if (!oldPass) {
      setOldPassError("Old password is required");
      isValid = false;
    } else {
      setOldPassError("");
    }
    if (!newPass) {
      setNewPassError("New password is required");
      isValid = false;
    } else {
      setNewPassError("");
    }
    return isValid;
  };
  const handleUpdatePassword = () => {
    if (validateInputs()) {
      mutation.mutate({ oldPass, newPass });
    }
  };
  return (
    <div>
      <h2>Update Password</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>
            Old Password:
            <input
              type={showPassword ? "text" : "password"}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
          </label>
          {oldPassError && (
            <p style={{ color: "red", marginTop: "5px" }}>{oldPassError}</p>
          )}
        </div>
        <div>
          <label>
            New Password:
            <input
              type={showPassword ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </label>
          {newPassError && (
            <p style={{ color: "red", marginTop: "5px" }}>{newPassError}</p>
          )}
        </div>
        <button onClick={handleUpdatePassword} disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Password"}
        </button>
        {mutation.isError && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {mutation.error?.message}
          </p>
        )}
        {mutation.isSuccess && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Password updated successfully!
          </p>
        )}
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword((prev) => !prev)}
        />
      </form>
    </div>
  );
}
