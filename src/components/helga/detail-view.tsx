"use client";
import type { ReactNode } from "react";
import { Plus, UserRound } from "lucide-react";
import type { WorkspaceData } from "@/lib/demo-data";
import { Widget } from "./widget";
export function DetailView({
  view,
  data,
  calendar,
  inbox,
  priorities,
  transcript,
  setEvent,
  setInput,
  setView,
  copy,
}: {
  view: string;
  data: WorkspaceData<"helga">;
  calendar: ReactNode;
  inbox: ReactNode;
  priorities: ReactNode;
  transcript: ReactNode;
  setEvent: (event: { title: string; time: string }) => void;
  setInput: (value: string) => void;
  setView: (view: string) => void;
  copy: (value: string) => Promise<void>;
}) {
  return (
    <section className="h-detail-view">
      <div className="h-view-title">
        <h1>{view}</h1>
        <span>Visitor workspace · sample data</span>
      </div>
      {view === "Calendar" && (
        <>
          <button
            className="h-add"
            onClick={() => setEvent({ title: "", time: "10:00" })}
          >
            <Plus size={16} />
            New event
          </button>
          <Widget title="Upcoming events">{calendar}</Widget>
        </>
      )}
      {view === "Email" && (
        <Widget title="Email drafts">
          {inbox}
          <p className="h-note">
            Drafts stay in this workspace. No email is sent.
          </p>
        </Widget>
      )}
      {view === "Memory" && (
        <>
          <Widget title="Your tasks">
            {priorities}
            <button
              className="h-add"
              onClick={() => {
                setInput("Add a task to ");
                setView("Dashboard");
              }}
            >
              <Plus size={16} />
              Add a task with Helga
            </button>
          </Widget>
          <Widget title="Workspace memory">
            <p>
              Helga can use your tasks, calendar, drafts, and this conversation.
              Your guest workspace lasts 24 hours.
            </p>
          </Widget>
        </>
      )}
      {view === "Comm Logs" && (
        <Widget
          title="Conversation history"
          action={
            <button
              onClick={() =>
                void copy(
                  data.messages.map((m) => `${m.role}: ${m.text}`).join("\n\n"),
                )
              }
            >
              Copy
            </button>
          }
        >
          {transcript}
        </Widget>
      )}
      {view === "Financials" && (
        <Widget title="Connected finances">
          <h2 className="h-empty-title">
            A private part of the original Helga.
          </h2>
          <p>
            The original dashboard connects financial accounts. This public
            portfolio keeps those accounts private; no live balances or
            transactions are displayed.
          </p>
          <p>
            Try the calendar, task list, and email drafts to explore working
            integrations in this guest workspace.
          </p>
          <button className="h-add" onClick={() => setView("Dashboard")}>
            Back to dashboard
          </button>
        </Widget>
      )}
      {view === "Accounts" && (
        <Widget title="Visitor workspace">
          <h2 className="h-empty-title">A space of your own.</h2>
          <p>
            Tasks, calendar events, drafts, and conversations are saved to this
            guest session for 24 hours.
          </p>
          <div className="h-account-row">
            <UserRound size={22} />
            <div>
              <strong>Portfolio visitor</strong>
              <span>Demo calendar & drafts · connected</span>
            </div>
            <span className="h-connected">Active</span>
          </div>
          <p>
            Personal email, financial accounts, and private business information
            are kept out of this public demonstration.
          </p>
        </Widget>
      )}
    </section>
  );
}
