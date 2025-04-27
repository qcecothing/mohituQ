"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import { TrajectoryData } from "$/types/trajectory";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_LAT = 25.2048493;
const DEFAULT_LON = 55.2707828;

export type TrajectorySegment = "shore" | "offshore" | "inland";

const distance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2);

export type CombinedPoint = {
  lat: number;
  lon: number;
  segment: TrajectorySegment;
};

const getCombinedPath = (
  trajectoryData: TrajectoryData | null,
  sourceLat: number,
  sourceLon: number,
): CombinedPoint[] => {
  if (!trajectoryData) return [];
  const combinedPoints: CombinedPoint[] = [];
  const pushPoints = (
    lats: number[] | undefined,
    lons: number[] | undefined,
    segment: TrajectorySegment,
  ) => {
    if (!lats || !lons) return;
    const count = Math.min(lats.length, lons.length);
    for (let i = 0; i < count; i++) {
      if (!isNaN(lats[i]) && !isNaN(lons[i])) {
        combinedPoints.push({ lat: lats[i], lon: lons[i], segment });
      }
    }
  };

  pushPoints(
    trajectoryData.latitudes_shore,
    trajectoryData.longitudes_shore,
    "shore",
  );
  pushPoints(
    trajectoryData.latitudes_offshore,
    trajectoryData.longitudes_offshore,
    "offshore",
  );
  pushPoints(
    trajectoryData.latitudes_inland,
    trajectoryData.longitudes_inland,
    "inland",
  );

  if (combinedPoints.length === 0) return [];

  let startIndex = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < combinedPoints.length; i++) {
    const d = distance(
      sourceLat,
      sourceLon,
      combinedPoints[i].lat,
      combinedPoints[i].lon,
    );
    if (d < bestDistance) {
      bestDistance = d;
      startIndex = i;
    }
  }
  const used = Array(combinedPoints.length).fill(false);
  const route: CombinedPoint[] = [];
  route.push(combinedPoints[startIndex]);
  used[startIndex] = true;
  let current = combinedPoints[startIndex];

  for (let count = 1; count < combinedPoints.length; count++) {
    let nearestIndex = -1;
    bestDistance = Infinity;
    for (let i = 0; i < combinedPoints.length; i++) {
      if (!used[i]) {
        const d = distance(
          current.lat,
          current.lon,
          combinedPoints[i].lat,
          combinedPoints[i].lon,
        );
        if (d < bestDistance) {
          bestDistance = d;
          nearestIndex = i;
        }
      }
    }
    if (nearestIndex !== -1) {
      route.push(combinedPoints[nearestIndex]);
      used[nearestIndex] = true;
      current = combinedPoints[nearestIndex];
    }
  }
  return route;
};

const getColoredSegments = (route: CombinedPoint[]) => {
  if (!route || route.length === 0) return [];
  const segments: { segment: TrajectorySegment; points: CombinedPoint[] }[] =
    [];
  let currentSegmentPoints = [route[0]];

  for (let i = 1; i < route.length; i++) {
    if (route[i].segment === route[i - 1].segment) {
      currentSegmentPoints.push(route[i]);
    } else {
      segments.push({
        segment: route[i - 1].segment,
        points: [...currentSegmentPoints],
      });
      currentSegmentPoints = [route[i - 1], route[i]];
    }
  }
  if (currentSegmentPoints.length) {
    segments.push({
      segment: currentSegmentPoints[currentSegmentPoints.length - 1].segment,
      points: currentSegmentPoints,
    });
  }
  return segments;
};

const getPolylineColor = (sourceColor: string) => sourceColor;

interface TrajectoryPathRendererProps {
  animationFrame: number;
  combinedRoute: CombinedPoint[];
  sourceColor: string;
  shouldFollow: boolean;
}

