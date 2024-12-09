import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/fileupload/$ticket-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const [file, setFile] = useState<File | null>(null);

  const { "ticket-id": ticketId } = Route.useParams();
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const file_name = file.name;
      const file_type = file.type;
      const file_size = Math.ceil(file?.size / 1024);
      console.log(file_name, file_type, file_size);

      const res = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/attachment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "form-data",
          },
          body: JSON.stringify({ file_name, file_type, file_size }),
        }
      );
      if (!res.ok) {
        throw new Error("failed  upload for getting the URL");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        console.log(data.data);
        const url = data.data;
        postUrl(url);
      }
    },
    onError: (error) => {
      alert(`${error.message}`);
    },
  });

  const postUrl = async (url: string) => {
    //  e.preventDefault();
    console.log(url);
    const res = await fetch(url, {
      method: "PUT",
      body: file,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return res.json();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      mutate();
    } else {
      alert("insert the file");
    }
  };

  return (
    <div>
      <h1>upload files</h1>

      <>
        <form
          style={{ textAlign: "center", marginTop: "50px" }}
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          ></input>
          <button type="submit">upload file</button>
        </form>
      </>
    </div>
  );
}
