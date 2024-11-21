"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapControls } from "./site-map/map-controls";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleMaps } from "@/contexts/google-maps-context";

const libraries: ("places" | "drawing")[] = ["places", "drawing"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.375rem", // This matches the rounded-md class
};

const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278,
};

const defaultMapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  zoomControl: false,
  scrollwheel: true,
  gestureHandling: "greedy",
};

interface SiteMapProps {
  onLocationSelect: (location: google.maps.LatLngLiteral | null, address: string) => void;
  onPolygonComplete: (path: google.maps.LatLngLiteral[]) => void;
  selectedLocation: google.maps.LatLngLiteral | null;
  polygonPath: google.maps.LatLngLiteral[];
}

type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain' | 'OS';

export function SiteMap({
  onLocationSelect,
  onPolygonComplete,
  selectedLocation,
  polygonPath,
}: SiteMapProps) {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>(null);
  const [mapType, setMapType] = useState<MapTypeId>('roadmap');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isEditing, setIsEditing] = useState(false);
  const osMapLayer = useRef<google.maps.ImageMapType | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'gb' },
    },
    debounce: 300,
    cache: 86400,
    initOnMount: isLoaded,
  });

  useEffect(() => {
    if (window.google) {
      geocoder.current = new google.maps.Geocoder();
    }
  }, []);

  const updateLocationInfo = async (latLng: google.maps.LatLngLiteral) => {
    if (geocoder.current) {
      try {
        const response = await geocoder.current.geocode({ location: latLng });
        if (response.results[0]) {
          const address = response.results[0].formatted_address;
          setSearchValue(address, false);
          onLocationSelect(latLng, address);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }
  };

  const handleSearchSelect = async (description: string) => {
    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      const location = { lat, lng };
      onLocationSelect(location, description);
      setSearchValue(description, false);
      clearSuggestions();
      
      if (map) {
        map.panTo(location);
        map.setZoom(16);
      }
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  const handleSearchClear = () => {
    setSearchValue("", false);
    clearSuggestions();
    onLocationSelect(null, "");
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      updateLocationInfo(latLng);
    }
  };

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    const osMapType = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return `https://api.os.uk/maps/raster/v1/zxy/Road_3857/${zoom}/${coord.x}/${coord.y}.png?key=${process.env.NEXT_PUBLIC_OS_MAPS_API_KEY}`;
      },
      tileSize: new google.maps.Size(256, 256),
      maxZoom: 18,
      minZoom: 0,
      name: "OS",
    });

    map.mapTypes.set("OS", osMapType);
    osMapLayer.current = osMapType;
  }, []);

  const handleMapTypeChange = (type: MapTypeId) => {
    setMapType(type);
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleZoomChange = (action: 'in' | 'out') => {
    if (map) {
      const currentZoom = map.getZoom() || zoomLevel;
      const newZoom = action === 'in' ? currentZoom + 1 : currentZoom - 1;
      map.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const toggleDrawingMode = () => {
    setDrawingMode((current) => current === google.maps.drawing.OverlayType.POLYGON ? null : google.maps.drawing.OverlayType.POLYGON);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setDrawingMode(null);
  };

  const clearPolygon = () => {
    onPolygonComplete([]);
    setDrawingMode(null);
    setIsEditing(false);
  };

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const coordinates: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({ lat: point.lat(), lng: point.lng() });
    }
    onPolygonComplete(coordinates);
    setDrawingMode(null);
  };

  const onPolygonLoad = (polygon: google.maps.Polygon) => {
    polygonRef.current = polygon;
  };

  const handlePolygonChange = () => {
    if (polygonRef.current) {
      const path = polygonRef.current.getPath();
      const coordinates: google.maps.LatLngLiteral[] = [];
      
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push({ lat: point.lat(), lng: point.lng() });
      }
      
      onPolygonComplete(coordinates);
    }
  };

  useEffect(() => {
    if (map) {
      map.addListener('zoom_changed', () => {
        setZoomLevel(map.getZoom() || zoomLevel);
      });
    }
  }, [map, zoomLevel]);

  if (!isLoaded) {
    return (
      <Card className="h-full rounded-md flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </Card>
    );
  }

  return (
    <Card className="h-full relative rounded-md overflow-hidden">
      <div className="absolute top-4 left-4 right-20 z-10">
        <div className="relative">
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (!e.target.value) {
                  handleSearchClear();
                }
              }}
              placeholder="Search for a location..."
              className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg border-2 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
                onClick={handleSearchClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          {status === "OK" && (
            <ul className="absolute z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
              {data.map(({ place_id, description }) => (
                <li
                  key={place_id}
                  onClick={() => handleSearchSelect(description)}
                  className="px-4 py-1.5 hover:bg-muted cursor-pointer text-sm"
                >
                  {description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="h-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoomLevel}
          center={selectedLocation || defaultCenter}
          onLoad={handleMapLoad}
          options={defaultMapOptions}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}

          {polygonPath.length > 0 && (
            <Polygon
              onLoad={onPolygonLoad}
              paths={polygonPath}
              options={{
                fillColor: "#F09C00",
                fillOpacity: 0.3,
                strokeColor: "#F09C00",
                strokeWeight: 2,
                editable: isEditing,
                draggable: isEditing,
              }}
              onMouseUp={handlePolygonChange}
              onDragEnd={handlePolygonChange}
            />
          )}

          <DrawingManager
            onPolygonComplete={handlePolygonComplete}
            options={{
              drawingMode: drawingMode,
              drawingControl: false,
              polygonOptions: {
                fillColor: "#F09C00",
                fillOpacity: 0.3,
                strokeColor: "#F09C00",
                strokeWeight: 2,
                clickable: true,
                editable: true,
                zIndex: 1,
              },
            }}
          />

          <MapControls
            mapType={mapType}
            zoomLevel={zoomLevel}
            drawingMode={drawingMode}
            hasPolygon={polygonPath.length > 0}
            isEditing={isEditing}
            onMapTypeChange={handleMapTypeChange}
            onZoomChange={handleZoomChange}
            onDrawingModeToggle={toggleDrawingMode}
            onClearPolygon={clearPolygon}
            onToggleEdit={toggleEdit}
          />
        </GoogleMap>
      </div>
    </Card>
  );
}