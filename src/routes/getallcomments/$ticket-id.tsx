// import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import { useNavigate } from "@tanstack/react-router";
// import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
// import { useLocation } from "@tanstack/react-router";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// export const Route = createFileRoute("/getallcomments/$ticket-id")({
//   component: RouteComponent,
// });
// function RouteComponent() {
//   const [reply, setReply] = useState("");
//   const { "ticket-id": ticketId } = Route.useParams();
//   const location = useLocation();
//   interface LocationState {
//     requestedBy: string;
//   }
//   const state = location.state as LocationState;
//   const { requestedBy } = state;
//   const queryClient = useQueryClient();
//   const token = localStorage.getItem("accessToken");
//   const loginusrid = localStorage.getItem("userId");
//   console.log(loginusrid);
//   const navigate = useNavigate();
//   if (!token) {
//     alert(
//       "no access token found in the localstorage. so please login to view the tickets data"
//     );
//     navigate({ to: "/signIn" });
//     return null;
//   }
//   const fetchComments = async () => {
//     const res = await fetch(
//       `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (!res.ok) {
//       throw new Error("failed to fetch comments data");
//     }
//     return await res.json();
//     console.log(res);
//   };
//   interface CommentData {
//     data: Comment[];
//   }
//   const {
//     data: commentsData,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<CommentData>({
//     queryKey: ["Comments", ticketId],
//     queryFn: fetchComments,
//   });
//   const postComment = async (newComment: string) => {
//     const res = await fetch(
//       `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newComment),
//       }
//     );
//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message);
//     }
//     return res.json();
//   };
//   const mutation = useMutation({
//     mutationFn: postComment,
//     onSuccess: () => {
//       setReply("");
//       queryClient.invalidateQueries({ queryKey: ["Comments", ticketId] });
//     },
//     onError: (err) => {
//       alert(err.message);
//     },
//   });
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!reply.trim()) {
//       alert("Please enter a valid comment");
//       return;
//     }
//     mutation.mutate(reply);
//   };
//   //delete comment
//   const deletecomment = async (commentId: string) => {
//     const res = await fetch(
//       `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment/${commentId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message);
//     }
//     const data = await res.json();
//     return data;
//   };
//   // delete
//   const deleteMutation = useMutation({
//     mutationFn: deletecomment,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["Comments"] });
//       alert("comment deleted successfully!");
//     },
//     onError: () => {
//       alert("Failed to delete  the comment. Please try again.");
//     },
//   });

//   interface Comment {
//     id: string;
//     user_id: string;
//     created_at: string;
//     comment: string;
//   }
//   return (
//     <div>
//       <h1>Specific ticket comments</h1>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : isError ? (
//         <p>Error:{error?.message}</p>
//       ) : (
//         <>
//           <p>Ticket ID:{ticketId}</p>
//           <p>Requested By:{requestedBy}</p>
//           {commentsData?.data?.map((comment: Comment) => (
//             <div key={comment.id}>
//               <br />
//               {comment.user_id == loginusrid ? (
//                 <p>you</p>
//               ) : (
//                 <p>from:{comment.user_id}</p>
//               )}
//               <p>{new Date(comment.created_at).toLocaleDateString()}</p>
//               <p>comment: {comment.comment}</p>
//               <p>comement id:{comment.id}</p>
//               <button onClick={() => deleteMutation.mutate(comment.id)}>
//                 {" "}
//                 Delete{" "}
//               </button>
//             </div>
//           ))}
//           <form
//             style={{ textAlign: "center", marginTop: "50px" }}
//             onSubmit={handleSubmit}
//           >
//             <Textarea
//               value={reply}
//               onChange={(e) => setReply(e.target.value)}
//             ></Textarea>
//             <Button type="submit" disabled={mutation.isLoading}>
//               send
//             </Button>
//             {/* <Button type="submit" disabled={mutation.status === "pending"}>
//               {mutation.status === "pending" ? "Sending..." : "Send"}
//             </Button> */}
//             {/* <Button type="submit" disabled={mutation.isLoading}>
//               {mutation.isLoading ? "Sending..." : "Send"}
//             </Button> */}
//           </form>
//         </>
//       )}
//     </div>
//   );
// }

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/getallcomments/$ticket-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const [reply, setReply] = useState("");
  const { "ticket-id": ticketId } = Route.useParams();
  const location = useLocation();
  interface LocationState {
    requestedBy: string;
  }
  const state = location.state as LocationState;
  const { requestedBy } = state;
  const queryClient = useQueryClient();

  const token = localStorage.getItem("accessToken");
  const loginusrid = localStorage.getItem("userId");
  const navigate = useNavigate();
  if (!token) {
    alert(
      "no access token found in the localstorage. so please login to view the tickets data"
    );

    navigate({ to: "/signIn" });
  }
  const fetchComments = async () => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("failed to fetch comments data");
    }
    return await res.json();
  };

  const {
    data: commentsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Comments", ticketId],
    queryFn: fetchComments,
  });

  const postComment = async (newComment: { comment: string }) => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newComment),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return res.json();
  };

  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["Comments", ticketId] });
    },
    onError: (err) => {
      alert(err.message);
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) {
      alert("Please enter a valid comment");
      return;
    }
    mutation.mutate({ comment: reply });
  };
  const deletecomment = async (commentId: string) => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    const data = await res.json();
    return data;
  };

  const deleteMutation = useMutation({
    mutationFn: deletecomment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
      alert("comment deleted successfully!");
    },
    onError: () => {
      alert("Failed to delete  the comment. Please try again.");
    },
  });
  interface Comment {
    comment_id: string;
    user_id: string;
    created_at: string;
    comment: string;
  }

  return (
    <div>
      <h1>Specific ticket comments</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error:{error?.message}</p>
      ) : (
        <>
          <p>Ticket ID:{ticketId}</p>
          <p>Requested By:{requestedBy}</p>
          {commentsData?.data?.map((comment: Comment) => (
            <div key={comment.comment_id}>
              <br />
              {comment.user_id == loginusrid ? (
                <p>you</p>
              ) : (
                <p>from:{comment.user_id}</p>
              )}

              <p>{new Date(comment.created_at).toLocaleDateString()}</p>
              <p>comment: {comment.comment}</p>
              <p>comement id:{comment.comment_id}</p>
              <button onClick={() => deleteMutation.mutate(comment.comment_id)}>
                {" "}
                Delete{" "}
              </button>
            </div>
          ))}
          <form
            style={{ textAlign: "center", marginTop: "50px" }}
            onSubmit={handleSubmit}
          >
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            ></Textarea>
            <Button type="submit" disabled={mutation.status === "pending"}>
              {mutation.status === "pending" ? "Sending..." : "Send"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
