import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  Send, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MapPin, 
  Ticket, 
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

// Headers and Footers based on authentication
import Header from "../../components/Home/Header";
import Footer from "../../components/Home/Footer";
import HeaderDashboard from "../../components/user/Dashboard/HeaderDashboard";
import FooterDashboard from "../../components/user/Dashboard/FooterDashbord";

const faqs = [
  {
    q: "How do I track my custom order?",
    a: "You can track your custom orders directly from your user dashboard under the 'Order' tab. Each order displays its current stage, such as 'Pending', 'Accepted', 'In Progress', 'Shipped', or 'Collected'."
  },
  {
    q: "What if the tailor-made outfit doesn't fit correctly?",
    a: "We offer a Fit Guarantee! If your outfit requires modifications, you can submit a support ticket here under 'Tailor Issue' or 'Order Issue', explaining the fit issue. You can also reach out to your tailor directly through their public profile contact details."
  },
  {
    q: "How can I pay for my custom order?",
    a: "Once a tailor reviews your measurements and accepts the order, a payment request will appear in your orders list. You can click 'Pay Now' to securely complete the payment via our integrated payment gateway."
  },
  {
    q: "What is the policy for order cancellations?",
    a: "Orders can be cancelled and fully refunded as long as the tailor has not started working on the fabric (i.e. status is 'PENDING' or 'ACCEPTED'). Once the status changes to 'IN_PROGRESS', cancellations are subject to a fabric cost deduction."
  }
];

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border-b border-theme-border py-4">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between text-left font-medium text-theme-text hover:text-theme-accent transition"
      >
        <span className="text-base md:text-lg">{faq.q}</span>
        {isOpen ? <ChevronUp size={20} className="text-theme-accent" /> : <ChevronDown size={20} />}
      </button>
      <div
        className={`mt-2 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm md:text-base text-theme-text-muted leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
};

const HelpContact = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("contact"); // "contact" or "tickets"
  const [openFaq, setOpenFaq] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Website");
  const [tailor, setTailor] = useState("");
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Loaded data
  const [tailorsList, setTailorsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Populate user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.userFullName || "");
      setEmail(user.userEmail || "");
    }
  }, [user]);

  // Load Tailors (always public)
  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const res = await api.get("/api/tailor");
        setTailorsList(res.data.tailors || res.data || []);
      } catch (err) {
        console.error("Failed to fetch tailors list", err);
      }
    };
    fetchTailors();
  }, []);

  // Load user's Orders if logged in
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await api.get("/api/orders/mine");
          setOrdersList(res.data || []);
        } catch (err) {
          console.error("Failed to fetch user orders", err);
        }
      };
      fetchOrders();
    }
  }, [user]);

  // Load user's Tickets if logged in
  const fetchMyTickets = async () => {
    if (!user) return;
    setLoadingTickets(true);
    try {
      const res = await api.get("/api/support-tickets/mine");
      setMyTickets(res.data.tickets || []);
    } catch (err) {
      toast.error("Failed to load your support tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tickets" && user) {
      fetchMyTickets();
    }
  }, [activeTab, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        subject,
        category,
        message,
        tailor: category === "Tailor" ? tailor : undefined,
        order: category === "Order" ? order : undefined
      };

      await api.post("/api/support-tickets", payload);
      toast.success("Support ticket registered successfully!");
      
      // Reset form (except auto-filled user details)
      setSubject("");
      setMessage("");
      setTailor("");
      setOrder("");
      
      if (user) {
        setActiveTab("tickets");
        fetchMyTickets();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock size={12} /> Open
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <AlertCircle size={12} /> In Progress
          </span>
        );
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
      {/* Header */}
      {user ? <HeaderDashboard /> : <Header />}

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-theme-text tracking-wide mb-3">
            Help & Support Center
          </h1>
          <p className="text-theme-text-muted text-base md:text-lg max-w-2xl mx-auto">
            Have a question, feedback, or complaint? Register your issue below. Our admin team will review and reply as soon as possible.
          </p>
        </div>

        {/* Tab Buttons (if logged in) */}
        {user && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border ${
                activeTab === "contact"
                  ? "bg-theme-accent text-theme-bg border-theme-accent shadow-lg shadow-theme-accent/20"
                  : "bg-theme-panel text-theme-text border-theme-border hover:border-theme-accent"
              }`}
            >
              Contact Support
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border flex items-center gap-2 ${
                activeTab === "tickets"
                  ? "bg-theme-accent text-theme-bg border-theme-accent shadow-lg shadow-theme-accent/20"
                  : "bg-theme-panel text-theme-text border-theme-border hover:border-theme-accent"
              }`}
            >
              <Ticket size={16} /> My Support Tickets
            </button>
          </div>
        )}

        {activeTab === "contact" ? (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Details & FAQs */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-theme-panel border border-theme-border rounded-2xl p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-theme-text-muted">
                    <div className="w-10 h-10 rounded-xl bg-theme-accent-muted flex items-center justify-center text-theme-accent">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold">Email Us</p>
                      <p className="text-sm font-medium text-theme-text">support@stitchperfect.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-theme-text-muted">
                    <div className="w-10 h-10 rounded-xl bg-theme-accent-muted flex items-center justify-center text-theme-accent">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold">Call Us</p>
                      <p className="text-sm font-medium text-theme-text">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-theme-text-muted">
                    <div className="w-10 h-10 rounded-xl bg-theme-accent-muted flex items-center justify-center text-theme-accent">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold">Headquarters</p>
                      <p className="text-sm font-medium text-theme-text">Milan, Italy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-theme-panel border border-theme-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-theme-accent">
                  <HelpCircle size={22} />
                  <h3 className="text-xl font-serif font-semibold text-theme-text">Frequently Asked Questions</h3>
                </div>
                <div className="divide-y divide-theme-border">
                  {faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      faq={faq}
                      isOpen={openFaq === index}
                      toggle={() => setOpenFaq(openFaq === index ? null : index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Support Ticket Registration Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-theme-panel border border-theme-border rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-theme-border pb-4 mb-2">
                  <MessageSquare className="text-theme-accent" size={24} />
                  <div>
                    <h2 className="text-2xl font-serif font-bold">Register Support Ticket</h2>
                    <p className="text-xs text-theme-text-muted mt-0.5">We respond within 24 hours.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!user}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent disabled:opacity-60 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      disabled={!!user}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent disabled:opacity-60 transition"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                      Issue Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent text-theme-text transition"
                    >
                      <option value="Website">Website Issue / Bug</option>
                      <option value="Tailor">Complaint against Tailor</option>
                      <option value="Order">Order Issue</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>

                  {/* Tailor Select Dropdown (shown only for Tailor category) */}
                  {category === "Tailor" && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                        Select Tailor
                      </label>
                      <select
                        value={tailor}
                        onChange={(e) => setTailor(e.target.value)}
                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent text-theme-text transition"
                      >
                        <option value="">-- Choose Tailor --</option>
                        {tailorsList.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.tailorName} {t.shopName ? `(${t.shopName})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Order Select Dropdown (shown only for Order category when logged in) */}
                  {category === "Order" && user && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                        Select Order
                      </label>
                      <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent text-theme-text transition"
                      >
                        <option value="">-- Choose Order --</option>
                        {ordersList.map((o) => (
                          <option key={o._id} value={o._id}>
                            Order #{o.orderNo} (${o.price}) - {o.status}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Message for guest user trying to file Order complaint */}
                  {category === "Order" && !user && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>Please login to link specific orders to your ticket.</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of the issue"
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
                    Describe your issue in detail *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please explain the problem clearly..."
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm outline-none focus:border-theme-accent resize-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-theme-accent hover:bg-theme-accent/90 text-theme-bg font-semibold rounded-xl text-sm transition duration-300 cursor-pointer shadow-lg shadow-theme-accent/15 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : (
                    <>
                      <Send size={16} /> Register Ticket
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* Logged-in User Ticket History */
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">My Support Tickets</h2>

            {loadingTickets ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : myTickets.length === 0 ? (
              <div className="bg-theme-panel border border-theme-border rounded-2xl p-12 text-center">
                <Ticket className="w-12 h-12 text-theme-text-muted mx-auto mb-4" />
                <p className="text-theme-text-muted text-sm">You haven't submitted any support tickets yet.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {myTickets.map((t) => (
                  <div key={t._id} className="bg-theme-panel border border-theme-border rounded-2xl p-6 space-y-4 hover:border-theme-accent/30 transition duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border pb-3">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold">{t.subject}</h3>
                          {getStatusBadge(t.status)}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-theme-accent-muted text-theme-accent font-medium">
                            {t.category} Issue
                          </span>
                        </div>
                        <p className="text-[11px] text-theme-text-muted mt-1 font-mono">Ticket ID: {t._id}</p>
                      </div>
                      <span className="text-xs text-theme-text-muted">
                        Submitted: {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted">Your Message</p>
                      <p className="text-sm text-theme-text leading-relaxed whitespace-pre-line">{t.message}</p>
                    </div>

                    {/* Metadata displays (Tailor or Order details if populated) */}
                    {(t.tailor || t.order) && (
                      <div className="flex flex-wrap gap-4 p-3 bg-theme-bg rounded-xl text-xs text-theme-text-muted border border-theme-border">
                        {t.tailor && (
                          <span>
                            Tailor Involved: <span className="text-theme-text font-medium">{t.tailor.tailorName} ({t.tailor.shopName || "Atelier"})</span>
                          </span>
                        )}
                        {t.order && (
                          <span>
                            Order ID: <span className="text-theme-text font-medium">#{t.order.orderNo}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Admin Reply Section */}
                    {t.adminReply ? (
                      <div className="p-4 bg-theme-accent/5 border border-theme-accent/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-theme-accent font-semibold uppercase tracking-wider">
                          <span>Admin Response</span>
                          {t.repliedAt && <span className="text-theme-text-muted text-[11px] font-normal">{new Date(t.repliedAt).toLocaleDateString()}</span>}
                        </div>
                        <p className="text-sm text-theme-text leading-relaxed whitespace-pre-line font-medium italic">
                          "{t.adminReply}"
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-theme-text-muted italic flex items-center gap-1.5">
                        <Clock size={14} /> Pending review by our support admin
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      {user ? <FooterDashboard /> : <Footer />}
    </div>
  );
};

export default HelpContact;
