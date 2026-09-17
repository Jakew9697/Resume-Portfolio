"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Prospect } from "@/lib/demo-data";

let loading: Promise<void> | undefined;
declare global {
  interface Window {
    portfolioMapsReady?: () => void;
    gm_authFailure?: () => void;
  }
}
export function loadMaps() {
  if (!loading)
    loading = api<{ key: string }>("/maps/config")
      .then(
        ({ key }) =>
          new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            const timeout = setTimeout(
              () =>
                reject(
                  new Error(
                    "Google Maps took too long to load. Refresh to try again.",
                  ),
                ),
              20000,
            );
            window.portfolioMapsReady = () => {
              clearTimeout(timeout);
              resolve();
            };
            window.gm_authFailure = () => {
              clearTimeout(timeout);
              window.dispatchEvent(new Event("maps-auth-error"));
              reject(
                new Error("Google Maps is not authorized for this website."),
              );
            };
            script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key, v: "weekly", loading: "async", callback: "portfolioMapsReady" })}`;
            script.async = true;
            script.onerror = () => {
              clearTimeout(timeout);
              reject(
                new Error(
                  "Google Maps could not load. Check your connection and refresh.",
                ),
              );
            };
            document.head.append(script);
          }),
      )
      .catch((error) => {
        loading = undefined;
        throw error;
      });
  return loading;
}

const cityCenters: Record<string, [number, number]> = {
  "Grand Rapids": [42.9634, -85.6681],
  "Traverse City": [44.7631, -85.6206],
  Holland: [42.7875, -86.1089],
  Lansing: [42.7325, -84.5555],
  Muskegon: [43.2342, -86.2484],
  "Ann Arbor": [42.2808, -83.743],
  Kalamazoo: [42.2917, -85.5872],
  Petoskey: [45.3733, -84.9553],
};
export function position(p: Prospect) {
  if (p.latitude !== undefined && p.longitude !== undefined)
    return { lat: p.latitude, lng: p.longitude };
  const point = cityCenters[p.city];
  return point ? { lat: point[0], lng: point[1] } : undefined;
}
export async function locateAddress(address: string) {
  await loadMaps();
  const { Geocoder } = (await google.maps.importLibrary(
    "geocoding",
  )) as google.maps.GeocodingLibrary;
  const { results } = await new Geocoder().geocode({ address, region: "US" });
  if (!results[0])
    throw new Error("No location found. Try a street address and city.");
  const part = (type: string) =>
    results[0].address_components.find((c) => c.types.includes(type))
      ?.long_name || "";
  return {
    latitude: results[0].geometry.location.lat(),
    longitude: results[0].geometry.location.lng(),
    address: results[0].formatted_address,
    placeId: results[0].place_id,
    city: part("locality") || part("administrative_area_level_2"),
    state: part("administrative_area_level_1"),
    zip: part("postal_code"),
  };
}
export type DiscoveredPlace = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zip: string;
};
export async function discoverPlaces(
  query: string,
): Promise<DiscoveredPlace[]> {
  await loadMaps();
  const { Place } = (await google.maps.importLibrary(
    "places",
  )) as google.maps.PlacesLibrary;
  const { places } = await Place.searchByText({
    textQuery: query,
    fields: [
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "addressComponents",
    ],
    maxResultCount: 10,
    locationBias: { lat: 42.9634, lng: -85.6681 },
  });
  return places
    .filter((p) => p.location)
    .map((p) => {
      const part = (type: string) =>
        p.addressComponents?.find((c) => c.types.includes(type))?.longText ||
        "";
      return {
        id: p.id,
        name: p.displayName || "Business",
        address: p.formattedAddress || "",
        latitude: p.location!.lat(),
        longitude: p.location!.lng(),
        city: part("locality") || part("administrative_area_level_2"),
        state: part("administrative_area_level_1"),
        zip: part("postal_code"),
      };
    });
}

export function GoogleMap({
  prospects,
  selected,
  onSelect,
  onDetails,
  fit,
}: {
  prospects: Prospect[];
  selected: string | null;
  onSelect: (id: string) => void;
  onDetails: (p: Prospect) => void;
  fit: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const markers = useRef(
    new Map<string, google.maps.marker.AdvancedMarkerElement>(),
  );
  const callbacks = useRef({ onSelect, onDetails });
  useEffect(() => {
    callbacks.current = { onSelect, onDetails };
  }, [onSelect, onDetails]);
  useEffect(() => {
    let cancelled = false;
    const authError = () =>
      setError(
        "Google Maps is not authorized for this domain. You can still manage prospects from the menu.",
      );
    window.addEventListener("maps-auth-error", authError);
    void loadMaps()
      .then(async () => {
        const { Map } = (await google.maps.importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;
        await google.maps.importLibrary("marker");
        if (cancelled || !container.current) return;
        const instance = new Map(container.current, {
          center: { lat: 43.9, lng: -85.6 },
          zoom: 7,
          mapId: "DEMO_MAP_ID",
          colorScheme: google.maps.ColorScheme.DARK,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
        });
        instance.addListener("tilesloaded", () => {
          if (!cancelled) setReady(true);
        });
        setMap(instance);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
      window.removeEventListener("maps-auth-error", authError);
    };
  }, []);
  useEffect(() => {
    if (!map) return;
    const current = markers.current;
    prospects.forEach((p) => {
      const point = position(p);
      if (!point) return;
      const pin = document.createElement("span");
      pin.className = `prospect-pin ${p.priority ? "priority" : ""} ${["Won", "Lost"].includes(p.stage) ? "closed" : ""}`;
      const label = document.createElement("span");
      label.textContent = p.priority
        ? "★"
        : (p.warehouse || p.city)
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
      label.style.transform = "rotate(45deg)";
      pin.append(label);
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: point,
        title: p.company,
        content: pin,
        gmpClickable: true,
      });
      marker.addListener("click", () => callbacks.current.onSelect(p.id));
      current.set(p.id, marker);
    });
    return () => {
      current.forEach((marker) => {
        marker.map = null;
      });
      current.clear();
    };
  }, [map, prospects]);
  useEffect(() => {
    if (!map || !selected) return;
    const p = prospects.find((item) => item.id === selected);
    const marker = markers.current.get(selected);
    if (!p || !marker) return;
    const node = document.createElement("div");
    node.className = "map-prospect-popup";
    const heading = document.createElement("h2");
    heading.textContent = p.company;
    const address = document.createElement("p");
    address.textContent = p.address || `${p.city}, Michigan · sample location`;
    const details = document.createElement("p");
    details.textContent = `${p.stage} · ${p.contact} · $${p.value.toLocaleString()}`;
    const button = document.createElement("button");
    button.textContent = "View / edit prospect";
    button.onclick = () => callbacks.current.onDetails(p);
    node.append(heading, address, details, button);
    const info = new google.maps.InfoWindow({ content: node, maxWidth: 320 });
    info.open({ map, anchor: marker, shouldFocus: false });
    map.panTo(position(p)!);
    return () => info.close();
  }, [map, prospects, selected]);
  useEffect(() => {
    if (!map) return;
    const bounds = new google.maps.LatLngBounds();
    prospects.forEach((p) => {
      const point = position(p);
      if (point) bounds.extend(point);
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds, 110);
  }, [map, fit, prospects]);
  return (
    <>
      <div
        ref={container}
        className="prospect-map"
        aria-label="Google map of prospects"
        data-map-ready={ready}
      />
      {error ? (
        <div className="map-message" role="alert">
          {error}
        </div>
      ) : (
        !ready && (
          <div className="map-message" role="status">
            Loading Google Maps…
          </div>
        )
      )}
    </>
  );
}
