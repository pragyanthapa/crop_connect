"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface DeliveryMapProps {
  farmerLocation: Location;
  buyerLocation: Location;
  currentLocation?: Location | null;
}

export default function DeliveryMap({
  farmerLocation,
  buyerLocation,
  currentLocation,
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (mapRef.current && window.google) {
      initializeMap();
    }
  }, [farmerLocation, buyerLocation, currentLocation]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: { lat: farmerLocation.lat, lng: farmerLocation.lng },
      zoom: 10,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: true,
    });

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add farmer marker
    const farmerMarker = new google.maps.Marker({
      position: { lat: farmerLocation.lat, lng: farmerLocation.lng },
      map: mapInstanceRef.current,
      title: "Farmer Location",
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      },
    });

    // Add buyer marker
    const buyerMarker = new google.maps.Marker({
      position: { lat: buyerLocation.lat, lng: buyerLocation.lng },
      map: mapInstanceRef.current,
      title: "Buyer Location",
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });

    markersRef.current = [farmerMarker, buyerMarker];

    // Add current location marker if available
    if (currentLocation) {
      const currentMarker = new google.maps.Marker({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: mapInstanceRef.current,
        title: "Current Location",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
        },
      });
      markersRef.current.push(currentMarker);
    }

    // Calculate and display route
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: farmerLocation.lat, lng: farmerLocation.lng },
        destination: { lat: buyerLocation.lat, lng: buyerLocation.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);
        }
      }
    );
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
} 