const TrajectoryPathRenderer = ({
  animationFrame,
  combinedRoute,
  sourceColor,
  shouldFollow,
}: TrajectoryPathRendererProps) => {
  const map = useMap();
  const segments = getColoredSegments(combinedRoute);
  const currentRoute = combinedRoute.slice(
    0,
    Math.min(animationFrame + 1, combinedRoute.length),
  );

  React.useEffect(() => {
    if (shouldFollow && currentRoute.length) {
      const head = currentRoute[currentRoute.length - 1];
      map.setView([head.lat, head.lon], map.getZoom(), {
        animate: true,
      });
    }
  }, [map, currentRoute, shouldFollow]);

  return (
    <>
      {combinedRoute.length > 1 && (
        <Polyline
          positions={combinedRoute.map((pt) => [pt.lat, pt.lon])}
          color="gray"
          weight={2}
          opacity={0.3}
          dashArray="5,5"
        />
      )}
      {segments.map((seg, idx) => {
        const segPoints = seg.points.filter((pt) =>
          currentRoute.find(
            (crt) =>
              crt.lat === pt.lat &&
              crt.lon === pt.lon &&
              crt.segment === pt.segment,
          )
        );
        if (segPoints.length < 2) return null;
        return (
          <Polyline
            key={idx}
            positions={segPoints.map((pt) => [pt.lat, pt.lon])}
            color={getPolylineColor(sourceColor)}
            weight={4}
            opacity={0.8}
          />
        );
      })}
      {currentRoute.length > 0 && (
        <Marker
          position={[
            currentRoute[currentRoute.length - 1].lat,
            currentRoute[currentRoute.length - 1].lon,
          ]}
          icon={L.divIcon({
            html:
              `<div style="background-color: ${sourceColor}; border: 1px solid white; width: 10px; height: 10px; border-radius: 50%;"></div>`,
            className: "plastic-marker",
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          })}
        />
      )}
    </>
  );
};

interface Source {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
}

