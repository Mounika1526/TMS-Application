import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
export const Route = createFileRoute("/getsingleticket/$ticket-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "ticket-id": ticketId } = Route.useParams();
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  if (!token) {
    alert(
      "no access token found in the localstorage. so please login to view the tickets data"
    );

    navigate({ to: "/signIn" });
  }
  const fetchTicket = async () => {
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
      throw new Error("failed to fetch comments data");
    }
    return await res.json();
    console.log(res);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singelticket", ticketId],
    queryFn: fetchTicket,
  });
  console.log(data);

  return (
    <div>
      <h1>Ticket details for the ticket: {ticketId}</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error:{error?.message}</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "50px",
            }}
          >
            <div
              style={{
                border: "2px solid #ccc",
                padding: "50px",
                width: "300px",
                background: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ textAlign: "center" }}>
                <strong>{data.data.title}</strong>
              </h3>

              <p>
                <strong>Descriotion:</strong>
                {data.data.description}
              </p>
              <p>
                <strong>Assigned to :</strong>
                {data.data.assigned_to}
              </p>
              <p>
                <strong>Status :</strong>
                {data.data.status}
              </p>
              <p>
                <strong>priority :</strong>
                {data.data.priority}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
