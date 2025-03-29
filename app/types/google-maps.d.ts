declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  interface MapOptions {
    center: LatLngLiteral;
    zoom: number;
    styles?: MapTypeStyle[];
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: { [key: string]: any }[];
  }

  class Map {
    constructor(element: HTMLElement, options: MapOptions);
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  interface MarkerOptions {
    position: LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: {
      url: string;
    };
  }

  class DirectionsRenderer {
    constructor(options: DirectionsRendererOptions);
    setMap(map: Map | null): void;
    setDirections(directions: DirectionsResult): void;
  }

  interface DirectionsRendererOptions {
    map?: Map;
    suppressMarkers?: boolean;
  }

  class DirectionsService {
    route(
      request: DirectionsRequest,
      callback: (result: DirectionsResult, status: DirectionsStatus) => void
    ): void;
  }

  interface DirectionsRequest {
    origin: LatLngLiteral;
    destination: LatLngLiteral;
    travelMode: TravelMode;
  }

  interface DirectionsResult {
    routes: DirectionsRoute[];
  }

  interface DirectionsRoute {
    legs: DirectionsLeg[];
  }

  interface DirectionsLeg {
    steps: DirectionsStep[];
  }

  interface DirectionsStep {
    polyline: {
      points: string;
    };
  }

  type DirectionsStatus = "OK" | "NOT_FOUND" | "ZERO_RESULTS" | "MAX_ROUTE_LENGTH_EXCEEDED" | "MAX_WAYPOINTS_EXCEEDED" | "INVALID_REQUEST" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR";

  enum TravelMode {
    DRIVING = "DRIVING",
    BICYCLING = "BICYCLING",
    TRANSIT = "TRANSIT",
    WALKING = "WALKING"
  }
} 