import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import styled from 'styled-components';
import { Container, Section, Button, colors, Heading, Text } from '@/components/styled';
import VendorCarousel from '@/components/vendor/VendorCarousel';
import mockVendors from '@/mock/mockVendors';
import { useAuth } from '@/context/AuthContext';
import useGeolocation from '@/hooks/useGeolocation';

// Styled components for this page
const HeroSection = styled(Section)`
  background: linear-gradient(to right, ${colors.primary}E6, ${colors.primary});
  color: ${colors.white};
  padding: 4rem 0 5rem;
  
  @media (min-width: 768px) {
    padding: 6rem 0 8rem;
  }
`;

const HeroImage = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 16rem;
    object-fit: cover;
    border-radius: 0.5rem;
  }
`;

const FeatureCard = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: ${colors.primaryLight};
  color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
`;

const CallToActionSection = styled(Section)`
  background-color: ${colors.primaryLight};
  text-align: center;
`;

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isVendorSaved, toggleSavedVendor } = useAuth();
  const { location: userLocation } = useGeolocation();
  
  // Filter some featured vendors
  const featuredVendors = mockVendors
    .filter(vendor => vendor.ratings.average >= 4.6)
    .slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Heading level={1} className="mb-6 text-4xl md:text-5xl" color={colors.white}>
                Discover Amazing Street Food Around You
              </Heading>
              <Text size="lg" className="mb-8" color={colors.white + "E6"}>
                Find the best street food vendors in your area. From tacos to crepes, we've got your cravings covered.
              </Text>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  className="bg-white text-primary py-3 px-8 text-lg font-bold shadow-lg hover:bg-neutral-100"
                  onClick={() => setLocation('/discover')}
                >
                  Find Food
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-secondary text-white py-3 px-8 text-lg font-bold shadow-lg"
                  onClick={() => setLocation('/vendor-register')}
                >
                  Register as Vendor
                </Button>
              </div>
            </div>
            
            <div className="md:w-5/12">
              <HeroImage>
                <img 
                  src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Street food vendor" 
                />
              </HeroImage>
            </div>
          </div>
        </Container>
      </HeroSection>

      {/* Map Preview Section */}
      <Section background={colors.white}>
        <Container>
          <Heading level={2} className="text-3xl text-center mb-2">
            Vendors Near You
          </Heading>
          <Text className="text-center mb-10 text-neutral-600">
            Explore street food vendors in your neighborhood
          </Text>
          
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <div className="map-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545211510-e88924995047?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}>
              {/* Vendor Markers - positioned with absolute */}
              <div className="vendor-marker" style={{ top: '25%', left: '33%' }}>
                <i className="fas fa-utensils"></i>
              </div>
              <div className="vendor-marker" style={{ top: '33%', left: '50%' }}>
                <i className="fas fa-utensils"></i>
              </div>
              <div className="vendor-marker" style={{ top: '66%', left: '25%' }}>
                <i className="fas fa-utensils"></i>
              </div>
              <div className="vendor-marker" style={{ top: '50%', left: '75%' }}>
                <i className="fas fa-utensils"></i>
              </div>
              
              {/* User Location Marker */}
              <div className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6">
                <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                <div className="w-12 h-12 bg-blue-500 opacity-30 rounded-full pulse-animation"></div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2">
                <button className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-primary">
                  <i className="fas fa-plus"></i>
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-primary">
                  <i className="fas fa-minus"></i>
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-primary">
                  <i className="fas fa-location-arrow"></i>
                </button>
              </div>
            </div>
            
            {/* Quick Location Search */}
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center w-full max-w-md mx-4">
                <i className="fas fa-search text-neutral-500 mr-3"></i>
                <input 
                  type="text" 
                  placeholder="Search for location or food type" 
                  className="flex-1 outline-none text-neutral-700 bg-transparent" 
                />
                <button className="ml-2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/discover">
              <Button variant="outline" className="mt-4">
                Explore Full Map
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section background={colors.neutral[100]}>
        <Container>
          <Heading level={2} className="text-3xl text-center mb-2">
            How It Works
          </Heading>
          <Text className="text-center mb-12 text-neutral-600">
            Simple steps to discover your next favorite street food
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-map-marker-alt"></i>
              </FeatureIcon>
              <Heading level={3} className="text-xl mb-3">
                Locate
              </Heading>
              <Text color={colors.neutral[600]}>
                Enable location services to find vendors near you or search for a specific area.
              </Text>
            </FeatureCard>
            
            {/* Step 2 */}
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-search"></i>
              </FeatureIcon>
              <Heading level={3} className="text-xl mb-3">
                Discover
              </Heading>
              <Text color={colors.neutral[600]}>
                Browse nearby vendors, filter by cuisine type, check ratings and reviews.
              </Text>
            </FeatureCard>
            
            {/* Step 3 */}
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-utensils"></i>
              </FeatureIcon>
              <Heading level={3} className="text-xl mb-3">
                Enjoy
              </Heading>
              <Text color={colors.neutral[600]}>
                Visit your chosen vendor, explore their menu, and save your favorites for later.
              </Text>
            </FeatureCard>
          </div>
        </Container>
      </Section>

      {/* Featured Vendors Section */}
      <Section background={colors.white}>
        <Container>
          <Heading level={2} className="text-3xl text-center mb-2">
            Featured Vendors
          </Heading>
          <Text className="text-center mb-10 text-neutral-600">
            Check out these popular street food vendors
          </Text>
          
          <VendorCarousel 
            vendors={featuredVendors} 
            userLocation={userLocation} 
            savedVendors={isAuthenticated ? (isVendorSaved ? featuredVendors.filter(v => isVendorSaved(v.id)).map(v => v.id) : []) : []}
            onToggleFavorite={toggleSavedVendor}
          />
          
          <div className="text-center mt-8">
            <Link href="/discover">
              <Button variant="primary" className="px-8 py-3">
                See All Vendors
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Call to Action Section */}
      <CallToActionSection>
        <Container>
          <Heading level={2} className="text-3xl mb-4">
            Ready to discover amazing street food?
          </Heading>
          <Text className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're looking to grab a quick bite or wanting to share your delicious creations with the world, StreetBite has you covered.
          </Text>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="primary" 
              className="py-3 px-8 text-lg font-bold shadow-lg"
              onClick={() => setLocation('/discover')}
            >
              Get Started Now
            </Button>
            <Button 
              variant="outline" 
              className="py-3 px-8 text-lg font-bold shadow-lg"
              onClick={() => setLocation('/about')}
            >
              Learn More
            </Button>
          </div>
        </Container>
      </CallToActionSection>
    </>
  );
};

export default Home;
