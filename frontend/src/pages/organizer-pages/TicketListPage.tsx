import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search, QrCode, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useOrganizerTickets } from "@/components/project/auth/useOrganizerTickets";
import CustomAlertMessageDialog from "@/components/project/AlertMessageDialog";
import { useAuth } from "@/context/AuthContext";
import { RejectQRAPI, VerifyQRAPI } from "@/services/QRService";

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-50",
  booked: "text-green-500 bg-green-50",
  expired: "text-gray-400 bg-gray-50",
  cancelled: "text-red-500 bg-red-50",
};

const TicketListPage = () => {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [alert,setAlert]=useState({title:"",description:"",type:"",pathname:""})
  const { token } = useAuth();
  const { data, isLoading, error } = useOrganizerTickets({
    page,
    search,
    status: statusFilter !== "all" ? statusFilter : "",
    eventId: eventFilter !== "all" ? eventFilter : "",
  });


  const tickets = data?.tickets || [];


  const handleViewQR = (ticket: any) => {
    setSelectedTicket(ticket);
    setQRModalOpen(true);
  };
  const verifyMutation = useMutation({
    mutationFn: (qrId: string) => VerifyQRAPI(qrId, token as string),
    mutationKey: ["verifyQR"],
    onMutate:()=>{
    },
    onSuccess:()=>{
      setAlert({title:"Success",description:"QR verified successfully",type:"success",pathname:"/dashboard/organizer"})
    },
    onError:(error:any)=>{
      setAlert({title:"Error",description:error.message,type:"error",pathname:"/dashboard/organizer"})
    }
  });
  const handleVerify = (qrId: string) => {
    verifyMutation.mutate(qrId)
  }
  const rejectMutation = useMutation({
    mutationFn: (qrId: string) => RejectQRAPI(qrId, token as string),
    mutationKey: ["rejectQR"],
    onMutate:()=>{
    },
    onSuccess:()=>{
      setAlert({title:"Success",description:"QR rejected successfully",type:"success",pathname:"/dashboard/organizer"})
    },
    onError:(error:any)=>{
      setAlert({title:"Error",description:error.message,type:"error",pathname:"/dashboard/organizer"})
    }
  });

  const handleReject = (qrId: string) => {
    rejectMutation.mutate(qrId)
  }


  if (error) {
    return <CustomAlertMessageDialog title="Error" description={error.message} type="error" pathname="/dashboard/organizer" />
  }

  if (isQRModalOpen && selectedTicket) {
    return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setQRModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-[#ffa509] animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-[#ffa509] hover:text-[#ff7f00] transition-colors"
              onClick={() => {
                setQRModalOpen(false);
                setSelectedTicket(null);
              }}
              aria-label="Close"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6"/>
              </svg>
            </button>
            <h2 className="text-2xl font-extrabold mb-6 text-[#050b2c] flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-[#ffa509] rounded-full mr-2"></span>
              QR Payment Details
            </h2>
            <div className="space-y-4 text-base text-[#22223b]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#ffa509]">Amount:</span>
                <span className="ml-1 text-[#050b2c] font-bold text-lg">₹{selectedTicket.qrGeneration.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#ffa509]">Quantity:</span>
                <span className="ml-1">{selectedTicket.qrGeneration.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#ffa509]">UPI ID:</span>
                <span className="ml-1">{selectedTicket.qrGeneration.upiId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#ffa509]">Status:</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                    selectedTicket.qrGeneration.status === "success"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : selectedTicket.qrGeneration.status === "pending"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {selectedTicket.qrGeneration.status}
                </span>
              </div>
              {selectedTicket.qrGeneration.proofImageUrl?.url && (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-[#ffa509]">Proof Image:</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTicket.qrGeneration.proofImageUrl.url}
                      alt="Proof"
                      className="w-36 h-36 border-2 border-[#ffa509] rounded-lg object-cover shadow"
                    />
                    <a
                      href={selectedTicket.qrGeneration.proofImageUrl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ffa509] underline text-sm hover:text-[#ff7f00] transition"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                className="bg-[#ffa509] text-white hover:bg-[#ff7f00] px-6 py-2 rounded-lg font-semibold shadow"
                onClick={() => {
                  setQRModalOpen(false);
                  setSelectedTicket(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      );
  }

  if(alert.title){
    return <CustomAlertMessageDialog title={alert.title} description={alert.description} type={alert.type} pathname={alert.pathname} />
  }

  return (
    <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-[#050b2c] tracking-tight">
          <span className="text-[#ffa509]">Tickets</span> Dashboard
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#ffa509] text-[#ffa509] hover:bg-[#ffa509] hover:text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow flex flex-col md:flex-row gap-4 p-4 items-center">
        <Input
          placeholder="Search by user name, email and event name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50"
        />
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="bg-gray-50">Event</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {/* Add dynamic event options if needed */}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-50">Status</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#050b2c] text-white">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Event</th>
              <th className="p-4">Status</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Price</th>
              <th className="p-4">Total</th>
              <th className="p-4">QR</th>
              <th className="p-4">Proof</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="text-center p-8">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto text-[#ffa509]" />
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-400">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket: any) => (
                <tr
                  key={ticket._id}
                  className="border-b last:border-b-0 hover:bg-[#f3f4f6] transition"
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{ticket.user?.username}</div>
                      <div className="text-xs text-gray-500">
                        {ticket.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{ticket.event?.title}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[ticket.status] ||
                        "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ticket.status === "pending" && (
                        <QrCode className="w-4 h-4 mr-1" />
                      )}
                      {ticket.status === "booked" && (
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                      )}
                      {ticket.status === "expired" && (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.qrGeneration?.quantity || "-"}
                  </td>
                  <td className="p-4">
                    ₹
                    {ticket.qrGeneration?.amount /
                      ticket.qrGeneration?.quantity || "-"}
                  </td>
                  <td className="p-4">₹{ticket.qrGeneration?.amount || "-"}</td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewQR(ticket)}
                      className="border-[#ffa509] text-[#ffa509] hover:bg-[#ffa509] hover:text-white"
                    >
                      View
                    </Button>
                  </td>
                  <td className="p-4">
                    <img
                      src={ticket.qrGeneration?.proofImageUrl?.url}
                      alt="proof"
                      className="h-10 w-10 object-cover rounded border"
                    />
                  </td>
                  <td className="p-4">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 items-center justify-center flex gap-2">
                    
                    {ticket.qrGeneration.status === "pending" ? (
                      <>
                        <Button
                          onClick={() => {
                            handleVerify(ticket.qrGeneration._id);
                          }}
                          className="bg-[#ffa509] hover:bg-[#ff8800] text-white"
                          size="sm"
                        >
                          Verify
                        </Button>
                        <Button
                          onClick={() => {
                            handleReject(ticket.qrGeneration._id);
                          }}
                          variant="destructive"
                          size="sm"
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      ticket.qrGeneration.status === "verified" ? (
                        <span className="text-sm items-center justify-center flex gap-2 text-green-500">Verified <CheckCircle2 className="w-4 h-4" /></span>
                      ) : (
                        <span className="text-sm items-center justify-center flex gap-2 text-red-500">Rejected <XCircle className="w-4 h-4" /></span>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default TicketListPage;
