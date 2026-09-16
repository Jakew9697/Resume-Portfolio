"use client";
import { useMemo, useState } from "react";
import { Panel } from "./panel";
import {
  ArrowLeft,
  Download,
  Filter,
  LocateFixed,
  MapPin,
  Menu,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import { useWorkspace } from "@/lib/use-workspace";
import { type Prospect, stages } from "@/lib/demo-data";
import { download } from "@/lib/download";
import { Feedback, Loading, Modal } from "@/components/demos/shared";
import { GoogleMap, discoverPlaces, type DiscoveredPlace } from "./google-map";
import { blankProspect, ProspectForm } from "./prospect-form";
import "./prospects.css";

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
export default function ProspectsWorkspace() {
  const work = useWorkspace("prospects");
  const [panel, setPanel] = useState<
    "menu" | "filters" | "discovery" | "saved" | "report" | null
  >(null);
  const [editing, setEditing] = useState<Prospect | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [closed, setClosed] = useState("hide");
  const [priority, setPriority] = useState(false);
  const [warehouse, setWarehouse] = useState("All");
  const [owner, setOwner] = useState("All");
  const [distributor, setDistributor] = useState("All");
  const [filterTab, setFilterTab] = useState("General");
  const [legend, setLegend] = useState(false);
  const [fit, setFit] = useState(0);
  const [query, setQuery] = useState("coffee shops in Grand Rapids");
  const [places, setPlaces] = useState<DiscoveredPlace[]>([]);
  const [searched, setSearched] = useState(false);
  const all = useMemo(() => work.data?.prospects || [], [work.data]);
  const filtered = useMemo(
    () =>
      all.filter(
        (p) =>
          !p.future &&
          (closed === "all" ||
            (closed === "only") === ["Won", "Lost"].includes(p.stage)) &&
          (!priority || p.priority) &&
          (warehouse === "All" || (p.warehouse || p.city) === warehouse) &&
          (owner === "All" || p.owner === owner) &&
          (distributor === "All" || p.distributor === distributor),
      ),
    [all, closed, priority, warehouse, owner, distributor],
  );
  const results = all.filter(
    (p) =>
      !p.future &&
      `${p.company} ${p.address} ${p.city}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const filters =
    Number(closed !== "hide") +
    Number(priority) +
    Number(warehouse !== "All") +
    Number(owner !== "All") +
    Number(distributor !== "All");
  const save = async (p: Prospect) => {
    const saved = await work.save(
      {
        prospects: all.some((item) => item.id === p.id)
          ? all.map((item) => (item.id === p.id ? p : item))
          : [...all, p],
      },
      "Prospect saved",
    );
    if (saved) {
      setEditing(null);
      setSelected(p.id);
    }
  };
  const exportCsv = () => {
    const cell = (v: unknown) =>
      `"${String(v ?? "")
        .replace(/^[=+@-]/, "'$&")
        .replaceAll('"', '""')}"`;
    const rows = [
      [
        "Store",
        "Contact",
        "City",
        "Status",
        "Value",
        "Warehouse",
        "Priority",
        "Next action",
      ],
      ...filtered.map((p) => [
        p.company,
        p.contact,
        p.city,
        p.stage,
        p.value,
        p.warehouse || p.city,
        p.priority ? "Yes" : "No",
        p.nextAction,
      ]),
    ];
    download(
      new Blob([rows.map((row) => row.map(cell).join(",")).join("\r\n")], {
        type: "text/csv;charset=utf-8",
      }),
      "prospects-report.csv",
    );
  };
  const convert = (p: DiscoveredPlace) => {
    setPanel(null);
    setEditing({
      ...blankProspect(),
      company: p.name,
      address: p.address,
      latitude: p.latitude,
      longitude: p.longitude,
      city: p.city,
      state: p.state,
      zip: p.zip,
      placeId: p.id,
    });
  };
  const saveFuture = async (p: DiscoveredPlace) => {
    await work.save(
      {
        prospects: [
          ...all,
          {
            ...blankProspect(),
            company: p.name,
            contact: "Not contacted",
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            city: p.city,
            state: p.state,
            zip: p.zip,
            placeId: p.id,
            future: true,
          },
        ],
      },
      "Saved for later",
    );
  };
  return (
    <main className="prospects-app">
      <GoogleMap
        prospects={filtered}
        selected={selected}
        onSelect={setSelected}
        onDetails={setEditing}
        fit={fit}
      />
      <header className="prospect-toolbar">
        <button
          className="primary"
          onClick={() => setEditing(blankProspect())}
          disabled={!work.data}
        >
          <Plus size={16} />
          New Prospect
        </button>
        <div className="prospect-title">
          <b>Customer Prospects</b>
          <span>{filtered.length} on map · Michigan</span>
        </div>
        <button
          className="map-menu-button"
          aria-label="Open prospects menu"
          onClick={() => setPanel("menu")}
        >
          <Menu size={20} />
          {filters > 0 && <span>{filters}</span>}
        </button>
      </header>
      <div className="map-feedback">
        <Feedback error={work.error} notice={work.notice} />
      </div>
      {!work.data && (
        <div className="map-loading">
          <Loading error={work.error} retry={work.reload} />
        </div>
      )}
      <div className="map-bottom">
        <div className="map-legend-container">
          {legend && (
            <section className="map-legend">
              <h2>Map Key</h2>
              <p>
                <span className="legend-dot" />
                Active Prospect
              </p>
              <p>
                <span className="legend-dot gray" />
                Closed Prospect
              </p>
              <p>
                <Star size={17} color="#e8b86b" />
                High Priority
              </p>
              <small>
                Letters identify the warehouse.
                <br />
                Fictional sample stores use city centers.
              </small>
            </section>
          )}
          <button onClick={() => setLegend(!legend)} aria-expanded={legend}>
            Map Key
          </button>
          <button
            aria-label="Fit all prospects on map"
            onClick={() => setFit((f) => f + 1)}
          >
            <LocateFixed size={18} />
          </button>
        </div>
        <a href="/">
          <ArrowLeft size={14} />
          Portfolio
        </a>
      </div>
      <div className="map-demo-caption">
        Interactive demo · fictional sample prospects · saved for 24 hours
      </div>
      {panel === "menu" && (
        <Panel title="Customer Prospects Menu" onClose={() => setPanel(null)}>
          <div className="prospect-drawer">
            <header>
              <h2>Customer Prospects Menu</h2>
              <button aria-label="Close menu" onClick={() => setPanel(null)}>
                <X size={20} />
              </button>
            </header>
            <div className="prospect-menu-body">
              <label className="prospect-search">
                <Search size={18} />
                <input
                  aria-label="Search prospects"
                  placeholder="Search by store name or address…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => setSearch("")}>Clear</button>
              </label>
              <div className="prospect-menu-actions">
                <button onClick={() => setPanel("discovery")}>Discovery</button>
                <button onClick={() => setPanel("saved")}>
                  Saved Future Prospects{" "}
                  <span>{all.filter((p) => p.future).length}</span>
                </button>
                <button onClick={() => setPanel("filters")}>
                  Filters <span>{filters}</span>
                </button>
                <button onClick={() => setPanel("report")}>Reporting</button>
              </div>
              <h3>
                {search ? "Search results" : "Your prospects"}{" "}
                <small>{results.length}</small>
              </h3>
              <div className="prospect-results">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setClosed("all");
                      setWarehouse("All");
                      setOwner("All");
                      setDistributor("All");
                      setPriority(false);
                      setSelected(p.id);
                      setPanel(null);
                    }}
                  >
                    <MapPin size={17} />
                    <span>
                      <b>{p.company}</b>
                      <small>{p.address || `${p.city}, MI`}</small>
                    </span>
                    <span className="prospect-stage">{p.stage}</span>
                  </button>
                ))}
                {!results.length && <p>No prospects match this search.</p>}
              </div>
              <a className="prospect-back" href="/">
                <ArrowLeft size={16} />
                Back to portfolio
              </a>
            </div>
          </div>
        </Panel>
      )}
      {editing && (
        <Panel title="Prospect details" onClose={() => setEditing(null)}>
          <ProspectForm
            key={editing.id}
            prospect={editing}
            busy={work.busy}
            onClose={() => setEditing(null)}
            onSave={save}
            onDelete={
              all.some((p) => p.id === editing.id)
                ? async () => {
                    const result = await work.save(
                      { prospects: all.filter((p) => p.id !== editing.id) },
                      "Prospect removed",
                    );
                    if (result) {
                      setEditing(null);
                      setSelected(null);
                    }
                  }
                : undefined
            }
          />
          <Feedback error={work.error} notice="" />
        </Panel>
      )}
      {panel === "filters" && (
        <Modal title="Filter Prospects" onClose={() => setPanel(null)}>
          <div className="prospect-filter-tabs">
            {["General", "Warehouses", "Lead Associates", "Distributors"].map(
              (tab) => (
                <button
                  className={filterTab === tab ? "active" : ""}
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          {filterTab === "General" ? (
            <>
              <label>
                Closed prospects
                <select
                  value={closed}
                  onChange={(e) => setClosed(e.target.value)}
                >
                  <option value="hide">Hide closed prospects</option>
                  <option value="all">Show all prospects</option>
                  <option value="only">Only closed prospects</option>
                </select>
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={priority}
                  onChange={(e) => setPriority(e.target.checked)}
                />
                High priority only
              </label>
            </>
          ) : (
            (() => {
              const key =
                filterTab === "Warehouses"
                  ? "warehouse"
                  : filterTab === "Lead Associates"
                    ? "owner"
                    : "distributor";
              const value =
                key === "warehouse"
                  ? warehouse
                  : key === "owner"
                    ? owner
                    : distributor;
              const setter =
                key === "warehouse"
                  ? setWarehouse
                  : key === "owner"
                    ? setOwner
                    : setDistributor;
              const options = [
                ...new Set(
                  all
                    .map((p) =>
                      key === "warehouse" ? p.warehouse || p.city : p[key],
                    )
                    .filter(Boolean),
                ),
              ];
              return (
                <label>
                  {filterTab}
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  >
                    <option>All</option>
                    {options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              );
            })()
          )}
          <div className="modal-actions">
            <button
              className="secondary"
              onClick={() => {
                setClosed("hide");
                setPriority(false);
                setWarehouse("All");
                setOwner("All");
                setDistributor("All");
              }}
            >
              Reset filters
            </button>
            <button className="primary" onClick={() => setPanel(null)}>
              <Filter size={15} />
              Show {filtered.length} prospects
            </button>
          </div>
        </Modal>
      )}
      {(panel === "discovery" || panel === "saved") && (
        <Modal
          title={
            panel === "saved" ? "Saved Future Prospects" : "Prospect Discovery"
          }
          onClose={() => setPanel(null)}
        >
          {panel === "discovery" ? (
            <>
              <p>
                Find businesses with Google Places, then add them to your
                workspace.
              </p>
              <form
                className="discovery-search"
                onSubmit={(e) => {
                  e.preventDefault();
                  void work.run(async () => {
                    const found = await discoverPlaces(query);
                    setPlaces(found);
                    setSearched(true);
                  });
                }}
              >
                <input
                  aria-label="Discover businesses"
                  required
                  minLength={3}
                  maxLength={200}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="primary" disabled={work.busy}>
                  <Search size={16} />
                  {work.busy ? "Searching…" : "Search"}
                </button>
              </form>
              <div className="discovery-results">
                {places.map((p) => (
                  <article key={p.id}>
                    <h3>{p.name}</h3>
                    <p>{p.address}</p>
                    <div>
                      <button className="primary" onClick={() => convert(p)}>
                        Add prospect
                      </button>
                      <button
                        className="secondary"
                        disabled={
                          work.busy || all.some((item) => item.placeId === p.id)
                        }
                        onClick={() => void saveFuture(p)}
                      >
                        {all.some((item) => item.placeId === p.id)
                          ? "Saved"
                          : "Save for later"}
                      </button>
                    </div>
                  </article>
                ))}
                {searched && !places.length && (
                  <p>
                    No businesses found. Try a broader location or category.
                  </p>
                )}
              </div>
              <small>Business results from Google Maps</small>
            </>
          ) : (
            <div className="discovery-results">
              {all
                .filter((p) => p.future)
                .map((p) => (
                  <article key={p.id}>
                    <h3>{p.company}</h3>
                    <p>{p.address}</p>
                    <button
                      className="primary"
                      onClick={() => {
                        setEditing({ ...p, future: false, contact: "" });
                        setPanel(null);
                      }}
                    >
                      Convert to prospect
                    </button>
                    <button
                      className="secondary"
                      disabled={work.busy}
                      onClick={() =>
                        void work.save(
                          { prospects: all.filter((item) => item.id !== p.id) },
                          "Removed saved place",
                        )
                      }
                    >
                      Remove
                    </button>
                  </article>
                ))}
              {!all.some((p) => p.future) && (
                <p>
                  No saved prospects yet. Use Discovery to find a business and
                  save it for later.
                </p>
              )}
            </div>
          )}
          <Feedback error={work.error} notice={work.notice} />
        </Modal>
      )}
      {panel === "report" && (
        <Modal title="Prospect Reporting" onClose={() => setPanel(null)}>
          <p>
            Current map filters · {filtered.length} prospects ·{" "}
            {money(filtered.reduce((sum, p) => sum + p.value, 0))} estimated
            annual value
          </p>
          {stages.map((stage) => {
            const items = filtered.filter((p) => p.stage === stage);
            return (
              <div className="prospect-report-row" key={stage}>
                <span>{stage}</span>
                <div>
                  <i
                    style={{
                      width: `${(items.length / Math.max(filtered.length, 1)) * 100}%`,
                    }}
                  />
                </div>
                <b>{items.length}</b>
                <span>{money(items.reduce((sum, p) => sum + p.value, 0))}</span>
              </div>
            );
          })}
          <div className="modal-actions">
            <button className="primary" onClick={exportCsv}>
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
