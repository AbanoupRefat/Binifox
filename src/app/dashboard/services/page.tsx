"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { revalidateHelpers } from "@/lib/revalidate";
import { Briefcase, Code, Palette, TrendingUp, Users, Zap, Target, Award, X, Plus, Video, Image as ImageIcon } from "lucide-react";

const iconOptions = [
  { name: "Briefcase", component: Briefcase },
  { name: "Code", component: Code },
  { name: "Palette", component: Palette },
  { name: "TrendingUp", component: TrendingUp },
  { name: "Users", component: Users },
  { name: "Zap", component: Zap },
  { name: "Target", component: Target },
  { name: "Award", component: Award },
];

type SubServiceDraft = {
  title: string;
  description: string;
  image_url: string;
  gdrive_video_url: string;
  imageFile: File | null;
  uploading: boolean;
};

function emptySubService(): SubServiceDraft {
  return { title: "", description: "", image_url: "", gdrive_video_url: "", imageFile: null, uploading: false };
}

export default function ServicesAdmin() {
  const [title, setTitle] = useState("");
  const [iconName, setIconName] = useState("Briefcase");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [clients, setClients] = useState<string[]>([]);
  const [subServices, setSubServices] = useState<SubServiceDraft[]>([emptySubService()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // --- Clients tag input ---
  const addClient = () => {
    const val = clientInput.trim();
    if (val && !clients.includes(val)) setClients([...clients, val]);
    setClientInput("");
  };
  const removeClient = (c: string) => setClients(clients.filter((x) => x !== c));

  // --- Sub-service helpers ---
  const updateSub = (i: number, patch: Partial<SubServiceDraft>) =>
    setSubServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const uploadSubImage = async (i: number, file: File) => {
    updateSub(i, { imageFile: file, uploading: true });
    const url = await uploadImage(file, "service-images");
    updateSub(i, { image_url: url ?? "", uploading: false });
  };

  const removeSub = (i: number) => setSubServices((prev) => prev.filter((_, idx) => idx !== i));

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    setMessage("");

    try {
      // 1. Upload main image if a file was selected
      let finalImageUrl = mainImageUrl;
      if (mainImageFile) {
        const uploaded = await uploadImage(mainImageFile, "service-images");
        if (!uploaded) throw new Error("Main image upload failed");
        finalImageUrl = uploaded;
      }

      // 2. Insert service
      const { data: svcData, error: svcError } = await supabase
        .from("services")
        .insert({
          title,
          icon_name: iconName,
          short_description: shortDescription || null,
          description: description || null,
          image_url: finalImageUrl || null,
          clients: clients.length > 0 ? clients : null,
        } as any)
        .select("id")
        .single() as any;

      if (svcError) throw svcError;
      const serviceId = (svcData as any).id as string;

      // 3. Insert sub-services
      const validSubs = subServices.filter((s) => s.title.trim());
      if (validSubs.length > 0) {
        const rows = validSubs.map((s) => ({
          service_id: serviceId,
          title: s.title,
          description: s.description || null,
          image_url: s.image_url || null,
          gdrive_video_url: s.gdrive_video_url || null,
        }));
        const { error: subError } = await supabase.from("sub_services").insert(rows as any);
        if (subError) throw subError;
      }

      await revalidateHelpers.services();
      setMessage("Service saved successfully!");
      // Reset
      setTitle(""); setIconName("Briefcase"); setShortDescription(""); setDescription("");
      setMainImageFile(null); setMainImageUrl(""); setClients([]); setClientInput("");
      setSubServices([emptySubService()]);
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectedIcon = iconOptions.find((o) => o.name === iconName)?.component || Briefcase;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark">Add Service</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the service details, clients, and sub-services below.</p>
      </div>

      {message && (
        <div className={`p-4 rounded flex items-center justify-between text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ── */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-5">
          <h2 className="font-semibold text-dark text-lg">Basic Information</h2>

          <div>
            <label className="label">Service Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)}
              className="input" placeholder="e.g., Social Media Marketing" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Icon</label>
              <select value={iconName} onChange={(e) => setIconName(e.target.value)} className="input">
                {iconOptions.map((o) => <option key={o.name} value={o.name}>{o.name}</option>)}
              </select>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <SelectedIcon className="w-5 h-5 text-primary" /> {iconName}
              </div>
            </div>
            <div>
              <label className="label">Short Description</label>
              <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
                className="input" placeholder="One-liner shown on cards" maxLength={120} />
            </div>
          </div>

          <div>
            <label className="label">Full Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              className="input resize-none" placeholder="Detailed description of the service..." />
          </div>

          {/* Main image */}
          <div>
            <label className="label">Main Service Image</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                {mainImageFile ? mainImageFile.name : "Choose image"}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setMainImageFile(f); }} />
              </label>
              {mainImageFile && <span className="text-xs text-green-600">Ready to upload</span>}
            </div>
          </div>
        </section>

        {/* ── Clients ── */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h2 className="font-semibold text-dark text-lg">Clients</h2>
          <div className="flex gap-2">
            <input value={clientInput} onChange={(e) => setClientInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addClient(); } }}
              className="input flex-1" placeholder="Type client name and press Enter or Add" />
            <button type="button" onClick={addClient}
              className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-dark transition-colors">
              Add
            </button>
          </div>
          {clients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {clients.map((c) => (
                <span key={c} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {c}
                  <button type="button" onClick={() => removeClient(c)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── Sub-Services ── */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-dark text-lg">Sub-Services</h2>
            <button type="button" onClick={() => setSubServices([...subServices, emptySubService()])}
              className="flex items-center gap-1 text-sm text-primary hover:text-dark transition-colors font-medium">
              <Plus className="w-4 h-4" /> Add Sub-Service
            </button>
          </div>

          {subServices.map((sub, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sub-Service {i + 1}</span>
                {subServices.length > 1 && (
                  <button type="button" onClick={() => removeSub(i)}
                    className="text-red-400 hover:text-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="label">Title *</label>
                <input value={sub.title} onChange={(e) => updateSub(i, { title: e.target.value })}
                  className="input" placeholder="e.g., Facebook Ads Management" />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea rows={3} value={sub.description} onChange={(e) => updateSub(i, { description: e.target.value })}
                  className="input resize-none" placeholder="What this sub-service includes..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image upload */}
                <div>
                  <label className="label flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image</label>
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                    {sub.uploading ? "Uploading..." : sub.image_url ? "✓ Uploaded" : sub.imageFile ? sub.imageFile.name : "Choose image"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSubImage(i, f); }} />
                  </label>
                </div>

                {/* GDrive URL */}
                <div>
                  <label className="label flex items-center gap-1"><Video className="w-3 h-3" /> Google Drive Video URL</label>
                  <input value={sub.gdrive_video_url} onChange={(e) => updateSub(i, { gdrive_video_url: e.target.value })}
                    className="input text-sm" placeholder="https://drive.google.com/file/d/.../view" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 font-teko uppercase tracking-wider rounded hover:bg-dark transition-colors disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save Service"}
        </button>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.8rem; font-weight: 500; color: #374151; margin-bottom: 0.35rem; }
        .input { width: 100%; padding: 0.65rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9rem; outline: none; }
        .input:focus { border-color: var(--color-primary, #f97316); box-shadow: 0 0 0 2px rgba(249,115,22,0.15); }
      `}</style>
    </div>
  );
}
