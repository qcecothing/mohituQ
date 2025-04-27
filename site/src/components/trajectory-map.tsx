"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
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

const DEFAULT_LAT = 24.4539;
const DEFAULT_LON = 54.3773;
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;
const SAMPLING_RATE = 3;

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

const downsamplePoints = (
  points: CombinedPoint[],
  samplingRate: number,
): CombinedPoint[] => {
  if (!points || points.length <= 2 || samplingRate <= 1) return points;

  const result: CombinedPoint[] = [];

  if (points.length > 0) {
    result.push(points[0]);
  }

  for (let i = samplingRate; i < points.length - 1; i += samplingRate) {
    result.push(points[i]);
  }

  if (points.length > 1) {
    result.push(points[points.length - 1]);
  }

  return result;
};

const getCombinedPath = (
  trajectoryData: TrajectoryData | null,
  sourceLat: number,
  sourceLon: number,
): CombinedPoint[] => {
  if (!trajectoryData) return [];

  const shorePoints: CombinedPoint[] = [];
  const offshorePoints: CombinedPoint[] = [];
  const inlandPoints: CombinedPoint[] = [];

  const createOrderedPoints = (
    lats: number[] | undefined,
    lons: number[] | undefined,
    segment: TrajectorySegment,
    pointsArray: CombinedPoint[],
  ) => {
    if (!lats || !lons) return;
    const count = Math.min(lats.length, lons.length);
    for (let i = 0; i < count; i++) {
      if (!isNaN(lats[i]) && !isNaN(lons[i])) {
        pointsArray.push({ lat: lats[i], lon: lons[i], segment });
      }
    }
  };

  createOrderedPoints(
    trajectoryData.latitudes_shore,
    trajectoryData.longitudes_shore,
    "shore",
    shorePoints,
  );

  createOrderedPoints(
    trajectoryData.latitudes_offshore,
    trajectoryData.longitudes_offshore,
    "offshore",
    offshorePoints,
  );

  createOrderedPoints(
    trajectoryData.latitudes_inland,
    trajectoryData.longitudes_inland,
    "inland",
    inlandPoints,
  );

  if (
    shorePoints.length === 0 && offshorePoints.length === 0 &&
    inlandPoints.length === 0
  ) {
    return [];
  }

  const segments = [
    { points: shorePoints, name: "shore" },
    { points: offshorePoints, name: "offshore" },
    { points: inlandPoints, name: "inland" },
  ].filter((segment) => segment.points.length > 0);

  if (segments.length === 1) {
    return segments[0].points;
  }

  let closestSegmentIndex = 0;
  let closestPointDistance = Infinity;
  let closestPointIsEnd = false;

  segments.forEach((segment, segmentIndex) => {
    const firstPoint = segment.points[0];
    const firstDistance = distance(
      sourceLat,
      sourceLon,
      firstPoint.lat,
      firstPoint.lon,
    );

    const lastPoint = segment.points[segment.points.length - 1];
    const lastDistance = distance(
      sourceLat,
      sourceLon,
      lastPoint.lat,
      lastPoint.lon,
    );

    if (firstDistance < closestPointDistance) {
      closestPointDistance = firstDistance;
      closestSegmentIndex = segmentIndex;
      closestPointIsEnd = false;
    }

    if (lastDistance < closestPointDistance) {
      closestPointDistance = lastDistance;
      closestSegmentIndex = segmentIndex;
      closestPointIsEnd = true;
    }
  });

  const result: CombinedPoint[] = [];
  const usedSegments = new Array(segments.length).fill(false);

  if (closestPointIsEnd) {
    result.push(...segments[closestSegmentIndex].points.slice().reverse());
  } else {
    result.push(...segments[closestSegmentIndex].points);
  }

  usedSegments[closestSegmentIndex] = true;

  while (usedSegments.some((used) => !used)) {
    const lastPoint = result[result.length - 1];
    let bestSegmentIndex = -1;
    let bestDistance = Infinity;
    let shouldReverse = false;

    for (let i = 0; i < segments.length; i++) {
      if (usedSegments[i]) continue;

      const firstPoint = segments[i].points[0];
      const firstDistance = distance(
        lastPoint.lat,
        lastPoint.lon,
        firstPoint.lat,
        firstPoint.lon,
      );

      const lastPoint2 = segments[i].points[segments[i].points.length - 1];
      const lastDistance = distance(
        lastPoint.lat,
        lastPoint.lon,
        lastPoint2.lat,
        lastPoint2.lon,
      );

      if (firstDistance < bestDistance) {
        bestDistance = firstDistance;
        bestSegmentIndex = i;
        shouldReverse = false;
      }

      if (lastDistance < bestDistance) {
        bestDistance = lastDistance;
        bestSegmentIndex = i;
        shouldReverse = true;
      }
    }

    if (bestSegmentIndex !== -1) {
      if (shouldReverse) {
        result.push(...segments[bestSegmentIndex].points.slice().reverse());
      } else {
        result.push(...segments[bestSegmentIndex].points);
      }
      usedSegments[bestSegmentIndex] = true;
    } else {
      break;
    }
  }

  return result;
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
  downsampledRoute: CombinedPoint[];
  sourceColor: string;
  shouldFollow: boolean;
}

