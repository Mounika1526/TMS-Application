// import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import { useState } from "react";

// export const Route = createFileRoute("/signUp")({
//   component: Signup,
// });

// function Signup() {
//   const [full_name, setFullName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [successMessage, setSuccessMessage] = useState<string>("");

//   const navigate = useNavigate();

//   // const validatePassword = (password: string) => {
//   //   const regex =
//   //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
//   //   return regex.test(password);
//   // };

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // if (!full_name.trim()) {
//     //   setErrorMessage("Full name is required.");
//     //   // return;
//     // }

//     // if (!validatePassword(password)) {
//     //   setErrorMessage(
//     //     "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
//     //   );
//     //   return;
//     // }

//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const response = await fetch(
//         "https://api-ticketmanagement.onrender.com/v1.0/user/signup",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ full_name, email, password }),
//         }
//       );

//       if (response.ok) {
//         setSuccessMessage(
//           "Account created successfully! Redirecting to signin..."
//         );
//         setTimeout(() => navigate({ to: "/signIn" }), 2000);
//       } else {
//         const errorData = await response.json();
//         if (response.status === 400) {
//           setErrorMessage(
//             errorData.message || "Invalid request. Please try again."
//           );
//         } else if (response.status === 409) {
//           setErrorMessage(
//             "Account already exists. Please use a different email."
//           );
//         } else {
//           setErrorMessage(
//             errorData.message ||
//               "An unexpected error occurred. Please try again later."
//           );
//         }
//       }
//     } catch (error) {
//       setErrorMessage("Network error. Please check your connection.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>Create an Account</h2>
//       <form
//         onSubmit={handleSignUp}
//         style={{
//           display: "inline-block",
//           textAlign: "left",
//           padding: "50px",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <div>
//           <label>Full Name:</label>
//           <input
//             type="text"
//             value={full_name}
//             onChange={(e) => setFullName(e.target.value)}
//             // required
//             style={{
//               display: "block",
//               marginBottom: "15px",
//               padding: "12px",
//               width: "100%",
//               maxWidth: "400px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             // required
//             style={{
//               display: "block",
//               marginBottom: "15px",
//               padding: "12px",
//               width: "100%",
//               maxWidth: "400px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             // required
//             style={{
//               display: "block",
//               marginBottom: "15px",
//               padding: "12px",
//               width: "100%",
//               maxWidth: "400px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//         {errorMessage && (
//           <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
//         )}
//         {successMessage && (
//           <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
//         )}
//         <button
//           type="submit"
//           style={{
//             display: "block",
//             marginTop: "10px",
//             padding: "12px",
//             width: "100%",
//             maxWidth: "400px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           Sign Up
//         </button>
//       </form>
//       <p style={{ marginTop: "20px" }}>
//         Already have an account?{" "}
//         <button
//           onClick={() => navigate({ to: "/signIn" })}
//           style={{
//             background: "none",
//             border: "none",
//             color: "blue",
//             cursor: "pointer",
//             textDecoration: "underline",
//           }}
//         >
//           Sign In
//         </button>
//       </p>
//     </div>
//   );
// }

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/signUp")({
  component: Signup,
});

function Signup() {
  const [full_name, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [genericError, setGenericError] = useState<string>("");

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setGenericError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ full_name, email, password }),
        }
      );

      if (response.ok) {
        setSuccessMessage(
          "Account created successfully! Redirecting to signin..."
        );
        setTimeout(() => navigate({ to: "/signIn" }), 2000);
      } else {
        const errorData = await response.json();

        if (errorData.errorData && errorData.errorData.nested) {
          const { full_name, email, password } = errorData.errorData.nested;

          if (full_name && full_name.length > 0) {
            setFullNameError(full_name.join(", "));
          }
          if (email && email.length > 0) {
            setEmailError(email.join(", "));
          }
          if (password && password.length > 0) {
            setPasswordError(password.join(", "));
          }
        } else {
          setGenericError(
            errorData.message ||
              "An unexpected error occurred. Please try again."
          );
        }
      }
    } catch (error) {
      setGenericError("Network error. Please check your connection.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Create an Account</h2>
      <form
        onSubmit={handleSignUp}
        style={{
          display: "inline-block",
          textAlign: "left",
          padding: "50px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              display: "block",
              marginBottom: "5px",
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          {fullNameError && <p style={{ color: "red" }}>{fullNameError}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "block",
              marginBottom: "5px",
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "block",
              marginBottom: "5px",
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
        {genericError && (
          <p style={{ color: "red", marginTop: "10px" }}>{genericError}</p>
        )}
        {successMessage && (
          <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
        )}
        <button
          type="submit"
          style={{
            display: "block",
            marginTop: "10px",
            padding: "12px",
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <button
          onClick={() => navigate({ to: "/signIn" })}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
