'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface Report {
  lat: number;
  lng: number;
  intensity?: number;
}

interface MapProps {
  reports: Report[];
}

declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: Record<string, unknown>
  ): L.Layer;
}

export default function Map({ reports }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([35.2, 33.4], 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Update heatmap when reports change
    if (mapRef.current) {
      // Remove existing heat layer
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      // Create new heat layer with updated data
      if (reports.length > 0) {
        const heatData: Array<[number, number, number]> = reports.map(report => [
          report.lat,
          report.lng,
          report.intensity || 1
        ]);

        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
        }).addTo(mapRef.current);
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current && heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }
    };
  }, [reports]);

  return <div id="map" className="w-full h-screen" />;
}
