import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/comment")({
  component: RouteComponent,
});

function RouteComponent() {
  const [comment, setComment] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    setError("");

    try {
      const response = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // const result = await response.json();
      setResponseMessage("Comment added successfully!");
      setTicketId("");
      setComment("");
      setResponseMessage("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to add comment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Comment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Label>Ticket ID:</Label>
          <Input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID"
            required
          />
        </div>
        <div>
          <Label>Comment:</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
            required
          ></Textarea>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Comment"}
        </Button>
      </form>
      {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
