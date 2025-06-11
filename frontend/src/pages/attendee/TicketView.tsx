// src/pages/TicketViewer.tsx
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTicketByIdAPI } from "@/services/TicketService";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TicketViewer() {
  const { ticketId } = useParams();
  const ticketRef = useRef(null);

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketByIdAPI(ticketId as string),
  });

  const downloadPDF = async () => {
    const input = ticketRef.current;
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Eventify_Ticket_${ticketId}.pdf`);
  };

  if (isLoading) return <p>Loading...</p>;

  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1222] px-4 py-10">
      <div
        ref={ticketRef}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">{ticket.eventTitle}</h2>
        <p>
          <strong>Date:</strong> {ticket.date}
        </p>
        <p>
          <strong>Time:</strong> {ticket.time}
        </p>
        <p>
          <strong>Location:</strong> {ticket.location}
        </p>
        <p>
          <strong>Ticket ID:</strong> {ticket.id}
        </p>
        <img src={ticket.qrCodeUrl} alt="QR Code" className="w-32 mt-4" />
      </div>

      <div className="mt-6 text-center">
        <Button onClick={downloadPDF} className="mt-4">
          Download Ticket as PDF
        </Button>
      </div>
    </div>
  );
}
