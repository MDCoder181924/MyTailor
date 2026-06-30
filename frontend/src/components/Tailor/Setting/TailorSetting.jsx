import { useContext, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, Lock, Minus, Plus, ShieldCheck, X } from "lucide-react";
import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../context/ThemeContext";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
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
  const [isEditing, setIsEditing] = useState(false);

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
          throw new Error("Password change mate badha password fields bharva jaruri chhe.");
        }

        if (form.newPassword !== form.confirmPassword) {
          throw new Error("New password ane confirm password match thata nathi.");
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
      setIsEditing(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update tailor profile";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(getInitialForm(tailor));
    setMessage("");
    setError("");
    setIsEditing(false);
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
  const joinedOn = tailor?.createdAt
    ? new Date(tailor.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Recently joined";

  // Read-only profile settings view
  const renderProfileView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-4">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="flex flex-col items-center pb-8 md:pb-0 md:border-r md:border-theme-border md:pr-12">
          <div className="rounded-full border-[3px] border-theme-accent p-1.5 shadow-[0_0_20px_var(--theme-accent-muted)]">
            <img
              src={profileImage}
              alt={form.tailorName || "Tailor profile"}
              className="h-36 w-36 rounded-full object-cover"
            />
          </div>
          <h2 className="mt-6 text-3xl font-serif font-bold text-center tracking-wide text-theme-text">{form.tailorName || "My Tailor"}</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-theme-accent text-center">
            {form.professionalTitle || "MASTER TAILOR & DESIGNER"}
          </p>

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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 dark:border-red-900/40 dark:bg-red-950/10 dark:hover:bg-red-950/30 dark:text-red-400 dark:hover:text-red-300 px-6 py-3.5 text-sm font-semibold transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Right Columns: Tailor Details */}
        <div className="md:col-span-2 space-y-12">
          {/* Section 1: Personal & Professional Info */}
          <div className="space-y-6">
            <SectionLabel>Personal & Professional Info</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Full Name</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.tailorName || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Email Address</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.tailorEmail || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Phone Number</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.tailorMobileNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Experience</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.yearsOfExperience} Years</p>
              </div>
            </div>
          </div>

          {/* Section 2: Shop Details */}
          <div className="space-y-6">
            <SectionLabel>Shop Details</SectionLabel>
            <div className="space-y-6 px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Shop Name</p>
                <p className="mt-1.5 text-lg text-theme-text font-medium">{form.shopName || "Not specified"}</p>
              </div>
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Shop Address</p>
                <p className="mt-1.5 text-base text-theme-text-muted leading-relaxed whitespace-pre-wrap font-light">
                  {form.shopAddress || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold">Shop Description</p>
                <p className="mt-1.5 text-base text-theme-text-muted leading-relaxed whitespace-pre-wrap font-light">
                  {form.shopDescription || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Skills & Specializations */}
          <div className="space-y-6">
            <SectionLabel>Skills & Specializations</SectionLabel>
            <div className="space-y-6 px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold mb-3">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {form.specializations.length > 0 ? (
                    form.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full bg-theme-accent-muted border border-theme-accent/20 px-3.5 py-1 text-xs text-theme-accent font-medium"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-theme-text-muted italic">None listed.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold mb-3">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {form.keySkills.length > 0 ? (
                    form.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-theme-panel border border-theme-border px-3.5 py-1 text-xs text-theme-text-muted font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-theme-text-muted italic">None listed.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Size Constraints */}
          <div className="space-y-6">
            <SectionLabel>Size Constraints</SectionLabel>
            <div className="space-y-4 px-1">
              <div>
                <p className="text-[10px] text-theme-text-muted uppercase tracking-[0.18em] font-bold mb-3">Sizes I Cannot Make</p>
                <div className="flex flex-wrap gap-2">
                  {form.disabledSizes && form.disabledSizes.length > 0 ? (
                    form.disabledSizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full bg-red-500/10 border border-red-500/20 px-3.5 py-1 text-xs text-red-500 font-medium"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-theme-text-muted italic">All sizes can be made (No constraints).</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Verification */}
          <div className="space-y-6">
            <SectionLabel>Verification</SectionLabel>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-theme-text">Identity Status</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500 dark:text-emerald-400">
                    {form.identityStatus || "Verified"}
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-theme-panel border border-theme-border px-3 py-1 text-[11px] text-theme-text-muted font-light">
                Member since {joinedOn}
              </div>
            </div>
          </div>

          {/* Section 5: Theme Settings */}
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
        Loading Tailor Profile...
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
            {isEditing ? "Edit Settings" : "Tailor Profile Settings"}
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
                <div className="rounded-full border-[3px] border-theme-accent p-1.5 shadow-[0_0_20px_var(--theme-accent-muted)]">
                  <img
                    src={profileImage}
                    alt={form.tailorName || "Tailor profile"}
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

              <h2 className="mt-6 text-2xl font-serif font-bold text-center text-theme-text">{form.tailorName || "My Tailor"}</h2>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-accent text-center">
                {form.professionalTitle || "MASTER TAILOR & DESIGNER"}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 dark:border-red-900/40 dark:bg-red-950/10 dark:hover:bg-red-950/30 dark:text-red-400 dark:hover:text-red-300 px-6 py-3.5 text-sm font-semibold transition-all duration-300"
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
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>

                  <div>
                    <FieldLabel>Phone Number</FieldLabel>
                    <input
                      value={form.tailorMobileNumber}
                      onChange={setField("tailorMobileNumber")}
                      placeholder="Enter phone number"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>Email (Locked)</FieldLabel>
                    <div className="flex items-center justify-between border-b border-theme-border pb-1.5">
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
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
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
                          className="rounded-lg border border-theme-border bg-theme-panel p-2 text-theme-text hover:bg-theme-accent-muted transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustYears(1)}
                          className="rounded-lg bg-theme-accent p-2 text-theme-bg hover:opacity-90 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <TagInput
                      label="Specialization"
                      placeholder="Add specialization"
                      items={form.specializations}
                      setItems={updateListField("specializations")}
                      accent="yellow"
                    />
                  </div>

                  <div>
                    <TagInput
                      label="Key Skills"
                      placeholder="Add key skill"
                      items={form.keySkills}
                      setItems={updateListField("keySkills")}
                      accent="neutral"
                    />
                  </div>
                </div>
              </div>

              {/* Size Constraints Form */}
              <div className="space-y-6">
                <SectionLabel>Size Constraints</SectionLabel>
                <div className="space-y-4 px-1">
                  <div>
                    <FieldLabel>Sizes You Cannot Make</FieldLabel>
                    <p className="text-xs text-theme-text-muted mb-4 leading-relaxed">
                      Select the standard sizes you are unable to tailor. These sizes will be disabled for users during checkout.
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                      {["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map((s) => {
                        const isCannotMake = form.disabledSizes.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleDisabledSize(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                              isCannotMake
                                ? "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                : "border-theme-border bg-theme-panel text-theme-text-muted hover:border-theme-accent/50 hover:text-theme-accent"
                            }`}
                          >
                            {s} {isCannotMake ? "✕" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div>
                    <FieldLabel>New Password</FieldLabel>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={setField("newPassword")}
                      placeholder="New password"
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div>
                    <FieldLabel>Confirm Password</FieldLabel>
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
                      className="w-full bg-transparent text-sm text-theme-text outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors"
                    />
                  </div>

                  <div>
                    <FieldLabel>Address</FieldLabel>
                    <textarea
                      value={form.shopAddress}
                      onChange={setField("shopAddress")}
                      rows={2}
                      placeholder="Enter shop address"
                      className="w-full bg-transparent text-sm text-theme-text-muted outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <FieldLabel>Shop Description</FieldLabel>
                    <textarea
                      value={form.shopDescription}
                      onChange={setField("shopDescription")}
                      rows={3}
                      placeholder="Describe your tailoring shop and services"
                      className="w-full bg-transparent text-sm text-theme-text-muted outline-none border-b border-theme-border pb-1.5 focus:border-theme-accent transition-colors resize-none leading-relaxed"
                    />
                  </div>
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
