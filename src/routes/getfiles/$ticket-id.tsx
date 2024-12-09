import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
export const Route = createFileRoute("/getfiles/$ticket-id")({
  component: getfilescomponent,
});

function getfilescomponent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { "ticket-id": ticketId } = Route.useParams();
  if (!token) {
    alert(
      "no access token found in the localstorage. so please login to view the tickets data"
    );

    navigate({ to: "/signIn" });
  }
  const fetchfiles = async () => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/attachment`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("failed to get files url");
    }
    return await res.json();
  };

  const { data } = useQuery({
    queryKey: ["Comments", ticketId],
    queryFn: fetchfiles,
  });
  // console.log(data);

  return (
    <>
      <p> Hello to the files</p>
      {data?.data?.map((file: string, index: number) => (
        <div key={index}>
          <br />

          <p>URL: {file}</p>
        </div>
      ))}
    </>
  );
}
