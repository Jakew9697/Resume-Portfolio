"use client";
import { useState } from "react";
import { stages, type Prospect } from "@/lib/demo-data";
import { locateAddress, position } from "./google-map";
import { MapPin, X } from "lucide-react";

export const blankProspect = (): Prospect => ({
  id: crypto.randomUUID(),
  company: "",
  contact: "",
  email: "",
  phone: "",
  city: "Grand Rapids",
  state: "Michigan",
  zip: "",
  territory: "West Michigan",
  owner: "You",
  stage: "New",
  value: 0,
  nextAction: "",
  notes: "",
  updated: new Date().toISOString(),
  priority: false,
  warehouse: "Grand Rapids",
  probability: 25,
});
export function ProspectForm({
  prospect,
  busy,
  onSave,
  onClose,
  onDelete,
}: {
  prospect: Prospect;
  busy: boolean;
  onSave: (p: Prospect) => Promise<void>;
  onClose: () => void;
  onDelete?: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(prospect);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const update = (key: keyof Prospect, value: string | number | boolean) =>
    setDraft((d) => ({
      ...d,
      [key]: value,
      ...(["address", "city", "state", "zip"].includes(key)
        ? { latitude: undefined, longitude: undefined, placeId: undefined }
        : {}),
    }));
  const locate = async () => {
    setError("");
    setLocating(true);
    try {
      const result = await locateAddress(
        `${draft.address || ""} ${draft.city} ${draft.state || "Michigan"} ${draft.zip || ""}`,
      );
      setDraft((d) => ({ ...d, ...result }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLocating(false);
    }
  };
  const field = (
    label: string,
    key: keyof Prospect,
    type = "text",
    required = false,
  ) => (
    <label>
      {label}
      <input
        type={type}
        required={required}
        value={String(draft[key] ?? "")}
        maxLength={key === "email" ? 200 : 100}
        onChange={(e) =>
          update(
            key,
            type === "number" ? Number(e.target.value) : e.target.value,
          )
        }
        min={type === "number" ? 0 : undefined}
        max={
          key === "probability" ? 100 : key === "value" ? 10000000 : undefined
        }
      />
    </label>
  );
  return (
    <div className="prospect-drawer">
      <header>
        <h2 id="prospect-form-title">
          {onDelete ? "Prospect details" : "New Prospect"}
        </h2>
        <button onClick={onClose} aria-label="Close prospect form">
          <X size={20} />
        </button>
      </header>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (
            !position(draft) ||
            (draft.address?.trim() && draft.latitude === undefined)
          ) {
            setError(
              "Locate this address before saving so it appears on the map.",
            );
            return;
          }
          await onSave({ ...draft, updated: new Date().toISOString() });
        }}
      >
        <h3>Store information</h3>
        {field("Store name", "company", "text", true)}
        {field("Street address", "address")}
        <div className="prospect-form-grid">
          {field("City", "city", "text", true)}
          {field("State", "state")}
          {field("ZIP code", "zip")}
        </div>
        <button
          type="button"
          className="secondary"
          disabled={locating || busy}
          onClick={() => void locate()}
        >
          <MapPin size={15} />
          {locating ? "Locating…" : "Locate address on map"}
        </button>
        <small>
          {draft.latitude === undefined
            ? "Sample prospects use their city center until an address is located."
            : `Location confirmed · ${draft.latitude.toFixed(4)}, ${draft.longitude?.toFixed(4)}`}
        </small>
        <h3>Contact & assignment</h3>
        {field("Contact name", "contact", "text", true)}
        <div className="prospect-form-grid">
          {field("Email", "email", "email")}
          {field("Phone", "phone")}
        </div>
        <div className="prospect-form-grid">
          {field("Lead associate", "owner")}
          {field("Warehouse", "warehouse")}
        </div>
        {field("Distributor", "distributor")}
        <h3>Opportunity</h3>
        <div className="prospect-form-grid">
          <label>
            Status
            <select
              value={draft.stage}
              onChange={(e) => update("stage", e.target.value)}
            >
              {stages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {field("Estimated annual value ($)", "value", "number")}
          {field("Probability (%)", "probability", "number")}
          {field("Expected close date", "closeDate", "date")}
        </div>
        <label className="check-field">
          <input
            type="checkbox"
            checked={draft.priority || false}
            onChange={(e) => update("priority", e.target.checked)}
          />
          High priority
        </label>
        {field("Next action", "nextAction")}
        <label>
          Activity / notes
          <textarea
            value={draft.notes}
            maxLength={8000}
            rows={4}
            onChange={(e) => update("notes", e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <footer>
          {onDelete && (
            <button
              type="button"
              className="danger-button"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Delete this demo prospect?"))
                  void onDelete();
              }}
            >
              Delete
            </button>
          )}
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" disabled={busy || locating}>
            {busy ? "Saving…" : "Save prospect"}
          </button>
        </footer>
      </form>
    </div>
  );
}
