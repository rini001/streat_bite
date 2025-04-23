import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MapMarker, Vendor } from '@/types';
import { colors } from '@/components/styled';
import { calculateDistance } from '@/lib/utils';

interface MapViewProps {
  vendors: Vendor[];
  userLocation?: { lat: number; lng: number };
  onVendorSelect: (vendorId: string) => void;
  selectedVendorId?: string;
}

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: ${colors.neutral[200]};
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  z-index: 10;
`;

const SearchBar = styled.div`
  background-color: ${colors.white};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  width: 100%;
  max-width: 30rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.75rem 0;
  outline: none;
  font-size: 0.875rem;
`;

const SearchButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 9999px;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const MapControls = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
`;

const MapControlButton = styled.button`
  width: 2rem;
  height: 2rem;
  background-color: ${colors.white};
  border: none;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.neutral[700]};
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${colors.neutral[100]};
    color: ${colors.primary};
  }
`;

const MockMap = styled.div`
  background-image: url('https://images.unsplash.com/photo-1545211510-e88924995047?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const VendorMarker = styled.div<{ selected: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${props => props.selected ? colors.secondary : colors.primary};
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const UserLocationMarker = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  
  .inner-dot {
    width: 1rem;
    height: 1rem;
    background-color: #4285F4;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  
  .outer-circle {
    width: 3rem;
    height: 3rem;
    background-color: rgba(66, 133, 244, 0.2);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    70% {
      transform: scale(1.2);
      opacity: 0;
    }
    100% {
      transform: scale(0.8);
      opacity: 0;
    }
  }
`;

const MapView: React.FC<MapViewProps> = ({ 
  vendors, 
  userLocation, 
  onVendorSelect,
  selectedVendorId 
}) => {
  const [searchText, setSearchText] = useState("");
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [zoom, setZoom] = useState(15);
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Calculate marker positions (in a real app, these would be actual map coordinates)
  useEffect(() => {
    const markers = vendors.map(vendor => {
      const location = vendor.locations[0].coordinates;
      return {
        id: vendor.id,
        lat: location.lat,
        lng: location.lng,
        name: vendor.businessName
      };
    });
    setMapMarkers(markers);
  }, [vendors]);
  
  // This is a mock implementation for the demo
  // In a real app, this would use a mapping library like Google Maps or Mapbox
  const mockPositionToPixels = (marker: MapMarker) => {
    if (!mapRef.current || !userLocation) return { top: "50%", left: "50%" };
    
    // Get the map dimensions
    const mapWidth = mapRef.current.offsetWidth;
    const mapHeight = mapRef.current.offsetHeight;
    
    // Calculate the relative position based on lat/lng differences
    // This is just a visual approximation for the mock
    const latDiff = marker.lat - userLocation.lat;
    const lngDiff = marker.lng - userLocation.lng;
    
    // Scale factors to fit within view
    const latScale = 2000 * (zoom / 15);
    const lngScale = 2000 * (zoom / 15);
    
    // Calculate position as percentage of map size
    const top = 50 + (latDiff * latScale);
    const left = 50 + (lngDiff * lngScale);
    
    // Ensure the marker stays within the visible area
    const clampedTop = Math.max(10, Math.min(90, top));
    const clampedLeft = Math.max(10, Math.min(90, left));
    
    return {
      top: `${clampedTop}%`,
      left: `${clampedLeft}%`,
    };
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the map location based on search
    console.log("Searching for:", searchText);
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 20));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 10));
  };
  
  const handleResetLocation = () => {
    // In a real app, this would reset the map to the user's location
    console.log("Resetting location");
  };
  
  return (
    <MapContainer>
      <MapOverlay>
        <SearchBar>
          <i className="fas fa-search text-neutral-500 mr-3"></i>
          <SearchInput 
            type="text" 
            placeholder="Search for location or food type" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>
            Search
          </SearchButton>
        </SearchBar>
      </MapOverlay>
      
      <MockMap ref={mapRef}>
        {userLocation && (
          <UserLocationMarker
            style={{
              top: "50%",
              left: "50%",
            }}
          >
            <div className="outer-circle"></div>
            <div className="inner-dot"></div>
          </UserLocationMarker>
        )}
        
        {mapMarkers.map((marker) => (
          <VendorMarker
            key={marker.id}
            style={mockPositionToPixels(marker)}
            onClick={() => onVendorSelect(marker.id)}
            selected={marker.id === selectedVendorId}
            title={marker.name}
          >
            <i className="fas fa-utensils"></i>
          </VendorMarker>
        ))}
      </MockMap>
      
      <MapControls>
        <MapControlButton onClick={handleZoomIn} aria-label="Zoom in">
          <i className="fas fa-plus"></i>
        </MapControlButton>
        <MapControlButton onClick={handleZoomOut} aria-label="Zoom out">
          <i className="fas fa-minus"></i>
        </MapControlButton>
        <MapControlButton onClick={handleResetLocation} aria-label="Reset to my location">
          <i className="fas fa-location-arrow"></i>
        </MapControlButton>
      </MapControls>
    </MapContainer>
  );
};

export default MapView;
