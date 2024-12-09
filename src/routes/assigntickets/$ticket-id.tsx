import { createFileRoute } from "@tanstack/react-router";

import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/assigntickets/$ticket-id")({
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
  const fetchAgents = async () => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/assign`,
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Agents", ticketId],
    queryFn: fetchAgents,
  });
  console.log(data);
  const handleAssign = useMutation({
    mutationFn: async (agentId: number) => {
      const res = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ agent_id: agentId }),
        }
      );
      if (!res.ok) {
        throw new Error("failed  to assign ticket");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        alert("ticket assigned successfuly");
        navigate({ to: "/users" });
      }
    },
    onError: (error) => {
      alert(`${error.message}`);
    },
  });

  interface Agent {
    id: number;
    full_name: string;
    email: string;
    status: string;
  }

  return (
    <div>
      <h1>Asign tickets to the Agents</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error:{error?.message}</p>
      ) : (
        <>
          <p>Ticket ID:{ticketId}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "50px",
            }}
          >
            {data?.data?.map((agent: Agent) => (
              <div
                style={{
                  border: "2px solid #ccc",
                  padding: "50px",
                  width: "300px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                }}
                key={agent.id}
              >
                <h3 style={{ textAlign: "center" }}>{agent.full_name}</h3>
                <p>
                  <strong>Id:</strong>
                  {agent.id}
                </p>
                <Button onClick={() => handleAssign.mutate(agent.id)}>
                  Assign{" "}
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
