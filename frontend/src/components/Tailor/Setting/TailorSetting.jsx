import { useContext, useEffect, useRef, useState } from "react";
import { Camera, ChevronRight, Lock, Minus, Plus, ShieldCheck, X } from "lucide-react";
import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../../context/AuthContext";
import { authFetch } from "../../../utils/authFetch.jsx";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location && window.location.hostname && window.location.hostname.includes("vercel.app") ? "https://my-tailor-backend.vercel.app" : "http://localhost:5000");

const getInitialForm = (tailor) => ({
  tailorName: tailor?.tailorName || "My Tailor",
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
});

function SectionLabel({ children }) {
  return <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">{children}</p>;
}

function FieldLabel({ children }) {
  return <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-yellow-400">{children}</p>;
}

function Divider() {
  return <div className="my-4 h-px bg-neutral-800" />;
}

function InfoCard({ children }) {
  return <div className="mb-5 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">{children}</div>;
}

function TagList({ items, onRemove, accent = "yellow" }) {
  const tagClass =
    accent === "yellow"
      ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-300"
      : "border-neutral-700 bg-neutral-800 text-neutral-200";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onRemove(item)}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium ${tagClass}`}
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
      {items.length > 0 ? <TagList items={items} onRemove={removeItem} accent={accent} /> : null}

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

export default function TailorSetting() {
  const { tailor, setTailor } = useContext(AuthContext);
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
        const res = await authFetch(`${apiBaseUrl}/api/tailor/profile`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load tailor profile");
        }

        setTailor(data.tailor);
        localStorage.setItem("tailor", JSON.stringify(data.tailor));
        setForm(getInitialForm(data.tailor));
      } catch (err) {
        setError(err.message || "Failed to load tailor profile");
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
      };

      const res = await authFetch(`${apiBaseUrl}/api/tailor/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update tailor profile");
      }

      setTailor(data.tailor);
      localStorage.setItem("tailor", JSON.stringify(data.tailor));
      setForm(getInitialForm(data.tailor));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update tailor profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authFetch(`${apiBaseUrl}/api/tailor/logout`, {
        method: "POST",
      });
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

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-md px-4 pb-10 pt-3">
        <div className="mb-6 flex items-center justify-between border-b border-neutral-900 pb-3">
          <button type="button" onClick={() => window.history.back()} className="text-sm text-neutral-300">
            &lt;
          </button>
          <h1 className="text-sm font-semibold">Profile Settings</h1>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="text-xs font-bold text-yellow-400 disabled:text-yellow-700"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={profileImage}
              alt={form.tailorName || "Tailor profile"}
              className="h-24 w-24 rounded-full border-2 border-yellow-500 object-cover shadow-[0_0_0_6px_rgba(234,179,8,0.07)]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg"
            >
              <Camera size={14} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          <h2 className="mt-3 text-xl font-bold">{form.tailorName || "My Tailor"}</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-400">
            {form.professionalTitle || "MASTER TAILOR & DESIGNER"}
          </p>
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

        <SectionLabel>Personal Info</SectionLabel>
        <InfoCard>
          <FieldLabel>Full Name</FieldLabel>
          <input
            value={form.tailorName}
            onChange={setField("tailorName")}
            placeholder="Enter full name"
            className="w-full bg-transparent text-sm text-neutral-100 outline-none"
          />

          <Divider />
          <FieldLabel>Email</FieldLabel>
          <div className="flex items-center justify-between gap-3">
            <input
              value={form.tailorEmail || "No email found"}
              disabled
              readOnly
              className="w-full bg-transparent text-sm text-neutral-400 outline-none"
            />
            <Lock size={14} className="text-neutral-600" />
          </div>

          <Divider />
          <FieldLabel>Phone Number</FieldLabel>
          <input
            value={form.tailorMobileNumber}
            onChange={setField("tailorMobileNumber")}
            placeholder="Enter phone number"
            className="w-full bg-transparent text-sm text-neutral-100 outline-none"
          />

          <Divider />
          <button type="button" className="flex w-full items-center justify-between text-sm text-neutral-400">
            <span>Reset Password</span>
            <ChevronRight size={16} className="text-yellow-400" />
          </button>
        </InfoCard>

        <SectionLabel>Shop Details</SectionLabel>
        <InfoCard>
          <FieldLabel>Shop Name</FieldLabel>
          <input
            value={form.shopName}
            onChange={setField("shopName")}
            placeholder="Enter shop name"
            className="w-full bg-transparent text-sm font-semibold text-neutral-100 outline-none"
          />

          <Divider />
          <FieldLabel>Address</FieldLabel>
          <div className="mb-3 overflow-hidden rounded-xl border border-neutral-800">
            <svg viewBox="0 0 340 110" width="100%" height="110" xmlns="http://www.w3.org/2000/svg">
              <rect width="340" height="110" fill="#1f2937" />
              {[15, 35, 55, 75, 95].map((y) => <rect key={y} x="0" y={y} width="340" height="6" fill="#374151" />)}
              {[30, 70, 110, 150, 190, 230, 270, 310].map((x) => <rect key={x} x={x} y="0" width="5" height="110" fill="#4b5563" />)}
              <path d="M0 80 Q85 72 170 76 Q255 80 340 72 L340 110 L0 110 Z" fill="#0f766e" fillOpacity="0.45" />
              <ellipse cx="170" cy="54" rx="16" ry="16" fill="#facc15" fillOpacity="0.25" />
              <circle cx="170" cy="54" r="10" fill="#facc15" />
              <circle cx="170" cy="54" r="4" fill="#111827" />
            </svg>
          </div>
          <textarea
            value={form.shopAddress}
            onChange={setField("shopAddress")}
            rows={2}
            placeholder="Enter shop address"
            className="w-full resize-none bg-transparent text-sm text-neutral-300 outline-none"
          />

          <Divider />
          <FieldLabel>Shop Description</FieldLabel>
          <textarea
            value={form.shopDescription}
            onChange={setField("shopDescription")}
            rows={4}
            placeholder="Describe your tailoring shop and services"
            className="w-full resize-none bg-transparent text-sm leading-6 text-neutral-300 outline-none"
          />
        </InfoCard>

        <SectionLabel>Professional Bio</SectionLabel>
        <InfoCard>
          <FieldLabel>Professional Title</FieldLabel>
          <input
            value={form.professionalTitle}
            onChange={setField("professionalTitle")}
            placeholder="Enter professional title"
            className="w-full bg-transparent text-sm text-neutral-100 outline-none"
          />

          <Divider />
          <FieldLabel>Years of Experience</FieldLabel>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-lg font-bold text-neutral-100">{form.yearsOfExperience} Years</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => adjustYears(-1)} className="rounded-lg bg-neutral-800 p-2 text-neutral-200">
                <Minus size={16} />
              </button>
              <button type="button" onClick={() => adjustYears(1)} className="rounded-lg bg-yellow-400 p-2 text-black">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <TagInput
            label="Specialization"
            placeholder="Add specialization"
            items={form.specializations}
            setItems={updateListField("specializations")}
            accent="yellow"
          />

          <Divider />
          <TagInput
            label="Key Skills"
            placeholder="Add key skill"
            items={form.keySkills}
            setItems={updateListField("keySkills")}
            accent="neutral"
          />
        </InfoCard>

        <SectionLabel>Verification Info</SectionLabel>
        <InfoCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800 bg-emerald-950/60">
                <ShieldCheck size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-100">Identity Status</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                  {form.identityStatus || "Verified"}
                </p>
              </div>
            </div>

            <div className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] text-neutral-400">
              Since {joinedOn}
            </div>
          </div>
        </InfoCard>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-4 text-sm font-semibold text-red-300"
        >
          Logout
        </button>

        <button type="button" className="mt-4 block w-full text-center text-xs text-neutral-500">
          Delete Account
        </button>
      </div>
    </div>
  );
}
