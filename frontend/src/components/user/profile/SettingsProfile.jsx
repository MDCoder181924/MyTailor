import { useContext, useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Home,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Ruler,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { authFetch } from "../../../utils/authFetch.jsx";

const apiBaseUrl = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location && window.location.hostname && window.location.hostname.includes("vercel.app") ? "https://my-tailor-backend.vercel.app" : "http://localhost:5000");

const defaultAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="60" fill="#f1b37a"/>
      <circle cx="60" cy="44" r="21" fill="#2c2f38"/>
      <path d="M29 109c5-20 18-31 31-31s26 11 31 31" fill="#1f304e"/>
      <circle cx="60" cy="45" r="16" fill="#f3c092"/>
    </svg>
  `);

const getInitialForm = (user) => ({
  userFullName: user?.userFullName || "Alex Thompson",
  userEmail: user?.userEmail || "",
  userMobileNumber: user?.userMobileNumber || "",
  profilePhoto: user?.profilePhoto || "",
  preferredStyle: user?.preferredStyle || "CLASSIC BESPOKE CLIENT",
  deliveryAddress: user?.deliveryAddress || "1284 Golden Valley Ave, Suite 400\nBeverly Hills, CA 90210",
  bodyNotes: user?.bodyNotes || "",
  stylePreferences: Array.isArray(user?.stylePreferences) ? user.stylePreferences : [],
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

function SectionLabel({ children }) {
  return <p className="mb-3 px-1 text-[13px] font-bold uppercase tracking-[0.02em] text-yellow-400">{children}</p>;
}

function Divider() {
  return <div className="mx-4 h-px bg-white/10" />;
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <button type="button" className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-white/[0.03]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2a2a2a] text-[#aaafb8]">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-[#8b8f97]">{label}</p>
        <p className="truncate text-[15px] text-white">{value}</p>
      </div>
      <ChevronRight size={16} className="text-[#70757d]" />
    </button>
  );
}

function TagList({ items, onRemove }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onRemove(item)}
          className="inline-flex items-center gap-1 rounded-full border border-yellow-500/50 bg-yellow-500/10 px-3 py-1 text-[11px] font-medium text-yellow-300"
        >
          <span>{item}</span>
          <X size={12} />
        </button>
      ))}
    </div>
  );
}

function TagInput({ label, placeholder, items, setItems }) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const value = draft.trim();

    if (!value || items.includes(value)) {
      setDraft("");
      return;
    }

    setItems((prev) => [...prev, value]);
    setDraft("");
  };

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">{label}</p>
      <TagList items={items} onRemove={(value) => setItems((prev) => prev.filter((item) => item !== value))} />
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-dashed border-yellow-500/40 bg-transparent px-4 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-yellow-500/50 px-4 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-500/10"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function SettingsProfile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(() => getInitialForm(user));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await authFetch(`${apiBaseUrl}/api/user/profile`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load user profile");
        }

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setForm(getInitialForm(data.user));
      } catch (err) {
        setError(err.message || "Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [setUser]);

  const setField = (field) => (event) => {
    setMessage("");
    setError("");
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateListField = (field) => (valueOrUpdater) => {
    setMessage("");
    setError("");
    setForm((prev) => ({
      ...prev,
      [field]: typeof valueOrUpdater === "function" ? valueOrUpdater(prev[field]) : valueOrUpdater,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setMessage("");
      setError("");
      setForm((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.onerror = () => {
      setError("Photo upload failed.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      const payload = {
        userFullName: form.userFullName.trim() || "Customer",
        userMobileNumber: form.userMobileNumber.trim(),
        profilePhoto: form.profilePhoto,
        preferredStyle: form.preferredStyle.trim() || "CLASSIC BESPOKE CLIENT",
        deliveryAddress: form.deliveryAddress.trim(),
        bodyNotes: form.bodyNotes.trim(),
        stylePreferences: form.stylePreferences,
      };

      if (form.currentPassword || form.newPassword || form.confirmPassword) {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
          throw new Error("Password change mate badha password fields bharva jaruri chhe.");
        }

        if (form.newPassword !== form.confirmPassword) {
          throw new Error("New password ane confirm password match thata nathi.");
        }

        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const res = await authFetch(`${apiBaseUrl}/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update user profile");
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setForm(getInitialForm(data.user));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update user profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authFetch(`${apiBaseUrl}/api/user/logout`, {
        method: "POST",
      });
    } catch {
      // Keep logout resilient even if the request fails.
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      navigate("/auth");
    }
  };

  const profileImage = form.profilePhoto || defaultAvatar;
  const memberLabel = user?.createdAt ? `Premium Member since ${new Date(user.createdAt).getFullYear()}` : "Premium Member since 2022";

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-3 py-4 text-white">
      <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[30px] border border-white/5 bg-[#121212] shadow-[0_22px_60px_rgba(0,0,0,0.55)]">
        <div className="px-4 pb-6 pt-4">
          <div className="mb-8 flex items-center justify-between">
            <button type="button" onClick={() => window.history.back()} className="text-white">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-[1.05rem] font-semibold">Settings</h1>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="text-xs font-bold text-yellow-400 disabled:text-yellow-700"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              <div className="rounded-full border-[3px] border-yellow-400 p-1">
                <img src={profileImage} alt={form.userFullName || "User profile"} className="h-28 w-28 rounded-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg"
              >
                <Camera size={18} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>

            <h2 className="mt-5 text-[2rem] font-semibold leading-none">{form.userFullName || "Alex Thompson"}</h2>
            <p className="mt-2 text-[1.05rem] text-[#9a9a9a]">{memberLabel}</p>
          </div>

          {message ? (
            <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <SectionLabel>Personal Information</SectionLabel>
          <div className="mb-7 overflow-hidden rounded-2xl bg-[#1f1f1f]">
            <InfoRow icon={User} label="Full Name" value={form.userFullName || "Alex Thompson"} />
            <Divider />
            <InfoRow icon={Mail} label="Email" value={form.userEmail || "alex.t@luxury-experience.com"} />
            <Divider />
            <InfoRow icon={Phone} label="Phone Number" value={form.userMobileNumber || "+1 (555) 902-1432"} />
          </div>
          <p className="mb-7 px-1 text-xs text-[#8b8f97]">
            Email ahiya thi change nathi thatu. Biji details tame ahiya thi update kari shako cho.
          </p>

          <div className="mb-7 rounded-2xl bg-[#1f1f1f] p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Full Name</p>
            <input
              value={form.userFullName}
              onChange={setField("userFullName")}
              placeholder="Enter full name"
              className="w-full bg-transparent text-sm text-neutral-100 outline-none"
            />

            <div className="my-4 h-px bg-white/10" />
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Phone Number</p>
            <input
              value={form.userMobileNumber}
              onChange={setField("userMobileNumber")}
              placeholder="Enter phone number"
              className="w-full bg-transparent text-sm text-neutral-100 outline-none"
            />
          </div>

          <SectionLabel>Security</SectionLabel>
          <div className="mb-7 rounded-2xl bg-[#1f1f1f] p-4">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2a2a2a] text-[#aaafb8]">
                <Lock size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] text-white">Change Password</p>
                <p className="mt-1 text-xs text-[#8b8f97]">Email locked chhe, pan password ahiya thi change kari shako cho.</p>
              </div>
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Current Password</p>
            <input
              type="password"
              value={form.currentPassword}
              onChange={setField("currentPassword")}
              placeholder="Enter current password"
              className="w-full bg-transparent text-sm text-neutral-100 outline-none"
            />

            <div className="my-4 h-px bg-white/10" />
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">New Password</p>
            <input
              type="password"
              value={form.newPassword}
              onChange={setField("newPassword")}
              placeholder="Enter new password"
              className="w-full bg-transparent text-sm text-neutral-100 outline-none"
            />

            <div className="my-4 h-px bg-white/10" />
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Confirm Password</p>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              placeholder="Confirm new password"
              className="w-full bg-transparent text-sm text-neutral-100 outline-none"
            />
          </div>

          <SectionLabel>Delivery Details</SectionLabel>
          <div className="rounded-2xl border border-yellow-400/35 bg-[#1f1f1f] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-400">
                  <Home size={18} />
                </div>
                <span className="text-[1.05rem] font-medium text-white">Home</span>
              </div>
              <span className="rounded-md bg-yellow-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-yellow-400">
                Primary
              </span>
            </div>

            <p className="whitespace-pre-line text-[15px] leading-7 text-[#a8a8a8]">{form.deliveryAddress}</p>

            <div className="mt-4 flex items-center gap-5">
              <button type="button" className="text-sm font-semibold text-yellow-400">
                Edit
              </button>
              <button type="button" className="text-sm font-semibold text-[#8c8c8c]">
                Remove
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-[#1f1f1f] p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Preferred Style</p>
            <input
              value={form.preferredStyle}
              onChange={setField("preferredStyle")}
              placeholder="Classic, modern, festive..."
              className="w-full bg-transparent text-sm text-neutral-100 outline-none"
            />

            <div className="my-4 h-px bg-white/10" />
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Body Notes</p>
            <div className="flex items-start gap-3">
              <Ruler size={18} className="mt-1 text-yellow-400" />
              <textarea
                value={form.bodyNotes}
                onChange={setField("bodyNotes")}
                rows={3}
                placeholder="Preferred fit, sleeve length, shoulder comfort..."
                className="w-full resize-none bg-transparent text-sm leading-6 text-neutral-300 outline-none"
              />
            </div>

            <div className="my-4 h-px bg-white/10" />
            <TagInput
              label="Style Preferences"
              placeholder="Add style preference"
              items={form.stylePreferences}
              setItems={updateListField("stylePreferences")}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-[#1f1f1f] p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-400">Delivery Address</p>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 text-yellow-400" />
              <textarea
                value={form.deliveryAddress}
                onChange={setField("deliveryAddress")}
                rows={3}
                placeholder="Enter your delivery address"
                className="w-full resize-none bg-transparent text-sm leading-6 text-neutral-300 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-4 text-sm font-semibold text-red-300"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
