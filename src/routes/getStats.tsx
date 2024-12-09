import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/getStats")({
  component: RouteComponent,
});

const fetchDashboardStats = async (token: string) => {
  const res = await fetch(
    "https://api-ticketmanagement.onrender.com/v1.0/user/dashboard/stats",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  const data = await res.json();
  return data.data;
};

function RouteComponent() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <p>No access token found. Please log in to view stats.</p>;
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => fetchDashboardStats(token),
  });
  if (isLoading) {
    return <p>Loading stats...</p>;
  }
  if (isError) {
    return <p>Error:{error.message}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stats</h1>
      <table
        style={{
          width: "100%",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th>Stat</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Tickets</td>
            <td>{data.total_tickets_count}</td>
          </tr>
          <tr>
            <td>Pending Tickets</td>
            <td>{data.pending_tickets_count}</td>
          </tr>
          <tr>
            <td>Closed Tickets</td>
            <td>{data.closed_tickets_count}</td>
          </tr>
          <tr>
            <td>High Priority Tickets</td>
            <td>{data.high_priority_tickets_count}</td>
          </tr>
          <tr>
            <td>Medium Priority Tickets</td>
            <td>{data.medium_priority_tickets_count}</td>
          </tr>
          <tr>
            <td>Low Priority Tickets</td>
            <td>{data.low_priority_tickets_count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
