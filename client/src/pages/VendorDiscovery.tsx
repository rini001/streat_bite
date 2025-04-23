import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Grid, Flex, colors } from '@/components/styled';
import { Vendor, FilterOptions, ViewMode, CuisineType } from '@/types';
import VendorCard from '@/components/vendor/VendorCard';
import MapView from '@/components/maps/MapView';
import { useAuth } from '@/context/AuthContext';
import useGeolocation from '@/hooks/useGeolocation';
import mockVendors from '@/mock/mockVendors';
import { calculateDistance } from '@/lib/utils';

// Styled components for the page
const FilterSidebar = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: ${colors.neutral[700]};
  margin-bottom: 0.75rem;
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: ${colors.white};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: ${({ active }) => active ? colors.primary : colors.white};
  color: ${({ active }) => active ? colors.white : colors.neutral[700]};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${({ active }) => active ? colors.primary : colors.neutral[200]};
  }
  
  &:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }
  
  &:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.neutral[300]};
  border-radius: 0.5rem;
  font-family: 'Open Sans', sans-serif;
  outline: none;
  
  &:focus {
    border-color: ${colors.primary};
  }
`;

const VendorDiscovery: React.FC = () => {
  const { location: userLocation, loading: locationLoading } = useGeolocation();
  const { isAuthenticated, isVendorSaved, toggleSavedVendor } = useAuth();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(undefined);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendorDistances, setVendorDistances] = useState<{ [key: string]: number }>({});
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    distance: 10,
    cuisineTypes: [],
    priceRange: [],
    openNow: false,
  });
  
  // Initialize vendors from mock data
  useEffect(() => {
    setVendors(mockVendors);
    setFilteredVendors(mockVendors);
  }, []);
  
  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation && vendors.length > 0) {
      const distances: { [key: string]: number } = {};
      
      vendors.forEach(vendor => {
        const vendorLocation = vendor.locations[0].coordinates;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          vendorLocation.lat,
          vendorLocation.lng
        );
        distances[vendor.id] = distance;
      });
      
      setVendorDistances(distances);
    }
  }, [userLocation, vendors]);
  
  // Apply filters when filter options or vendors change
  useEffect(() => {
    if (vendors.length === 0) return;
    
    let filtered = [...vendors];
    
    // Apply search filter
    if (filterOptions.search) {
      const searchLower = filterOptions.search.toLowerCase();
      filtered = filtered.filter(vendor => 
        vendor.businessName.toLowerCase().includes(searchLower) ||
        vendor.cuisineType.toLowerCase().includes(searchLower) ||
        vendor.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply distance filter
    if (filterOptions.distance && userLocation && Object.keys(vendorDistances).length > 0) {
      filtered = filtered.filter(vendor => 
        vendorDistances[vendor.id] <= filterOptions.distance
      );
    }
    
    // Apply cuisine type filter
    if (filterOptions.cuisineTypes.length > 0) {
      filtered = filtered.filter(vendor => 
        filterOptions.cuisineTypes.includes(vendor.cuisineType)
      );
    }
    
    // Apply open now filter
    if (filterOptions.openNow) {
      filtered = filtered.filter(vendor => vendor.isOpen);
    }
    
    // Sort by distance if we have user location
    if (userLocation && Object.keys(vendorDistances).length > 0) {
      filtered.sort((a, b) => vendorDistances[a.id] - vendorDistances[b.id]);
    }
    
    setFilteredVendors(filtered);
  }, [filterOptions, vendors, vendorDistances, userLocation]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions(prev => ({ ...prev, distance: Number(e.target.value) }));
  };
  
  const handleCuisineChange = (cuisineType: CuisineType) => {
    setFilterOptions(prev => {
      const cuisineTypes = [...prev.cuisineTypes];
      
      if (cuisineTypes.includes(cuisineType)) {
        return { ...prev, cuisineTypes: cuisineTypes.filter(type => type !== cuisineType) };
      } else {
        return { ...prev, cuisineTypes: [...cuisineTypes, cuisineType] };
      }
    });
  };
  
  const handleOpenNowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(prev => ({ ...prev, openNow: e.target.checked }));
  };
  
  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    
    if (viewMode === 'map') {
      // Could scroll to vendor in list or show a popup
      console.log(`Selected vendor: ${vendorId}`);
    }
  };
  
  const uniqueCuisineTypes = Array.from(
    new Set(mockVendors.map(vendor => vendor.cuisineType))
  ) as CuisineType[];
  
  return (
    <Container className="py-6">
      <Flex className="flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <FilterSidebar className="md:w-1/4">
          <FilterTitle>Filters</FilterTitle>
          
          {/* Search */}
          <FilterSection>
            <label className="block text-neutral-700 font-medium mb-2">Search</label>
            <div className="relative">
              <SearchInput 
                type="text" 
                placeholder="Food or vendor name" 
                value={filterOptions.search}
                onChange={handleSearchChange}
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"></i>
            </div>
          </FilterSection>
          
          {/* Distance */}
          <FilterSection>
            <label className="block text-neutral-700 font-medium mb-2">Distance</label>
            <select 
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 outline-none focus:border-primary"
              value={filterOptions.distance}
              onChange={handleDistanceChange}
            >
              <option value={0.5}>0.5 miles</option>
              <option value={1}>1 mile</option>
              <option value={3}>3 miles</option>
              <option value={5}>5 miles</option>
              <option value={10}>10 miles</option>
            </select>
          </FilterSection>
          
          {/* Cuisine Type */}
          <FilterSection>
            <label className="block text-neutral-700 font-medium mb-2">Cuisine Type</label>
            <div className="space-y-2">
              {uniqueCuisineTypes.map((cuisineType) => (
                <div className="flex items-center" key={cuisineType}>
                  <input 
                    type="checkbox" 
                    id={`cuisine-${cuisineType}`}
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                    checked={filterOptions.cuisineTypes.includes(cuisineType)}
                    onChange={() => handleCuisineChange(cuisineType)}
                  />
                  <label htmlFor={`cuisine-${cuisineType}`} className="ml-2 text-neutral-700">
                    {cuisineType}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>
          
          {/* Open Now */}
          <FilterSection>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="openNow" 
                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                checked={filterOptions.openNow}
                onChange={handleOpenNowChange}
              />
              <label htmlFor="openNow" className="ml-2 text-neutral-700 font-medium">Open Now</label>
            </div>
          </FilterSection>
          
          {/* Apply Filters (mobile only) */}
          <button className="w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary/90 transition duration-300 md:hidden">
            Apply Filters
          </button>
        </FilterSidebar>
        
        {/* Main Content Area */}
        <div className="md:w-3/4">
          {/* View Toggle and Header */}
          <Flex justify="space-between" align="center" className="mb-4">
            <h2 className="font-header text-2xl font-bold">
              {locationLoading ? 'Finding Vendors Near You...' : 'Nearby Vendors'}
            </h2>
            
            <ViewToggle>
              <ToggleButton 
                active={viewMode === 'list'} 
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <i className="fas fa-list"></i>
              </ToggleButton>
              <ToggleButton 
                active={viewMode === 'map'} 
                onClick={() => setViewMode('map')}
                aria-label="Map view"
              >
                <i className="fas fa-map-marker-alt"></i>
              </ToggleButton>
            </ViewToggle>
          </Flex>
          
          {/* Map View */}
          {viewMode === 'map' && (
            <div className="mb-6">
              <MapView 
                vendors={filteredVendors}
                userLocation={userLocation || undefined}
                onVendorSelect={handleVendorSelect}
                selectedVendorId={selectedVendorId}
              />
            </div>
          )}
          
          {/* Vendors List View */}
          <Grid columns={viewMode === 'list' ? "1fr 1fr" : "1fr"} className="gap-4">
            {filteredVendors.length > 0 ? (
              filteredVendors.map(vendor => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  distance={vendorDistances[vendor.id] || 0}
                  isFavorite={isAuthenticated && isVendorSaved(vendor.id)}
                  onToggleFavorite={toggleSavedVendor}
                />
              ))
            ) : (
              <div className="col-span-2 py-8 text-center">
                <p className="text-neutral-600">No vendors found matching your filters. Try adjusting your search criteria.</p>
              </div>
            )}
          </Grid>
          
          {/* Load More Button */}
          {filteredVendors.length > 0 && (
            <div className="text-center mt-8">
              <button className="bg-white text-primary border border-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/10 transition duration-300">
                Load More
              </button>
            </div>
          )}
        </div>
      </Flex>
    </Container>
  );
};

export default VendorDiscovery;
