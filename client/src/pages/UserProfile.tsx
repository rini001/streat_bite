import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import styled from 'styled-components';
import { Container, Heading, Text, Button, Flex, colors } from '@/components/styled';
import { Vendor } from '@/types';
import { useAuth } from '@/context/AuthContext';
import mockVendors from '@/mock/mockVendors';
import VendorCard from '@/components/vendor/VendorCard';
import useGeolocation from '@/hooks/useGeolocation';
import { calculateDistance } from '@/lib/utils';

// Styled components for this page
const ProfileContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileAvatar = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background-color: ${colors.primary};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: ${({ active }) => active ? colors.primary : colors.neutral[600]};
  border-bottom: 2px solid ${({ active }) => active ? colors.primary : 'transparent'};
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${colors.neutral[400]};
  margin-bottom: 1rem;
`;

type ProfileTab = 'favorites' | 'settings';

const UserProfile: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout, toggleSavedVendor } = useAuth();
  const { location: userLocation } = useGeolocation();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');
  const [savedVendors, setSavedVendors] = useState<Vendor[]>([]);
  const [vendorDistances, setVendorDistances] = useState<{ [key: string]: number }>({});
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  // Load saved vendors
  useEffect(() => {
    if (user) {
      const userSavedVendors = mockVendors.filter(vendor => 
        user.savedVendors.includes(vendor.id)
      );
      setSavedVendors(userSavedVendors);
    }
  }, [user]);
  
  // Calculate distances
  useEffect(() => {
    if (userLocation && savedVendors.length > 0) {
      const distances: { [key: string]: number } = {};
      
      savedVendors.forEach(vendor => {
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
  }, [userLocation, savedVendors]);
  
  const handleRemoveFavorite = (vendorId: string) => {
    toggleSavedVendor(vendorId);
    setSavedVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
  };
  
  // Get first letter of user's name for avatar
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };
  
  if (!isAuthenticated || !user) {
    return (
      <Container className="py-8 text-center">
        <p>Please log in to view your profile.</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-8">
      <ProfileContainer>
        <ProfileHeader>
          <ProfileAvatar>
            {getInitial(user.name)}
          </ProfileAvatar>
          
          <div>
            <Heading level={1} className="text-2xl mb-1">
              {user.name}
            </Heading>
            <Text color={colors.neutral[600]}>
              {user.email}
            </Text>
          </div>
        </ProfileHeader>
        
        <div className="border-b border-neutral-200 mb-4">
          <Flex>
            <Tab 
              active={activeTab === 'favorites'} 
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </Tab>
            <Tab 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Tab>
          </Flex>
        </div>
        
        {activeTab === 'favorites' && (
          <div>
            <Heading level={2} className="text-xl mb-4">
              Your Saved Vendors
            </Heading>
            
            {savedVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedVendors.map(vendor => (
                  <VendorCard 
                    key={vendor.id}
                    vendor={vendor}
                    distance={vendorDistances[vendor.id] || 0}
                    isFavorite={true}
                    onToggleFavorite={handleRemoveFavorite}
                  />
                ))}
              </div>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <i className="far fa-heart"></i>
                </EmptyStateIcon>
                <Heading level={3} className="text-xl mb-2">
                  No saved vendors yet
                </Heading>
                <Text color={colors.neutral[600]} className="mb-4">
                  Explore and save your favorite street food vendors to see them here.
                </Text>
                <Button variant="primary" onClick={() => setLocation('/discover')}>
                  Discover Vendors
                </Button>
              </EmptyState>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <Heading level={2} className="text-xl mb-4">
              Account Settings
            </Heading>
            
            <div className="bg-neutral-100 rounded-lg p-4 mb-6">
              <Heading level={3} className="text-lg mb-2">
                Personal Information
              </Heading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                    value={user.name}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
              
              <Button variant="outline" className="mb-2">
                <i className="fas fa-pen mr-2"></i> Edit Profile
              </Button>
            </div>
            
            <div className="bg-neutral-100 rounded-lg p-4 mb-6">
              <Heading level={3} className="text-lg mb-2">
                Password
              </Heading>
              
              <Button variant="outline" className="mb-2">
                <i className="fas fa-lock mr-2"></i> Change Password
              </Button>
            </div>
            
            <div className="bg-neutral-100 rounded-lg p-4 mb-6">
              <Heading level={3} className="text-lg mb-2">
                Notifications
              </Heading>
              
              <div className="mb-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="email-notifications" 
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="email-notifications" className="ml-2">
                    Email notifications about new vendors near me
                  </label>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="special-offers" 
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="special-offers" className="ml-2">
                    Special offers and promotions from saved vendors
                  </label>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="border-error text-error hover:bg-error/10"
              onClick={logout}
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Log Out
            </Button>
          </div>
        )}
      </ProfileContainer>
    </Container>
  );
};

export default UserProfile;
