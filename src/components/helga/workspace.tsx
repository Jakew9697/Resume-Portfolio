"use client";
import { useEffect, useState } from "react";
import { Widget } from "./widget";
import { DetailView } from "./detail-view";
import {
  ArrowLeft,
  ArrowUp,
  BarChart3,
  CalendarDays,
  Check,
  Circle,
  LayoutDashboard,
  Mail,
  Menu,
  Mic,
  NotebookText,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useWorkspace, type Snapshot } from "@/lib/use-workspace";
import { api } from "@/lib/api";
import type { WorkspaceData } from "@/lib/demo-data";
import { Feedback, Loading, Modal } from "@/components/demos/shared";
import { ListenButton, RecordButton } from "@/components/demos/voice";
import { NetworkOrb } from "./network-orb";
import "./helga.css";
import "./helga-dashboard.css";

type HelgaData = WorkspaceData<"helga">;
const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Calendar", icon: CalendarDays },
  { name: "Email", icon: Mail },
  { name: "Financials", icon: BarChart3 },
  { name: "Memory", icon: NotebookText },
  { name: "Comm Logs", icon: Mic },
  { name: "Accounts", icon: UserRound },
];
export default function HelgaWorkspace() {
  const work = useWorkspace("helga");
  const [view, setView] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [voice, setVoice] = useState("idle");
  const [draft, setDraft] = useState<HelgaData["drafts"][number] | null>(null);
  const [clock, setClock] = useState<Date>();
  const [edit, setEdit] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [event, setEvent] = useState<{ title: string; time: string } | null>(
    null,
  );
  useEffect(() => {
    setClock(new Date());
    const timer = setInterval(() => setClock(new Date()), 30000);
    try {
      setHidden(
        JSON.parse(localStorage.getItem("portfolio-helga-widgets") || "[]"),
      );
    } catch {}
    return () => clearInterval(timer);
  }, []);
  const send = async (message = input) => {
    if (!message.trim() || work.busy) return;
    const result = await work.run(() =>
      api<Snapshot<"helga"> & { answer: string; actions: string[] }>(
        "/ai/helga",
        { message },
      ),
    );
    if (result) {
      work.setSnapshot(result);
      setInput("");
      work.setNotice(result.actions.join(" · "));
    }
  };
  const copy = async (text: string) => {
    work.setError("");
    try {
      await navigator.clipboard.writeText(text);
      work.setNotice("Copied to clipboard");
    } catch {
      work.setError("Clipboard unavailable. Select the text to copy it.");
    }
  };
  const toggleWidget = (name: string) => {
    const next = hidden.includes(name)
      ? hidden.filter((n) => n !== name)
      : [...hidden, name];
    setHidden(next);
    localStorage.setItem("portfolio-helga-widgets", JSON.stringify(next));
  };
  const data = work.data;
  const open = (name: string) => (
    <button onClick={() => setView(name)}>Open</button>
  );
  const calendar = (
    <div className="h-events">
      {data?.events.map((e, i) => (
        <article key={e.id}>
          <div className="h-event-day">
            <strong>{String(clock?.getDate() || 16).padStart(2, "0")}</strong>
            <small>
              {clock?.toLocaleDateString("en-US", { month: "short" }) || "Sep"}
            </small>
          </div>
          <div>
            <strong>{e.title}</strong>
            <span>{e.time} · Visitor calendar</span>
          </div>
          {view === "Calendar" && (
            <button
              aria-label={`Delete event ${e.title}`}
              disabled={work.busy}
              onClick={() =>
                void work.save(
                  {
                    ...data!,
                    events: data!.events.filter((item) => item.id !== e.id),
                  },
                  "Event removed",
                )
              }
            >
              <Trash2 size={14} />
            </button>
          )}
        </article>
      ))}
      {!data?.events.length && (
        <p className="h-empty">
          Nothing on the calendar. A little breathing room.
        </p>
      )}
    </div>
  );
  const inbox = (
    <div className="h-inbox">
      {data?.drafts.length ? (
        data.drafts.map((d) => (
          <button key={d.id} onClick={() => setDraft(d)}>
            <span className="h-avatar">H</span>
            <span>
              <b>{d.subject}</b>
              <small>{d.body.slice(0, 95)}…</small>
              <em>Draft · ready for review</em>
            </span>
          </button>
        ))
      ) : (
        <div className="h-empty">
          <p>Your draft inbox is clear.</p>
          <span>
            Ask Helga to draft an email. Review it here before copying it.
          </span>
          <button
            onClick={() => {
              setInput("Draft a short project update");
              setView("Dashboard");
            }}
          >
            Draft a project update <ArrowUp size={12} />
          </button>
        </div>
      )}
    </div>
  );
  const priorities = (
    <div className="h-tasks">
      {data?.tasks.map((t) => (
        <div key={t.id}>
          <button
            disabled={work.busy}
            aria-label={`${t.done ? "Reopen" : "Complete"} ${t.title}`}
            className={t.done ? "done" : ""}
            onClick={() =>
              void work.save(
                {
                  ...data!,
                  tasks: data!.tasks.map((item) =>
                    item.id === t.id ? { ...item, done: !item.done } : item,
                  ),
                },
                t.done ? "Task reopened" : "Task completed",
              )
            }
          >
            {t.done ? <Check size={14} /> : <Circle size={14} />}
            <span>{t.title}</span>
          </button>
          {view === "Memory" && (
            <button
              disabled={work.busy}
              aria-label={`Delete task ${t.title}`}
              onClick={() =>
                void work.save(
                  {
                    ...data!,
                    tasks: data!.tasks.filter((item) => item.id !== t.id),
                  },
                  "Task removed",
                )
              }
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
  const transcript = (
    <>
      <div className="h-transcript" aria-live="polite">
        {data?.messages.length ? (
          data.messages.map((m, i) => (
            <article key={i} className={m.role}>
              <small>{m.role === "user" ? "You" : "Helga"}</small>
              <p>{m.text}</p>
              {m.role === "assistant" && (
                <ListenButton text={m.text} onError={work.setError} />
              )}
            </article>
          ))
        ) : (
          <p className="h-empty">
            No turns yet. Ask Helga to plan your day, add a task, or draft an
            email.
          </p>
        )}
        {work.busy && (
          <p role="status" className="h-empty">
            Working on your request…
          </p>
        )}
      </div>
      <form
        className="h-chat"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          aria-label="Message Helga"
          placeholder="Ask Helga…"
          maxLength={4000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          aria-label="Send to Helga"
          disabled={work.busy || !input.trim()}
        >
          <ArrowUp size={20} />
        </button>
      </form>
    </>
  );
  return (
    <main className={`helga-app ${collapsed ? "h-collapsed" : ""}`}>
      <aside className="h-sidebar">
        <header>
          <button
            aria-label="Toggle navigation"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={16} />
          </button>
          <a href="/helga/" className="h-brand">
            helga<span>.</span>
          </a>
        </header>
        <nav aria-label="Helga navigation">
          {navigation.map((n) => (
            <button
              key={n.name}
              title={n.name}
              aria-current={view === n.name ? "page" : undefined}
              onClick={() => setView(n.name)}
              className={view === n.name ? "selected" : ""}
            >
              <n.icon size={18} />
              <span>{n.name}</span>
            </button>
          ))}
        </nav>
        <a className="h-back" href="/" title="Back to portfolio">
          <ArrowLeft size={17} />
          <span>Back to portfolio</span>
        </a>
      </aside>
      <div className="h-main">
        <header className="h-topbar">
          <button className="h-account" onClick={() => setView("Accounts")}>
            visitor workspace <span>⌄</span>
          </button>
          <div className="h-meta">
            <span>
              {clock?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <i />
            <strong>
              {clock?.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </strong>
            <i />
            <span>Grand Rapids, MI</span>
            <i />
            <span className={`h-connected ${data ? "" : "pending"}`}>
              {data ? "connected" : "connecting"}
            </span>
          </div>
          <span className="h-model">Haiku 4.5</span>
        </header>
        <div className="h-feedback">
          <Feedback error={work.error} notice={work.notice} />
        </div>
        {!data ? (
          <Loading error={work.error} retry={work.reload} />
        ) : view === "Dashboard" ? (
          <div className="h-dashboard">
            <div className="h-dashboard-top">
              <Widget title="Calendar · 30 days" action={open("Calendar")}>
                {calendar}
              </Widget>
              <section className="h-orb-column">
                <NetworkOrb state={work.busy ? "thinking" : voice} />
                <div className="h-orb-status" role="status">
                  <i />
                  {work.busy
                    ? "thinking"
                    : voice === "recording"
                      ? "listening"
                      : voice === "transcribing"
                        ? "transcribing"
                        : "idle"}
                </div>
                <div className="h-orb-controls">
                  <RecordButton
                    splitControls
                    disabled={work.busy}
                    onText={(text) => {
                      setInput(text);
                      void send(text);
                    }}
                    onError={work.setError}
                    onState={setVoice}
                  />
                </div>
                <button
                  className="h-edit-dashboard"
                  aria-expanded={edit}
                  onClick={() => setEdit(!edit)}
                >
                  {edit ? "Done editing" : "Edit dashboard"}
                </button>
                {edit && (
                  <div className="h-widget-picker">
                    {["Cash flow", "Priorities", "Sync pulse", "Briefing"].map(
                      (name) => (
                        <label key={name}>
                          <input
                            type="checkbox"
                            checked={!hidden.includes(name)}
                            onChange={() => toggleWidget(name)}
                          />
                          {name}
                        </label>
                      ),
                    )}
                  </div>
                )}
              </section>
              <Widget title="Inbox" action={open("Email")}>
                {inbox}
              </Widget>
            </div>
            <div className="h-summary-grid">
              {!hidden.includes("Cash flow") && (
                <Widget title="Cash flow · this month">
                  <div className="h-cash">
                    <div>
                      <small>IN</small>
                      <b>—</b>
                    </div>
                    <div>
                      <small>OUT</small>
                      <b>—</b>
                    </div>
                  </div>
                  <span className="h-note">No financial account connected</span>
                </Widget>
              )}
              {!hidden.includes("Priorities") && (
                <Widget
                  title="Priorities · today"
                  action={
                    <button onClick={() => setView("Memory")}>
                      {data.tasks.filter((t) => !t.done).length} open
                    </button>
                  }
                >
                  {priorities}
                </Widget>
              )}
              {!hidden.includes("Sync pulse") && (
                <Widget title="Sync · pulse">
                  <div className="h-pulse">
                    <span>
                      <strong>{data.tasks.length}</strong>tasks
                    </span>
                    <span>
                      <strong>{data.events.length}</strong>events
                    </span>
                    <span>
                      <strong>{data.drafts.length}</strong>drafts
                    </span>
                  </div>
                </Widget>
              )}
              {!hidden.includes("Briefing") && (
                <Widget title="Helga · briefing">
                  <button
                    className="h-briefing"
                    disabled={work.busy}
                    onClick={() =>
                      void send(
                        "Help me plan my day based on my tasks and calendar.",
                      )
                    }
                  >
                    <span>Make a little room for your day.</span>
                    <small>Run morning briefing ↗</small>
                  </button>
                </Widget>
              )}
            </div>
            <div className="h-bottom-grid">
              <Widget
                title="Activity stream"
                action={<span className="h-live">● Live</span>}
              >
                <div className="h-activity">
                  <p className="h-empty">
                    {work.busy
                      ? "Helga is working with your workspace…"
                      : work.notice || "Ready when you are."}
                  </p>
                  <div>
                    <span>Tasks</span>
                    <b>{data.tasks.filter((t) => t.done).length} completed</b>
                  </div>
                  <div>
                    <span>Calendar</span>
                    <b>{data.events.length} events</b>
                  </div>
                  <div>
                    <span>Email</span>
                    <b>{data.drafts.length} drafts saved</b>
                  </div>
                </div>
              </Widget>
              <Widget
                title="Transcript"
                action={
                  <button
                    onClick={() =>
                      void copy(
                        data.messages
                          .map((m) => `${m.role}: ${m.text}`)
                          .join("\n\n"),
                      )
                    }
                    disabled={!data.messages.length}
                  >
                    Copy
                  </button>
                }
              >
                {transcript}
              </Widget>
            </div>
          </div>
        ) : (
          <DetailView
            view={view}
            data={data}
            calendar={calendar}
            inbox={inbox}
            priorities={priorities}
            transcript={transcript}
            setEvent={setEvent}
            setInput={setInput}
            setView={setView}
            copy={copy}
          />
        )}
      </div>
      {draft && (
        <Modal title={draft.subject} onClose={() => setDraft(null)}>
          <div className="prose-text">{draft.body}</div>
          <Feedback
            error={work.error}
            notice={work.notice === "Copied to clipboard" ? work.notice : ""}
          />
          <div className="modal-actions">
            <button className="primary" onClick={() => void copy(draft.body)}>
              Copy draft
            </button>
          </div>
        </Modal>
      )}
      {event && (
        <Modal title="New calendar event" onClose={() => setEvent(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                await work.save(
                  {
                    ...data!,
                    events: [
                      ...data!.events,
                      { id: crypto.randomUUID(), ...event },
                    ],
                  },
                  "Event added",
                )
              )
                setEvent(null);
            }}
          >
            <label>
              Event title
              <input
                required
                maxLength={300}
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
            </label>
            <label>
              Time
              <input
                required
                type="time"
                value={event.time}
                onChange={(e) => setEvent({ ...event, time: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <button className="primary" disabled={work.busy}>
                Save event
              </button>
            </div>
            <Feedback error={work.error} notice="" />
          </form>
        </Modal>
      )}
    </main>
  );
}
