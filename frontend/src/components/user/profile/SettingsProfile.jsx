import { useContext, useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronLeft,
  Lock,
  MapPin,
  Ruler,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../context/ThemeContext";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";

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
  userFullName: user?.userFullName || "",
  userEmail: user?.userEmail || "",
  userMobileNumber: user?.userMobileNumber || "",
  profilePhoto: user?.profilePhoto || "",
  preferredStyle: user?.preferredStyle || "",
  deliveryAddress: user?.deliveryAddress || "",
  bodyNotes: user?.bodyNotes || "",
  stylePreferences: Array.isArray(user?.stylePreferences) ? user.stylePreferences : [],
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

function SectionLabel({ children }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-theme-accent border-b border-theme-border pb-2 mb-4 font-serif">
      {children}
    </h3>
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
          className="inline-flex items-center gap-1 rounded-full border border-theme-accent/30 bg-theme-accent-muted px-3 py-1 text-[11px] font-medium text-theme-accent transition-colors hover:bg-theme-accent/20"
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
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-theme-text-muted">{label}</p>
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
          className="flex-1 bg-transparent px-1 py-1.5 text-sm text-theme-text outline-none border-b border-theme-border focus:border-theme-accent transition-colors placeholder:text-theme-text-muted/50"
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-theme-accent/40 px-3 py-1.5 text-xs font-semibold text-theme-accent transition hover:bg-theme-accent-muted"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function SettingsProfile() {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(() => getInitialForm(user));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await api.get("/api/user/profile");
        const data = res.data;

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setForm(getInitialForm(data.user));
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || "Failed to load user profile";
        setError(errMsg);
        toast.error(errMsg);
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

      const res = await api.patch("/api/user/profile", payload);
      const data = res.data;

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setForm(getInitialForm(data.user));
      setMessage("Profile updated successfully.");
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update user profile";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(getInitialForm(user));
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
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
  const memberLabel = user?.createdAt
    ? `Premium Member since ${new Date(user.createdAt).getFullYear()}`
    : "Premium Member";

  const renderProfileView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-4">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="flex flex-col items-center pb-8 md:pb-0 md:border-r md:border-theme-border md:pr-12">
          <div className="rounded-full border-[3px] border-theme-accent p-1.5 shadow-[0_0_20px_var(--theme-accent-muted)]">
            <img
              src={profileImage}
              alt={form.userFullName || "User profile"}
              className="h-36 w-36 rounded-full object-cover"
            />
          </div>
          <h2 className="mt-6 text-3xl font-serif font-bold text-center tracking-wide text-theme-text">{form.userFullName || "Bespoke Client"}</h2>
          <p className="mt-2 text-xs text-theme-accent font-bold tracking-[0.2em] uppercase">{memberLabel}</p>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-theme-accent hover:opacity-90 text-theme-bg px-6 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-[1.01]"
          >
            Edit Profile Settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/40 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 px-6 py-3.5 text-sm font-semibold transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        {/* Right Columns: User Details Grid */}
        <div className="md:col-span-2 space-y-12">
          {/* Section 1: Account Information */}
          <div className="space-y-6">
            <SectionLabel>Account Information</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Full Name</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.userFullName || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Email Address</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.userEmail || "-"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Phone Number</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.userMobileNumber || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Style & Fit Preferences */}
          <div className="space-y-6">
            <SectionLabel>Style & Fit Preferences</SectionLabel>
            <div className="space-y-6 px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Preferred Style</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.preferredStyle || "Not specified"}</p>
              </div>

              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold mb-3">Style Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {form.stylePreferences.length > 0 ? (
                    form.stylePreferences.map((pref) => (
                      <span
                        key={pref}
                        className="rounded-full bg-theme-accent-muted border border-theme-accent/20 px-3.5 py-1 text-xs text-theme-accent font-medium"
                      >
                        {pref}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-theme-text-muted italic">No style preferences added yet.</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ruler size={15} className="text-theme-accent" />
                  <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Body & Fit Notes</p>
                </div>
                <p className="text-base text-theme-text-muted leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-theme-accent/20 font-light">
                  {form.bodyNotes || "No body measurements or fit notes added yet."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Details */}
          <div className="space-y-6">
            <SectionLabel>Delivery Details</SectionLabel>
            <div className="flex items-start gap-4 px-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-accent-muted text-theme-accent border border-theme-accent/20 shrink-0">
                <MapPin size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Primary Address</p>
                <p className="text-base text-theme-text-muted leading-relaxed whitespace-pre-wrap font-light">
                  {form.deliveryAddress || "No delivery address saved."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Theme Settings */}
          <div className="space-y-6">
            <SectionLabel>Theme Settings</SectionLabel>
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">App Theme</p>
                <p className="mt-1 text-sm text-theme-text font-light">Switch between Light and Dark modes</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-theme-accent/30 bg-theme-accent-muted px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-theme-accent transition-colors hover:bg-theme-accent/20"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg text-sm text-theme-accent">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text px-6 py-10 md:py-16 transition-colors duration-300">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-theme-border pb-6 mb-10">
          <button
            type="button"
            onClick={isEditing ? handleCancel : () => window.history.back()}
            className="flex items-center gap-1.5 text-theme-text-muted hover:text-theme-text transition-colors text-sm font-semibold tracking-wider uppercase"
          >
            <ChevronLeft size={18} /> Back
          </button>
          <h1 className="text-lg font-bold uppercase tracking-[0.2em] font-serif text-theme-accent">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h1>
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="text-sm font-bold text-theme-accent disabled:opacity-50 hover:opacity-80 uppercase tracking-wider transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm font-bold text-theme-accent hover:opacity-80 uppercase tracking-wider transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {/* Dynamic Panels */}
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-4">
            {/* Left Column: Avatar Settings */}
            <div className="flex flex-col items-center pb-8 md:pb-0 md:border-r md:border-theme-border md:pr-12">
              <div className="relative">
                <div className="rounded-full border-[3px] border-theme-accent p-1.5">
                  <img
                    src={profileImage}
                    alt={form.userFullName || "User profile"}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-theme-accent text-theme-bg shadow-lg hover:scale-105 transition-transform border border-theme-border"
                >
                  <Camera size={16} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>

              <h2 className="mt-5 text-2xl font-serif font-bold text-center text-theme-text">{form.userFullName || "Bespoke Client"}</h2>
              <p className="mt-2 text-xs text-theme-text-muted uppercase tracking-wider text-center">{memberLabel}</p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/40 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 px-6 py-3.5 text-sm font-semibold transition-colors duration-300"
              >
                Logout
              </button>
            </div>

            {/* Right Column: Settings Forms */}
            <div className="md:col-span-2 space-y-10">
              {message && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Personal Information Form */}
              <div className="space-y-6">
                <SectionLabel>Personal Information</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 px-1">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Full Name</p>
                    <input
                      value={form.userFullName}
                      onChange={setField("userFullName")}
                      placeholder="Enter full name"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Phone Number</p>
                    <input
                      value={form.userMobileNumber}
                      onChange={setField("userMobileNumber")}
                      placeholder="Enter phone number"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-text-muted">Email Address (Locked)</p>
                    <div className="flex items-center justify-between border-b border-theme-border pb-1.5">
                      <input
                        value={form.userEmail}
                        disabled
                        readOnly
                        className="bg-transparent text-sm text-theme-text-muted outline-none cursor-not-allowed w-full"
                      />
                      <Lock size={14} className="text-theme-text-muted" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Form */}
              <div className="space-y-6">
                <SectionLabel>Security (Change Password)</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-1">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Current Password</p>
                    <input
                      type="password"
                      value={form.currentPassword}
                      onChange={setField("currentPassword")}
                      placeholder="Current password"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">New Password</p>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={setField("newPassword")}
                      placeholder="New password"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Confirm Password</p>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={setField("confirmPassword")}
                      placeholder="Confirm password"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Style Preferences Form */}
              <div className="space-y-6">
                <SectionLabel>Style Preferences</SectionLabel>
                <div className="space-y-6 px-1">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Preferred Style</p>
                    <input
                      value={form.preferredStyle}
                      onChange={setField("preferredStyle")}
                      placeholder="Classic, modern, festive..."
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div>
                    <TagInput
                      label="Style preferences tags"
                      placeholder="Add style preference"
                      items={form.stylePreferences}
                      setItems={updateListField("stylePreferences")}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Body & Fit Notes</p>
                    <textarea
                      value={form.bodyNotes}
                      onChange={setField("bodyNotes")}
                      rows={3}
                      placeholder="Preferred fit, sleeve length, shoulder comfort..."
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-6">
                <SectionLabel>Delivery Details</SectionLabel>
                <div className="px-1">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">Delivery Address</p>
                  <textarea
                    value={form.deliveryAddress}
                    onChange={setField("deliveryAddress")}
                    rows={3}
                    placeholder="Enter your delivery address"
                    className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderProfileView()
        )}
      </div>
    </div>
  );
}
