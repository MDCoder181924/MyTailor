import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  ArrowRight,
  Mail,
  User,
  ShoppingBag,
  Scissors
} from "lucide-react";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [replyingTicket, setReplyingTicket] = useState(null);
  
  // Reply form states
  const [replyMessage, setReplyMessage] = useState("");
  const [ticketStatus, setTicketStatus] = useState("Resolved");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/support-tickets/admin");
      setTickets(res.data.tickets || []);
    } catch {
      toast.error("Failed to fetch support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenReplyModal = (ticket) => {
    setReplyingTicket(ticket);
    setReplyMessage(ticket.adminReply || "");
    setTicketStatus(ticket.status === "Open" ? "Resolved" : ticket.status);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setSendingReply(true);
    try {
      await api.patch(`/api/support-tickets/admin/${replyingTicket._id}/reply`, {
        reply: replyMessage,
        status: ticketStatus
      });
      toast.success("Reply submitted successfully!");
      setReplyingTicket(null);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit reply");
    } finally {
      setSendingReply(false);
    }
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch = 
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.message?.toLowerCase().includes(search.toLowerCase()) ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t._id?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "In Progress":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "Resolved":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Support & Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">{tickets.length} total tickets registered</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#12121a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-600" />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#12121a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="All">All Categories</option>
            <option value="Website">Website Issues</option>
            <option value="Tailor">Tailor Complaints</option>
            <option value="Order">Order Issues</option>
            <option value="Other">Other Queries</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#12121a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No support tickets found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-[#12121a] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(t.status)}`}>
                      {t.status}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold uppercase tracking-wider">
                      {t.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">ID: {t._id}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{t.subject}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">{t.message}</p>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <User size={13} className="text-purple-400" />
                      {t.name} ({t.user ? "Registered User" : "Guest"})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} className="text-purple-400" />
                      {t.email}
                    </span>
                    <span>Submitted: {new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Metadata display (Tailor or Order details if populated) */}
                  {(t.tailor || t.order) && (
                    <div className="flex flex-wrap gap-4 p-2.5 bg-[#0e0e15] rounded-xl text-xs text-gray-500 border border-white/[0.04]">
                      {t.tailor && (
                        <span className="flex items-center gap-1">
                          <Scissors size={13} /> Tailor Involved: <span className="text-gray-300">{t.tailor.tailorName} ({t.tailor.shopName || "Atelier"})</span>
                        </span>
                      )}
                      {t.order && (
                        <span className="flex items-center gap-1">
                          <ShoppingBag size={13} /> Order: <span className="text-gray-300">#{t.order.orderNo}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {t.adminReply && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-xl text-xs">
                      <p className="text-green-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Your Response</p>
                      <p className="text-gray-400 italic">"{t.adminReply}"</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenReplyModal(t)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors flex items-center gap-1.5 self-start md:self-center cursor-pointer shadow-md shadow-purple-600/15"
                >
                  {t.adminReply ? "Edit Reply" : "Review & Reply"}
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyingTicket && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
          onClick={() => setReplyingTicket(null)}
        >
          <div 
            className="bg-[#16161e] border border-white/[0.08] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] bg-[#12121a]/85 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Review Ticket</h3>
                <p className="text-xs text-gray-500 mt-0.5">Category: {replyingTicket.category} | Submitted by {replyingTicket.name}</p>
              </div>
              <button 
                onClick={() => setReplyingTicket(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendReply} className="p-6 space-y-6">
              
              {/* Ticket Details */}
              <div className="space-y-3 bg-[#12121a] p-4 rounded-xl border border-white/[0.04]">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[11px]">Subject</h4>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusStyle(replyingTicket.status)}`}>
                    {replyingTicket.status}
                  </span>
                </div>
                <p className="text-base font-bold text-white">{replyingTicket.subject}</p>
                <div className="border-t border-white/[0.04] pt-2">
                  <h4 className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Issue Description</h4>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-[#0e0e15] p-3 rounded-lg border border-white/[0.03]">
                    {replyingTicket.message}
                  </p>
                </div>
              </div>

              {/* Linked entities if any */}
              {(replyingTicket.tailor || replyingTicket.order) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {replyingTicket.tailor && (
                    <div className="bg-[#12121a] p-3.5 rounded-xl border border-white/[0.04] text-xs">
                      <h4 className="font-semibold text-purple-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                        <Scissors size={12} /> Tailor Involved
                      </h4>
                      <p className="text-white font-medium">{replyingTicket.tailor.tailorName}</p>
                      <p className="text-gray-500 mt-0.5">{replyingTicket.tailor.tailorEmail}</p>
                      {replyingTicket.tailor.shopName && <p className="text-gray-500 mt-0.5">Shop: {replyingTicket.tailor.shopName}</p>}
                    </div>
                  )}
                  {replyingTicket.order && (
                    <div className="bg-[#12121a] p-3.5 rounded-xl border border-white/[0.04] text-xs">
                      <h4 className="font-semibold text-purple-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                        <ShoppingBag size={12} /> Linked Order
                      </h4>
                      <p className="text-white font-medium">Order #{replyingTicket.order.orderNo}</p>
                      <p className="text-gray-500 mt-0.5">Status: {replyingTicket.order.status}</p>
                      <p className="text-gray-500 mt-0.5">Price: ${replyingTicket.order.price}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reply Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Update Ticket Status
                    </label>
                    <select
                      value={ticketStatus}
                      onChange={(e) => setTicketStatus(e.target.value)}
                      className="w-full bg-[#12121a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Response Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type the response/solution details here..."
                    className="w-full bg-[#12121a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-600/15"
                >
                  {sendingReply ? "Sending..." : "Submit Response"}
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTicket(null)}
                  className="flex-1 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-gray-400 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SupportTickets;