const TrajectoryMap: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([
    {
      id: uuidv4(),
      name: "Dubai",
      latitude: DEFAULT_LAT,
      longitude: DEFAULT_LON,
      color: "#1e88e5",
    },
  ]);

  const [trajectoryCache, setTrajectoryCache] = useState<
    Record<string, CombinedPoint[]>
  >({});

  const [loadingRoutes, setLoadingRoutes] = useState<
    Record<string, boolean>
  >({});

  const [combinedRoutes, setCombinedRoutes] = useState<{
    [sourceId: string]: CombinedPoint[];
  }>({});
  const [animationFrames, setAnimationFrames] = useState<{
    [sourceId: string]: number;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeFollowSourceId, setActiveFollowSourceId] = useState(
    sources[0].id,
  );
  const [panelOpen, setPanelOpen] = useState(false);

  const biggestCities = [
    { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
    { name: "Delhi", latitude: 28.7041, longitude: 77.1025 },
    { name: "Shanghai", latitude: 31.2304, longitude: 121.4737 },
    { name: "São Paulo", latitude: -23.5505, longitude: -46.6333 },
    { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
    { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
    { name: "Beijing", latitude: 39.9042, longitude: 116.4074 },
    { name: "Dhaka", latitude: 23.8103, longitude: 90.4125 },
    { name: "Osaka", latitude: 34.6937, longitude: 135.5023 },
    { name: "New York City", latitude: 40.7128, longitude: -74.006 },
    { name: "Karachi", latitude: 24.8607, longitude: 67.0011 },
    { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816 },
    { name: "Chongqing", latitude: 29.4316, longitude: 106.9123 },
    { name: "Istanbul", latitude: 41.0082, longitude: 28.9784 },
    { name: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
    { name: "Manila", latitude: 14.5995, longitude: 120.9842 },
    { name: "Lagos", latitude: 6.5244, longitude: 3.3792 },
    { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729 },
    { name: "Tianjin", latitude: 39.3434, longitude: 117.3616 },
    { name: "Kinshasa", latitude: -4.4419, longitude: 15.2663 },
    { name: "Guangzhou", latitude: 23.1291, longitude: 113.2644 },
    { name: "Lima", latitude: -12.0464, longitude: -77.0428 },
    { name: "Bangkok", latitude: 13.7563, longitude: 100.5018 },
    { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
    { name: "Hyderabad", latitude: 17.385, longitude: 78.4867 },
    { name: "Wuhan", latitude: 30.5928, longitude: 114.3055 },
    { name: "Hangzhou", latitude: 30.2741, longitude: 120.1551 },
    { name: "Ahmedabad", latitude: 23.0225, longitude: 72.5714 },
    { name: "Kuala Lumpur", latitude: 3.139, longitude: 101.6869 },
  ];

  const [selectedCity, setSelectedCity] = useState(biggestCities[0].name);

  const mapRef = useRef<L.Map | null>(null);

  const fetchTrajectoryForSource = async (src: Source) => {
    const coordKey = `${src.latitude},${src.longitude}`;

    if (trajectoryCache[coordKey]) {
      return trajectoryCache[coordKey];
    }

    setLoadingRoutes((prev) => ({ ...prev, [src.id]: true }));
    try {
      const response = await fetch(
        `https://tracker.toc.yt/api/trash_trajectory?longitude=${src.longitude}&latitude=${src.latitude}`,
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data: TrajectoryData = await response.json();

      const route = getCombinedPath(data, src.latitude, src.longitude);

      setTrajectoryCache((prev) => ({
        ...prev,
        [coordKey]: route,
      }));
      return route;
    } catch (err: any) {
      setError(err.message || "Failed to fetch trajectory data");
      return [];
    } finally {
      setLoadingRoutes((prev) => ({ ...prev, [src.id]: false }));
    }
  };

  const fetchAllTrajectories = async () => {
    setError(null);
    const newCombinedRoutes: { [sourceId: string]: CombinedPoint[] } = {};
    await Promise.all(
      sources.map(async (src) => {
        const route = await fetchTrajectoryForSource(src);
        newCombinedRoutes[src.id] = route;
      }),
    );
    setCombinedRoutes(newCombinedRoutes);

    const initialFrames: { [sourceId: string]: number } = {};
    sources.forEach((src) => {
      initialFrames[src.id] = 0;
    });
    setAnimationFrames(initialFrames);
  };

  useEffect(() => {
    fetchAllTrajectories();
  }, []);

  const animateAll = useCallback(() => {
    const intervalId = setInterval(() => {
      setAnimationFrames((prevFrames) => {
        const newFrames = { ...prevFrames };
        let animationActive = false;
        for (const src of sources) {
          const route = combinedRoutes[src.id];
          if (route && newFrames[src.id] < route.length - 1) {
            newFrames[src.id] += 1;
            animationActive = true;
          }
        }
        if (!animationActive) {
          clearInterval(intervalId);
          setTimeout(() => {
            setIsAnimating(false);
          }, 500);
        }
        return newFrames;
      });
    }, 50);
    return () => clearInterval(intervalId);
  }, [sources, combinedRoutes]);

  useEffect(() => {
    if (isAnimating) {
      const cleanup = animateAll();
      return cleanup;
    }
  }, [isAnimating, animateAll]);

  const toggleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      if (
        sources.every(
          (src) =>
            !combinedRoutes[src.id] || combinedRoutes[src.id].length <= 1,
        )
      ) {
        alert(
          "Not enough points to animate trajectory for one or more sources",
        );
        return;
      }
      setIsAnimating(true);
    }
  };

  const centerMap = () => {
    if (!mapRef.current) return;
    const source = sources.find(
      (s) => s.id === activeFollowSourceId,
    );
    if (!source) return;

    const route = combinedRoutes[source.id];
    const currentFrame = animationFrames[source.id] || 0;
    let lat = source.latitude;
    let lon = source.longitude;
    if (route && route.length > 0 && currentFrame < route.length) {
      const currentRoute = route.slice(0, currentFrame + 1);
      const head = currentRoute[currentRoute.length - 1];
      lat = head.lat;
      lon = head.lon;
    }
    mapRef.current.setView([lat, lon], mapRef.current.getZoom(), {
      animate: true,
    });
  };

  const addSource = (src?: Partial<Source>) => {
    const newSource: Source = {
      id: uuidv4(),
      name: src?.name || `Source ${sources.length + 1}`,
      latitude: src?.latitude !== undefined ? src.latitude : DEFAULT_LAT,
      longitude: src?.longitude !== undefined ? src.longitude : DEFAULT_LON,
      color: src?.color ||
        [
          "#3498db",
          "#2ecc71",
          "#f39c12",
          "#e74c3c",
          "#9b59b6",
          "#1abc9c",
          "#f1c40f",
          "#d35400",
          "#8e44ad",
          "#16a085",
        ][sources.length % 10],
    };
    setSources((prev) => [...prev, newSource]);

    fetchTrajectoryForSource(newSource).then((route) => {
      setCombinedRoutes((prev) => ({
        ...prev,
        [newSource.id]: route,
      }));
      setAnimationFrames((prev) => ({
        ...prev,
        [newSource.id]: 0,
      }));
    });
  };

  const updateSource = (
    id: string,
    key: keyof Source,
    value: string | number,
  ) => {
    const updated = sources.map((src) =>
      src.id === id ? { ...src, [key]: value } : src
    );
    setSources(updated);
  };

  const removeSource = (id: string) => {
    if (sources.length <= 1) {
      alert("You must have at least one source");
      return;
    }
    const filtered = sources.filter((src) => src.id !== id);
    setSources(filtered);
    const newRoutes = { ...combinedRoutes };
    delete newRoutes[id];
    setCombinedRoutes(newRoutes);
    const newAnimFrames = { ...animationFrames };
    delete newAnimFrames[id];
    setAnimationFrames(newAnimFrames);
    if (activeFollowSourceId === id && filtered.length) {
      setActiveFollowSourceId(filtered[0].id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50">
      <div
        className="bg-white shadow-sm transition-all duration-300 overflow-y-scroll"
        style={{
          height: panelOpen ? "auto" : "0",
          maxHeight: panelOpen ? "60vh" : "0",
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-slate-800">
              Manage Sources
            </h3>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.293 5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={src.name}
                      onChange={(e) =>
                        updateSource(src.id, "name", e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={src.latitude}
                        onChange={(e) =>
                          updateSource(
                            src.id,
                            "latitude",
                            parseFloat(e.target.value),
                          )}
                        className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={src.longitude}
                        onChange={(e) =>
                          updateSource(
                            src.id,
                            "longitude",
                            parseFloat(e.target.value),
                          )}
                        className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-slate-600">
                        Color
                      </label>
                      <div className="w-8 h-8 border rounded overflow-hidden">
                        <input
                          type="color"
                          value={src.color}
                          onChange={(e) =>
                            updateSource(src.id, "color", e.target.value)}
                          className="w-10 h-10 transform -translate-x-1 -translate-y-1 cursor-pointer"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeSource(src.id)}
                      className="px-3 py-1 bg-rose-500 text-white rounded-md text-sm hover:bg-rose-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-neutral-200 rounded-lg flex flex-col justify-center items-center p-4">
              <button
                onClick={() => addSource()}
                className="w-full py-4 text-black text-sm hover:bg-neutral-300 transition-colors flex flex-col items-center justify-center rounded-lg mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mb-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Source Manually
              </button>

              <div className="flex flex-col items-center space-y-2">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="p-2 border border-slate-300 rounded text-sm"
                >
                  {biggestCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const city = biggestCities.find(
                      (c) => c.name === selectedCity,
                    );
                    if (city) {
                      addSource({
                        name: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude,
                      });
                    }
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                >
                  Add City Source
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 shadow-sm border-b border-slate-200">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            {panelOpen
              ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )
              : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center p-3 bg-white border-b border-slate-200 w-full">
        <div className="bg-white rounded-lg shadow-md p-3 flex items-center justify-between w-full">
          <select
            value={activeFollowSourceId}
            onChange={(e) => setActiveFollowSourceId(e.target.value)}
            className="p-2 border border-slate-300 rounded text-sm"
          >
            {sources.map((src) => (
              <option key={src.id} value={src.id}>
                {src.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <button
              onClick={centerMap}
              className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none"
              title="Center on Followed Source"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C8.13401 2 5 5.13401 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86599-3.13401-7-7-7zm0 9a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </button>

            <button
              onClick={fetchAllTrajectories}
              className="p-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 focus:outline-none"
              title="Update Trajectories"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={toggleAnimation}
              className={`p-2 rounded-md focus:outline-none ${
                isAnimating
                  ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
              title={isAnimating ? "Pause" : "Run Animation"}
            >
              {isAnimating
                ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )
                : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="h-full w-full">
          <MapContainer
            center={[DEFAULT_LAT, DEFAULT_LON]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sources.map((src) => {
              const route = combinedRoutes[src.id];
              const shouldFollow = activeFollowSourceId === src.id;
              return (
                <React.Fragment key={src.id}>
                  {loadingRoutes[src.id]
                    ? (
                      <Marker
                        position={[src.latitude, src.longitude]}
                        icon={L.divIcon({
                          html:
                            `<div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-indigo-600"></div>`,
                          className: "",
                          iconSize: [32, 32],
                          iconAnchor: [16, 16],
                        })}
                      />
                    )
                    : (
                      route &&
                      route.length > 0 && (
                        <TrajectoryPathRenderer
                          animationFrame={animationFrames[src.id] || 0}
                          combinedRoute={route}
                          sourceColor={src.color}
                          shouldFollow={shouldFollow}
                        />
                      )
                    )}
                  <Marker
                    position={[src.latitude, src.longitude]}
                    icon={icon}
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryMap;
