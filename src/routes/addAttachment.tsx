import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/addAttachment")({
  component: AddAttachment,
});

function AddAttachment() {
  const [ticketId, setTicketId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setResponseMessage("");
    setError("");

    try {
      const response = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/attachment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "form-data",
            Authorization: `Bearer ${token}`,
          },
          body: file,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      setResponseMessage("File uploaded successfully!");

      setFile(null);
      setTicketId("");
      setResponseMessage("");
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to upload file.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Attachment</h1>
      <form onSubmit={handleFileUpload}>
        <div>
          <Label htmlFor="ticketId">Ticket ID:</Label>
          <Input
            type="text"
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID"
            required
          />
        </div>
        <div>
          <Label htmlFor="file">File:</Label>
          <Input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
            style={{ cursor: "pointer" }}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Attachment"}
        </Button>
      </form>
      {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AddAttachment;
