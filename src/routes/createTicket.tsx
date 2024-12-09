// import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// export const Route = createFileRoute("/createTicket")({
//   component: CreateTicket,
// });

// function CreateTicket() {
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [priority, setPriority] = useState<string>("low");
//   const [message, setMessage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const token = localStorage.getItem("accessToken");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       setMessage("You need to log in to create a ticket.");
//       alert("you need to login first then only you can create the ticket");
//       navigate({ to: "/signIn" });
//       return;
//     }
//   }, [token]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");

//     const ticketData = {
//       title,
//       description,
//       priority,
//     };

//     try {
//       const response = await fetch(
//         "https://api-ticketmanagement.onrender.com/v1.0/tickets",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(ticketData),
//         }
//       );

//       if (response.ok) {
//         setSuccessMessage("Ticket Created Successfully");
//         setTitle("");
//         setDescription("");
//         setPriority("low");
//         const data = await response.json();
//         console.log(data);

//         setTimeout(() => navigate({ to: "/dashboard" }), 1000);
//       } else {
//         const errorData = await response.json();
//         if (errorData.errorData && errorData.errorData.nested) {
//           const { title, description } = errorData.errorData.nested;
//           const errors = [...(title || []), ...(description || [])];
//           setMessage(errors.join(", "));
//         } else {
//           setMessage("An unknown error occurred. Please try again.");
//         }
//       }
//     } catch (error) {
//       setMessage("Network error. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>Create a New Ticket</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>
//             Title:
//             <Input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Description:
//             <Textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Priority:
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               required
//             >
//               <option value="low">low</option>
//               <option value="medium">medium</option>
//               <option value="high">high</option>
//             </select>
//           </label>
//         </div>
//         <Button type="submit" disabled={isLoading}>
//           Create Ticket
//         </Button>
//       </form>
//       {message && (
//         <div style={{ marginTop: "20px", color: "red" }}>
//           <p>{message}</p>
//         </div>
//       )}
//       {successMessage && (
//         <div style={{ marginTop: "20px", color: "green" }}>
//           <p>{successMessage}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreateTicket;

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/createTicket")({
  component: CreateTicket,
});

function CreateTicket() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("low");
  const [message, setMessage] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [priorityError, setPriorityError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("You need to log in first to create a ticket.");
      navigate({ to: "/signIn" });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTitleError("");
    setDescriptionError("");
    setPriorityError("");
    setMessage("");
    setSuccessMessage("");

    const ticketData = { title, description, priority };

    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      if (response.ok) {
        setSuccessMessage("Ticket created successfully!");
        setTitle("");
        setDescription("");
        setPriority("low");
        setTimeout(() => navigate({ to: "/dashboard" }), 1000);
      } else {
        const errorData = await response.json();
        if (errorData.errorData && errorData.errorData.nested) {
          const { title, description, priority } = errorData.errorData.nested;

          if (title && title.length > 0) {
            setTitleError(title.join(", "));
          }

          if (description && description.length > 0) {
            setDescriptionError(description.join(", "));
          }
          if (priority && priority.length > 0) {
            setPriorityError(priority.join(", "));
          }
        } else {
          setMessage("An unknown error occurred. Please try again.");
        }
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Create a New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          {titleError && <p style={{ color: "red" }}>{titleError}</p>}
        </div>
        <div>
          <label>
            Description:
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {descriptionError && (
            <p style={{ color: "red" }}>{descriptionError}</p>
          )}
        </div>
        <div>
          <label>
            Priority:
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="open">low</option>
              <option value="closed">medium</option>
              <option value="inprogress">high</option>
            </select>
          </label>
          {priorityError && <p style={{ color: "red" }}>{priorityError}</p>}
        </div>
        <Button type="submit" disabled={isLoading}>
          Create Ticket
        </Button>
      </form>
      {message && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>{message}</p>
        </div>
      )}
      {successMessage && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default CreateTicket;
