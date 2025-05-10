import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Vendor } from "@/types";
import { colors, fonts } from "@/components/styled";
import StarRating from "@/components/common/StarRating";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "@/lib/utils";

interface VendorCardProps {
  vendor: Vendor;
  distance: number;
  onToggleFavorite: (vendorId: string, isFavorite: boolean) => void;
  isFavorite: boolean;
}

const CardContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 10rem;
`;

const VendorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({ isFavorite }) => isFavorite ? colors.primary : colors.neutral[500]};
  transition: color 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ isFavorite }) => isFavorite ? colors.primaryLight : colors.neutral[100]};
  }
`;

const ContentContainer = styled.div`
  padding: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const VendorName = styled.h3`
  font-family: ${fonts.header};
  font-weight: 700;
  font-size: 1.125rem;
  color: ${colors.neutral[800]};
  margin: 0;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${colors.primaryLight};
  color: ${colors.primary};
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const VendorInfo = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral[600]};
  margin-bottom: 0.5rem;
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const VendorDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral[600]};
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const ViewButton = styled(Link)`
  display: block;
  width: 100%;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-weight: 600;
  padding: 0.5rem 0;
  border-radius: 0.375rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const VendorCard: React.FC<VendorCardProps> = ({ vendor, distance, onToggleFavorite, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite(vendor.id, !isFavorite);
  };

  return (
    <CardContainer>
      <ImageContainer>
        <VendorImage src={vendor.images[0]} alt={vendor.businessName} />
        <FavoriteButton 
          isFavorite={isFavorite} 
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={isFavorite ? "fas fa-heart" : "far fa-heart"}></i>
        </FavoriteButton>
      </ImageContainer>
      
      <ContentContainer>
        <HeaderContainer>
          <VendorName>{vendor.businessName}</VendorName>
          <RatingContainer>
            <i className="fas fa-star text-yellow-500"></i>
            {vendor.ratings.average}
          </RatingContainer>
        </HeaderContainer>
        
        <VendorInfo>
          {vendor.cuisineType} • {formatDistance(distance)}
        </VendorInfo>
        
        <BadgesContainer>
          <Badge variant={vendor.isOpen ? "success" : "destructive"}>
            <i className={`fas fa-clock mr-1`}></i> 
            {vendor.isOpen ? "Open now" : "Closed"}
          </Badge>
          
          <Badge variant="info">
            <i className="fas fa-dollar-sign mr-1"></i> 
            {vendor.paymentMethods.join("/")}
          </Badge>
          
          {vendor.ratings.average >= 4.7 && (
            <Badge variant="accent">
              Popular
            </Badge>
          )}
        </BadgesContainer>
        
        <VendorDescription>{vendor.description}</VendorDescription>
        
        <ViewButton to={`/vendor/${vendor.id}`}>
          View Details
        </ViewButton>
      </ContentContainer>
    </CardContainer>
  );
};

export default VendorCard;