const TrajectoryPathRenderer = ({
  animationFrame,
  combinedRoute,
  downsampledRoute,
  sourceColor,
  shouldFollow,
}: TrajectoryPathRendererProps) => {
  const map = useMap();
  const segments = getColoredSegments(downsampledRoute);

  const scaledFrame = Math.min(
    Math.floor(
      animationFrame * (downsampledRoute.length / combinedRoute.length),
    ),
    downsampledRoute.length - 1,
  );

  const currentRoute = downsampledRoute.slice(
    0,
    Math.min(scaledFrame + 1, downsampledRoute.length),
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
      {
        /* {downsampledRoute.length > 1 && (
        <Polyline
          positions={downsampledRoute.map((pt) => [pt.lat, pt.lon])}
          color="gray"
          weight={2}
          opacity={0}
          dashArray="5,5"
        />
      )} */
      }
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

const storeCachedTrajectory = (key: string, data: CombinedPoint[]) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn("Failed to cache trajectory data in localStorage:", error);
  }
};

const getCachedTrajectory = (key: string): CombinedPoint[] | null => {
  try {
    const cacheItem = localStorage.getItem(key);
    if (!cacheItem) return null;

    const { data, timestamp } = JSON.parse(cacheItem);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY_TIME;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Error retrieving cached trajectory:", error);
    return null;
  }
};

