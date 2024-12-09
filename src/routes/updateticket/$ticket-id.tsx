// import * as React from "react";
// import { createFileRoute } from "@tanstack/react-router";
// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";

// export const Route = createFileRoute("/updateticket/$ticket-id")({
//   component: RouteComponent,
// });

// function RouteComponent() {
//   const { "ticket-id": ticketId } = Route.useParams();
//   console.log(ticketId);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("low");

//   const token = localStorage.getItem("accessToken");
//   const navigate = useNavigate();

//   if (!token) {
//     alert(
//       "No access token found in the local storage. Please log in to view the ticket data."
//     );
//     navigate({ to: "/signIn" });
//     return null;
//   }

//   const fetchTickets = useCallback(async () => {
//     const res = await fetch(
//       `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (!res.ok) {
//       throw new Error("Failed to fetch the ticket data");
//     }
//     return await res.json();
//   }, [ticketId, token]);

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["tickets", ticketId],
//     queryFn: fetchTickets,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     if (data?.data) {
//       setTitle(data.data.title);
//       setDescription(data.data.description);
//       setPriority(data.data.priority);
//     }
//   }, [data]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ title, description, priority }),
//         }
//       );

//       if (response.ok) {
//         alert("Ticket updated successfully!");
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message);
//       }
//     } catch (error) {
//       alert("Network error. Please try again later.");
//     }
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }
//   if (isError) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div>
//       <h1>Update the Ticket</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Title:</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <br />
//           <br />
//           <label>Description:</label>
//           <input
//             type="text"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//           <br />
//           <br />
//           <label>Priority:</label>
//           <select
//             value={priority}
//             onChange={(e) => setPriority(e.target.value)}
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//           <br />
//           <br />
//           <button type="submit">Update Ticket</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default React.memo(RouteComponent);

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/updateticket/$ticket-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "ticket-id": ticketId } = Route.useParams();
  console.log(ticketId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [status, setStatus] = useState<string>("open");
  const [priorityError, setPriorityError] = useState<string>("");
  const [statusError, setStatusError] = useState<string>("");
  const [genericError, setGenericError] = useState<string>("");

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  if (!token) {
    alert(
      "No access token found in the local storage. Please log in to view the ticket data."
    );
    navigate({ to: "/signIn" });
    return null;
  }

  const fetchTickets = useCallback(async () => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch the ticket data");
    }
    return await res.json();
  }, [ticketId, token]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tickets", ticketId],
    queryFn: fetchTickets,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setDescription(data.data.description);
      setPriority(data.data.priority);
      setStatus(data.data.status);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setTitleError("");
    setDescriptionError("");
    setPriorityError("");
    setStatusError("");
    setGenericError("");

    try {
      const response = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, priority, status }),
        }
      );

      if (response.ok) {
        alert("Ticket updated successfully!");
        setTimeout(() => navigate({ to: "/dashboard" }), 1000);
      } else {
        const errorData = await response.json();

        if (errorData.errorData && errorData.errorData.nested) {
          const { title, description, priority, status } =
            errorData.errorData.nested;

          if (title && title.length > 0) {
            setTitleError(title.join(", "));
          }
          if (description && description.length > 0) {
            setDescriptionError(description.join(", "));
          }
          if (priority && priority.length > 0) {
            setPriorityError(priority.join(", "));
          }
          if (status && status.length > 0) {
            setStatusError(status.join(", "));
          }
        } else {
          setGenericError(
            errorData.message ||
              "An unexpected error occurred. Please try again."
          );
        }
      }
    } catch (error) {
      setGenericError("Network error. Please try again later.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Update the Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleError && <p style={{ color: "red" }}>{titleError}</p>}
          <br />
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {descriptionError && (
            <p style={{ color: "red" }}>{descriptionError}</p>
          )}
          <br />
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {priorityError && <p style={{ color: "red" }}>{priorityError}</p>}
          <br />
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="inprogress">In Progress</option>
          </select>
          {statusError && <p style={{ color: "red" }}>{statusError}</p>}
          {genericError && (
            <p style={{ color: "red", marginTop: "10px" }}>{genericError}</p>
          )}
          <button type="submit">Update Ticket</button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(RouteComponent);
