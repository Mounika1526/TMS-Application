import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
interface ErrorData {
  nested?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
}

type CustomError = ErrorData & Error;
export const Route = createFileRoute("/signIn")({
  component: RouteComponent,
});
function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const navigate = useNavigate();
  const validateemail = (email: string) => {
    if (!email) {
      return "email is required";
    }
    return null;
  };
  const validatepassword = (password: string) => {
    if (!password) {
      return "passwrod is required";
    }
    return null;
  };

  const loginMutation = useMutation({
    mutationFn: async (fldata: { email: string; password: string }) => {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fldata),
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        if (data.errorData) {
          throw data.errorData;
        }
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage("login successful redirecting to the dashboard...");
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("accessToken", data.data.token);
      localStorage.setItem("userId", data.data.user_id);
      setTimeout(() => navigate({ to: "/dashboard" }), 2500);
    },
    onError: (error) => {
      setGeneralError(null);
      if ((error as CustomError)?.nested) {
        setEmailError((error as CustomError).nested?.email?.[0] || null);
        setPasswordError((error as CustomError).nested?.password?.[0] || null);
      } else {
        setGeneralError(error.message);
      }
    },
  });
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);
    setSuccessMessage(null);
    const emailValidation = validateemail(email);
    const passwordValidation = validatepassword(password);
    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      return;
    }
    loginMutation.mutate({ email, password });
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
        {generalError && <p style={{ color: "red" }}>{generalError}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