const TrajectoryMap: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([
    {
      id: uuidv4(),
      name: "Abu Dhabi",
      latitude: DEFAULT_LAT,
      longitude: DEFAULT_LON,
      color: "#007bff",
    },
    {
      id: uuidv4(),
      name: "Dubai",
      latitude: 25.2048,
      longitude: 55.2708,
      color: "#dc3545",
    },
    {
      id: uuidv4(),
      name: "Doha",
      latitude: 25.276987,
      longitude: 51.520008,
      color: "#6610f2",
    },
    {
      id: uuidv4(),
      name: "Muscat",
      latitude: 23.5880,
      longitude: 58.3829,
      color: "#fd7e14",
    },
    {
      id: uuidv4(),
      name: "Fujairah",
      latitude: 25.1288,
      longitude: 56.3265,
      color: "#e83e8c",
    },
  ]);

  const [trajectoryCache, setTrajectoryCache] = useState<
    Record<string, CombinedPoint[]>
  >({});

  const [downsampledRoutes, setDownsampledRoutes] = useState<{
    [sourceId: string]: CombinedPoint[];
  }>({});

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
  const [samplingRate, setSamplingRate] = useState(SAMPLING_RATE);

  const cityCoords = [
    { name: "Abu Dhabi", latitude: 24.4539, longitude: 54.3773 },
    { name: "Dubai", latitude: 25.2048, longitude: 55.2708 },
    { name: "Doha", latitude: 25.2854, longitude: 51.5310 },
    { name: "Manama", latitude: 26.2285, longitude: 50.5860 },
    { name: "Kuwait City", latitude: 29.3759, longitude: 47.9774 },
    { name: "Muscat", latitude: 23.5880, longitude: 58.3829 },
    { name: "Fujairah", latitude: 25.1288, longitude: 56.3265 },
    { name: "Ras Al Khaimah", latitude: 25.7895, longitude: 55.9432 },
    { name: "Jeddah", latitude: 21.4858, longitude: 39.1925 },
    { name: "Aqaba", latitude: 29.5266, longitude: 35.0078 },
    { name: "Beirut", latitude: 33.8938, longitude: 35.5018 },
    { name: "Alexandria", latitude: 31.2001, longitude: 29.9187 },
    { name: "Port Said", latitude: 31.2565, longitude: 32.2841 },
    { name: "Istanbul", latitude: 41.0082, longitude: 28.9784 },
    { name: "Antalya", latitude: 36.8969, longitude: 30.7133 },
    { name: "Aden", latitude: 12.7797, longitude: 45.0095 },
    { name: "Dammam", latitude: 26.4344, longitude: 50.1033 },
    { name: "Basra", latitude: 30.5085, longitude: 47.7804 },
    { name: "Latakia", latitude: 35.5384, longitude: 35.7959 },
    { name: "Madrid", latitude: 40.4168, longitude: -3.7038 },
    { name: "Barcelona", latitude: 41.3851, longitude: 2.1734 },
    { name: "Marseille", latitude: 43.2965, longitude: 5.3698 },
    { name: "New York City", latitude: 40.7128, longitude: -74.0060 },
    { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
    { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729 },
    { name: "Lisbon", latitude: 38.7223, longitude: -9.1393 },
    { name: "Singapore", latitude: 1.3521, longitude: 103.8198 },
    { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
    { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  ];

  const [selectedCity, setSelectedCity] = useState(cityCoords[0].name);

  const mapRef = useRef<L.Map | null>(null);

  const fetchTrajectoryForSource = async (src: Source) => {
    const coordKey = `${src.latitude},${src.longitude}`;
    const localStorageKey = `trajectory_${coordKey}`;

    if (trajectoryCache[coordKey]) {
      return trajectoryCache[coordKey];
    }

    const cachedData = getCachedTrajectory(localStorageKey);
    if (cachedData) {
      console.log(
        `Retrieved trajectory from localStorage cache for ${src.name}`,
      );
      setTrajectoryCache((prev) => ({
        ...prev,
        [coordKey]: cachedData,
      }));
      return cachedData;
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

      console.log(`Caching trajectory data for ${src.name} in localStorage`);
      storeCachedTrajectory(localStorageKey, route);

      console.log(
        `Fetched and cached new trajectory data for ${src.name} (${route.length} points)`,
      );
      return route;
    } catch (err: any) {
      setError(err.message || "Failed to fetch trajectory data");
      return [];
    } finally {
      setLoadingRoutes((prev) => ({ ...prev, [src.id]: false }));
    }
  };

  useEffect(() => {
    const newDownsampledRoutes: { [sourceId: string]: CombinedPoint[] } = {};

    Object.entries(combinedRoutes).forEach(([sourceId, route]) => {
      newDownsampledRoutes[sourceId] = downsamplePoints(route, samplingRate);
    });

    setDownsampledRoutes(newDownsampledRoutes);
  }, [combinedRoutes, samplingRate]);

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
    });
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

  const clearAllCaches = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("trajectory_")) {
        localStorage.removeItem(key);
      }
    }

    setTrajectoryCache({});

    alert("All trajectory caches cleared");
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
            <div className="flex space-x-2">
              <button
                onClick={clearAllCaches}
                className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
              >
                Clear Cache
              </button>
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
                  {cityCoords.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const city = cityCoords.find(
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
              const downsampledRoute = downsampledRoutes[src.id] || [];
              const shouldFollow = activeFollowSourceId === src.id;

              const totalPoints = route?.length || 0;
              const sampledPoints = downsampledRoute?.length || 0;
              const pointsInfo = totalPoints > 0
                ? `${sampledPoints}/${totalPoints} points (${
                  Math.round((sampledPoints / totalPoints) * 100)
                }%)`
                : "No data";

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
                      route.length > 0 && downsampledRoute &&
                      downsampledRoute.length > 0 && (
                        <TrajectoryPathRenderer
                          animationFrame={animationFrames[src.id] || 0}
                          combinedRoute={route}
                          downsampledRoute={downsampledRoute}
                          sourceColor={src.color}
                          shouldFollow={shouldFollow}
                        />
                      )
                    )}
                  <Marker
                    position={[src.latitude, src.longitude]}
                    icon={icon}
                  >
                    <Tooltip direction="top">
                      <span>{src.name}: {pointsInfo}</span>
                    </Tooltip>
                  </Marker>
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
