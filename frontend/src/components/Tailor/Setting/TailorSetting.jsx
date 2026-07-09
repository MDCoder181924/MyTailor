import { useContext, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, Lock, Minus, Plus, ShieldCheck, X } from "lucide-react";
import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../context/ThemeContext";
import api from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const getInitialForm = (tailor) => ({
  tailorName: tailor?.tailorName || "",
  tailorEmail: tailor?.tailorEmail || "",
  tailorMobileNumber: tailor?.tailorMobileNumber || "",
  profilePhoto: tailor?.profilePhoto || "",
  professionalTitle: tailor?.professionalTitle || "MASTER TAILOR & DESIGNER",
  shopName: tailor?.shopName || "",
  shopAddress: tailor?.shopAddress || "",
  shopDescription: tailor?.shopDescription || "",
  yearsOfExperience: Number.isFinite(Number(tailor?.yearsOfExperience)) ? Number(tailor.yearsOfExperience) : 0,
  specializations: Array.isArray(tailor?.specializations) ? tailor.specializations : [],
  keySkills: Array.isArray(tailor?.keySkills) ? tailor.keySkills : [],
  identityStatus: tailor?.identityStatus || "Verified",
  disabledSizes: Array.isArray(tailor?.disabledSizes) ? tailor.disabledSizes : [],
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

function FieldLabel({ children }) {
  return <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-theme-accent">{children}</p>;
}

function TagList({ items, onRemove, accent = "yellow" }) {
  const tagClass =
    accent === "yellow"
      ? "border-theme-accent/30 bg-theme-accent-muted text-theme-accent hover:bg-theme-accent/20"
      : "border-theme-border bg-theme-panel text-theme-text-muted hover:bg-theme-accent-muted hover:text-theme-accent";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onRemove(item)}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${tagClass}`}
        >
          <span>{item}</span>
          <X size={12} />
        </button>
      ))}
    </div>
  );
}

function TagInput({ label, placeholder, items, setItems, accent }) {
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

  const removeItem = (value) => {
    setItems((prev) => prev.filter((item) => item !== value));
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {items.length > 0 ? (
        <div className="mb-3">
          <TagList items={items} onRemove={removeItem} accent={accent} />
        </div>
      ) : null}

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
          className="flex-1 bg-theme-panel border border-theme-border rounded-xl px-4 py-2 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded-xl border border-theme-accent/40 px-4 py-2 text-xs font-bold text-theme-accent transition hover:bg-theme-accent-muted cursor-pointer"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function TailorSetting() {
  const { tailor, setTailor } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(() => getInitialForm(tailor));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm(getInitialForm(tailor));
  }, [tailor]);

  useEffect(() => {
    const loadTailorProfile = async () => {
      try {
        const res = await api.get("/api/tailor/profile");
        const data = res.data;

        setTailor(data.tailor);
        localStorage.setItem("tailor", JSON.stringify(data.tailor));
        setForm(getInitialForm(data.tailor));
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || "Failed to load tailor profile";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadTailorProfile();
  }, [setTailor]);

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

  const adjustYears = (amount) => {
    setMessage("");
    setError("");
    setForm((prev) => ({
      ...prev,
      yearsOfExperience: Math.max(0, Number(prev.yearsOfExperience || 0) + amount),
    }));
  };

  const toggleDisabledSize = (size) => {
    setMessage("");
    setError("");
    setForm((prev) => {
      const disabledSizes = prev.disabledSizes || [];
      const updated = disabledSizes.includes(size)
        ? disabledSizes.filter((s) => s !== size)
        : [...disabledSizes, size];
      return { ...prev, disabledSizes: updated };
    });
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
        tailorName: form.tailorName.trim() || "My Tailor",
        tailorMobileNumber: form.tailorMobileNumber.trim(),
        profilePhoto: form.profilePhoto,
        professionalTitle: form.professionalTitle.trim() || "MASTER TAILOR & DESIGNER",
        shopName: form.shopName.trim(),
        shopAddress: form.shopAddress.trim(),
        shopDescription: form.shopDescription.trim(),
        yearsOfExperience: Number(form.yearsOfExperience || 0),
        specializations: form.specializations,
        keySkills: form.keySkills,
        identityStatus: form.identityStatus,
        disabledSizes: form.disabledSizes,
      };

      if (form.currentPassword || form.newPassword || form.confirmPassword) {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
          throw new Error("Please fill in all password fields to change password.");
        }

        if (form.newPassword !== form.confirmPassword) {
          throw new Error("New password and confirm password do not match.");
        }

        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const res = await api.patch("/api/tailor/profile", payload);
      const data = res.data;

      setTailor(data.tailor);
      localStorage.setItem("tailor", JSON.stringify(data.tailor));
      setForm(getInitialForm(data.tailor));
      setMessage("Profile updated successfully.");
      toast.success("Profile updated successfully.");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update tailor profile";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/tailor/logout");
    } catch {
      // Keep logout resilient even if the request fails.
    } finally {
      setTailor(null);
      localStorage.removeItem("tailor");
      localStorage.removeItem("accessToken");
      navigate("/auth");
    }
  };

  const profileImage = form.profilePhoto || defaultTailorImage;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg text-sm text-theme-accent">
        <div className="flex flex-col items-center gap-3 text-theme-text-muted">
          <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest font-semibold animate-pulse">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text px-6 py-10 md:py-16 transition-colors duration-300">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-theme-border pb-6 mb-10">
          <Link
            to="/profile"
            className="flex items-center gap-1.5 text-theme-text-muted hover:text-theme-text transition-colors text-sm font-semibold tracking-wider uppercase cursor-pointer"
          >
            <ChevronLeft size={18} /> Back to Profile
          </Link>
          <h1 className="text-lg font-bold uppercase tracking-[0.2em] font-serif text-theme-accent">
            Edit Settings
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Settings Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-4">
          {/* Left Column: Avatar & Quick Actions */}
          <div className="flex flex-col items-center pb-8 md:pb-0 md:border-r md:border-theme-border md:pr-12">
            <div className="relative group">
              <img
                src={profileImage}
                alt={form.tailorName || "Tailor profile"}
                className="w-48 h-64 object-cover rounded-xl border-2 border-theme-accent shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-theme-accent text-theme-bg shadow-lg hover:scale-110 transition-transform border border-theme-border cursor-pointer"
              >
                <Camera size={18} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>

            <h2 className="mt-6 text-2xl font-serif font-bold text-center text-theme-text">{form.tailorName || "My Tailor"}</h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-accent text-center">
              {form.professionalTitle || "MASTER TAILOR & DESIGNER"}
            </p>

            {/* Identity Verified Badge */}
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-emerald-500">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Identity Verified</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-theme-accent hover:opacity-90 disabled:opacity-50 text-theme-bg px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-[1.01] cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 dark:border-red-900/40 dark:bg-red-950/10 dark:hover:bg-red-950/30 dark:text-red-400 dark:hover:text-red-300 px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer"
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

            {/* Personal Info Form */}
            <div className="space-y-6">
              <SectionLabel>Personal Info</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 px-1">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <input
                    value={form.tailorName}
                    onChange={setField("tailorName")}
                    placeholder="Enter full name"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <input
                    value={form.tailorMobileNumber}
                    onChange={setField("tailorMobileNumber")}
                    placeholder="Enter phone number"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel>Email (Locked)</FieldLabel>
                  <div className="flex items-center justify-between bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5">
                    <input
                      value={form.tailorEmail}
                      disabled
                      readOnly
                      className="bg-transparent text-sm text-theme-text-muted outline-none cursor-not-allowed w-full"
                    />
                    <Lock size={14} className="text-theme-text-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Bio Form */}
            <div className="space-y-6">
              <SectionLabel>Professional Bio</SectionLabel>
              <div className="space-y-6 px-1">
                <div>
                  <FieldLabel>Professional Title</FieldLabel>
                  <input
                    value={form.professionalTitle}
                    onChange={setField("professionalTitle")}
                    placeholder="Enter professional title"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <FieldLabel>Years of Experience</FieldLabel>
                  <div className="flex items-center gap-6 mt-1.5">
                    <p className="text-lg font-bold text-theme-text min-w-[80px]">{form.yearsOfExperience} Years</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => adjustYears(-1)}
                        className="rounded-lg border border-theme-border bg-theme-panel p-2.5 text-theme-text hover:bg-theme-accent-muted transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustYears(1)}
                        className="rounded-lg bg-theme-accent p-2.5 text-theme-bg hover:opacity-90 transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <TagInput
                  label="Specializations"
                  placeholder="Type and press Add or Enter..."
                  items={form.specializations}
                  setItems={updateListField("specializations")}
                  accent="yellow"
                />

                <TagInput
                  label="Key Skills"
                  placeholder="Type and press Add or Enter..."
                  items={form.keySkills}
                  setItems={updateListField("keySkills")}
                  accent="gray"
                />
              </div>
            </div>

            {/* Security Form */}
            <div className="space-y-6">
              <SectionLabel>Security (Change Password)</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-1">
                <div>
                  <FieldLabel>Current Password</FieldLabel>
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={setField("currentPassword")}
                    placeholder="Current password"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>
                <div>
                  <FieldLabel>New Password</FieldLabel>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={setField("newPassword")}
                    placeholder="New password"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>
                <div>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={setField("confirmPassword")}
                    placeholder="Confirm password"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Shop Details Form */}
            <div className="space-y-6">
              <SectionLabel>Shop Details</SectionLabel>
              <div className="space-y-6 px-1">
                <div>
                  <FieldLabel>Shop Name</FieldLabel>
                  <input
                    value={form.shopName}
                    onChange={setField("shopName")}
                    placeholder="Enter shop name"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <FieldLabel>Address</FieldLabel>
                  <textarea
                    value={form.shopAddress}
                    onChange={setField("shopAddress")}
                    rows={2}
                    placeholder="Enter shop address"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 resize-none leading-relaxed shadow-sm"
                  />
                </div>

                <div>
                  <FieldLabel>Shop Description</FieldLabel>
                  <textarea
                    value={form.shopDescription}
                    onChange={setField("shopDescription")}
                    rows={3}
                    placeholder="Describe your tailoring shop and services"
                    className="w-full bg-theme-panel border border-theme-border rounded-xl px-4 py-2.5 text-sm text-theme-text placeholder-theme-text-muted/40 outline-none focus:border-theme-accent transition-all duration-300 resize-none leading-relaxed shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Size Constraints Settings */}
            <div className="space-y-6">
              <SectionLabel>Size Constraints</SectionLabel>
              <div className="space-y-4 px-1">
                <FieldLabel>Sizes I Cannot Tailor</FieldLabel>
                <div className="flex flex-wrap gap-2.5">
                  {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => {
                    const isDisabled = form.disabledSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleDisabledSize(size)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isDisabled
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-theme-panel border-theme-border text-theme-text-muted hover:border-red-500 hover:text-red-500 hover:bg-red-500/5"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="space-y-6">
              <SectionLabel>Theme Settings</SectionLabel>
              <div className="flex items-center justify-between px-1 bg-theme-panel border border-theme-border rounded-xl p-5 shadow-sm">
                <div>
                  <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">App Theme</p>
                  <p className="mt-1 text-sm text-theme-text-muted font-light">Switch between Light and Dark modes</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-xl border border-theme-accent/30 bg-theme-accent-muted px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-theme-accent transition-colors hover:bg-theme-accent/20 cursor-pointer"
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
