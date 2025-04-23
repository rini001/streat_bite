import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Vendor } from "@/types";
import VendorCard from "./VendorCard";
import { colors } from "@/components/styled";

interface VendorCarouselProps {
  vendors: Vendor[];
  userLocation?: { lat: number; lng: number };
  savedVendors: string[];
  onToggleFavorite: (vendorId: string, isFavorite: boolean) => void;
}

const CarouselContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const CarouselTrack = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: ${colors.primary} ${colors.neutral[200]};
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.neutral[200]};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.primary};
    border-radius: 10px;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 300px;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: ${colors.white};
  border: 1px solid ${colors.neutral[300]};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${colors.neutral[200]};
    color: ${colors.neutral[500]};
  }
  
  &.prev {
    left: -1.25rem;
  }
  
  &.next {
    right: -1.25rem;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const DotIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const Dot = styled.button<{ active: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background-color: ${props => props.active ? colors.primary : colors.neutral[300]};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

// Function to calculate distances from user location
const calculateDistances = (vendors: Vendor[], userLocation?: { lat: number; lng: number }): number[] => {
  if (!userLocation) {
    // Return random distances if no user location
    return vendors.map(() => parseFloat((Math.random() * 2 + 0.2).toFixed(1)));
  }
  
  return vendors.map(vendor => {
    const vendorLocation = vendor.locations[0].coordinates;
    // Simple distance calculation
    const latDiff = vendorLocation.lat - userLocation.lat;
    const lngDiff = vendorLocation.lng - userLocation.lng;
    return parseFloat(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff).toFixed(1));
  });
};

const VendorCarousel: React.FC<VendorCarouselProps> = ({ 
  vendors, 
  userLocation, 
  savedVendors,
  onToggleFavorite
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const distances = calculateDistances(vendors, userLocation);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / vendors.length;
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };
  
  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - itemsPerView);
    scrollToIndex(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = Math.min(vendors.length - itemsPerView, currentIndex + itemsPerView);
    scrollToIndex(newIndex);
  };
  
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.scrollWidth / vendors.length;
      const index = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(index);
    }
  };

  // Total number of dot indicators for mobile
  const totalDots = Math.ceil(vendors.length / itemsPerView);
  
  return (
    <CarouselContainer>
      <NavButton 
        className="prev" 
        onClick={handlePrev} 
        disabled={currentIndex === 0}
        aria-label="Previous vendors"
      >
        <i className="fas fa-chevron-left"></i>
      </NavButton>
      
      <CarouselTrack 
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {vendors.map((vendor, index) => (
          <CarouselItem key={vendor.id}>
            <VendorCard 
              vendor={vendor} 
              distance={distances[index]}
              isFavorite={savedVendors.includes(vendor.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </CarouselItem>
        ))}
      </CarouselTrack>
      
      <NavButton 
        className="next" 
        onClick={handleNext} 
        disabled={currentIndex >= vendors.length - itemsPerView}
        aria-label="Next vendors"
      >
        <i className="fas fa-chevron-right"></i>
      </NavButton>
      
      <DotIndicators>
        {Array.from({ length: totalDots }).map((_, index) => (
          <Dot 
            key={index} 
            active={index === Math.floor(currentIndex / itemsPerView)} 
            onClick={() => scrollToIndex(index * itemsPerView)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </DotIndicators>
    </CarouselContainer>
  );
};

export default VendorCarousel;
