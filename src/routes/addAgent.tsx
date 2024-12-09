// import React, { useState, useEffect } from "react";
// import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export const Route = createFileRoute("/addAgent")({
//   component: AddAgent,
// });

// function AddAgent() {
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//     user_type: "",
//   });
//   const [responseMessage, setResponseMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [passwordError, setPasswordError] = useState<string | null>(null);
//   const token = localStorage.getItem("accessToken");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       setMessage("You need to login to create a user or developer.");
//       alert("you need to login first then only you can add the Agent");
//       navigate({ to: "/signIn" });
//       return;
//     }
//   }, [token]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setResponseMessage("");

//     try {
//       const response = await fetch(
//         "https://api-ticketmanagement.onrender.com/v1.0/user/add-agent",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       if (response.ok) {
//         setResponseMessage(`${formData.user_type} Created Successfully`);
//       } else {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           setResponseMessage("You are not an Admin");
//         } else if (response.status === 422) {
//           setResponseMessage("Invalid Data. Please Check");
//         } else {
//           setResponseMessage(
//             errorData.message ||
//               " An Unexpected error occured. Please try again"
//           );
//         }
//       }
//     } catch (err) {
//       const errorMessage = (err as Error).message;
//       setError(errorMessage || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {message && <p style={{ color: "red" }}>{message}</p>}
//       <h1>Add Agent</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <Label>Full Name:</Label>
//           <Input
//             type="text"
//             name="full_name"
//             value={formData.full_name}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <Label>Email:</Label>
//           <Input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <Label>Password:</Label>
//           <Input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <Label>User Type:</Label>
//           <select
//             name="user_type"
//             value={formData.user_type}
//             onChange={handleChange}
//           >
//             <option value="developer">Developer</option>
//             <option value="user">User</option>
//           </select>
//         </div>
//         <Button type="submit" disabled={loading}>
//           {loading ? "Adding..." : "Add Agent"}
//         </Button>
//       </form>
//       {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/addAgent")({
  component: AddAgent,
});

function AddAgent() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    user_type: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    user_type: "",
  });
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("You need to login first to add an agent.");
      navigate({ to: "/signIn" });
      return;
    }
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    setFieldErrors({
      full_name: "",
      email: "",
      password: "",
      user_type: "",
    });

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/add-agent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setResponseMessage(`${formData.user_type} Created Successfully`);
      } else {
        const errorData = await response.json();
        if (response.status === 422 && errorData.errorData?.nested) {
          setFieldErrors(errorData.errorData.nested);
        } else {
          setResponseMessage(
            errorData.message ||
              "An unexpected error occurred. Please try again."
          );
        }
      }
    } catch (err) {
      setResponseMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Agent</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Label>Full Name:</Label>
          <Input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
          {fieldErrors.full_name && (
            <p style={{ color: "red" }}>{fieldErrors.full_name}</p>
          )}
        </div>
        <div>
          <Label>Email:</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <p style={{ color: "red" }}>{fieldErrors.email}</p>
          )}
        </div>
        <div>
          <Label>Password:</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p style={{ color: "red" }}>{fieldErrors.password}</p>
          )}
        </div>
        <div>
          <Label>User Type:</Label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
          >
            <option value="">Select User Type</option>
            <option value="developer">Developer</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {fieldErrors.user_type && (
            <p style={{ color: "red" }}>{fieldErrors.user_type}</p>
          )}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Agent"}
        </Button>
      </form>
      {responseMessage && (
        <p
          style={{
            color: responseMessage.includes("Successfully") ? "green" : "red",
          }}
        >
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default React.memo(AddAgent);
