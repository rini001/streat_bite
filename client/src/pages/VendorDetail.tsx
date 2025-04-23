import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import styled from 'styled-components';
import { Container, Button, colors, Flex, Heading, Text, Badge } from '@/components/styled';
import { Vendor, MenuItem } from '@/types';
import mockVendors from '@/mock/mockVendors';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/common/StarRating';
import { formatCurrency } from '@/lib/utils';

// Styled components for this page
const DetailContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const VendorImage = styled.div`
  position: relative;
  height: 16rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FloatingButton = styled.button`
  position: absolute;
  top: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
`;

const BackButton = styled(FloatingButton)`
  left: 1rem;
  color: ${colors.neutral[700]};
  
  &:hover {
    background-color: ${colors.neutral[100]};
  }
`;

const FavoriteButton = styled(FloatingButton)<{ isFavorite: boolean }>`
  right: 1rem;
  color: ${({ isFavorite }) => isFavorite ? colors.primary : colors.neutral[500]};
  
  &:hover {
    background-color: ${({ isFavorite }) => isFavorite ? colors.primaryLight : colors.neutral[100]};
  }
`;

const DetailContent = styled.div`
  padding: 1.5rem;
`;

const TabContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  overflow-x: auto;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  color: ${({ active }) => active ? colors.primary : colors.neutral[600]};
  border-bottom: ${({ active }) => active ? `2px solid ${colors.primary}` : 'none'};
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

const TabContent = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MenuNavigation = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
`;

const MenuCategoryButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ active }) => active ? colors.primary : colors.white};
  color: ${({ active }) => active ? colors.white : colors.neutral[700]};
  border: ${({ active }) => active ? 'none' : `1px solid ${colors.neutral[300]}`};
  border-radius: 0.5rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${({ active }) => active ? colors.primaryHover : colors.neutral[100]};
  }
`;

const MenuItemCard = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.neutral[200]};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const MenuItemImage = styled.img`
  width: 6rem;
  height: 6rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 1rem;
`;

const MenuItemContent = styled.div`
  flex: 1;
`;

const MenuItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const MenuItemName = styled.h4`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
`;

const MenuItemPrice = styled.span`
  font-weight: 600;
`;

type TabType = 'menu' | 'info' | 'reviews' | 'photos';

const VendorDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isVendorSaved, toggleSavedVendor } = useAuth();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [activeCategory, setActiveCategory] = useState<string>('All Items');
  
  useEffect(() => {
    // Find vendor by ID
    const foundVendor = mockVendors.find(v => v.id === params.id);
    
    if (foundVendor) {
      setVendor(foundVendor);
    } else {
      // Redirect to 404 or vendor list if not found
      setLocation('/discover');
    }
  }, [params.id, setLocation]);
  
  if (!vendor) {
    return (
      <Container className="py-8 text-center">
        <p>Loading vendor details...</p>
      </Container>
    );
  }
  
  // Get unique menu categories
  const menuCategories = Array.from(
    new Set(vendor.menu.map(item => item.category))
  );
  
  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'All Items' 
    ? vendor.menu 
    : vendor.menu.filter(item => item.category === activeCategory);
  
  return (
    <Container className="py-6">
      {/* Vendor Header */}
      <DetailContainer>
        <VendorImage>
          <Image src={vendor.images[0]} alt={vendor.businessName} />
          <BackButton 
            onClick={() => setLocation('/discover')}
            aria-label="Go back"
          >
            <i className="fas fa-arrow-left text-xl"></i>
          </BackButton>
          <FavoriteButton 
            isFavorite={isAuthenticated && isVendorSaved(vendor.id)}
            onClick={() => toggleSavedVendor(vendor.id)}
            aria-label={isVendorSaved(vendor.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={isVendorSaved(vendor.id) ? "fas fa-heart text-xl" : "far fa-heart text-xl"}></i>
          </FavoriteButton>
        </VendorImage>
        
        <DetailContent>
          <Flex justify="space-between" align="flex-start" className="mb-4">
            <div>
              <Heading level={1} className="text-3xl mb-2">{vendor.businessName}</Heading>
              <Text color={colors.neutral[600]}>
                {vendor.cuisineType} street food • 0.4 miles away
              </Text>
            </div>
            <div className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-lg font-bold">
              <i className="fas fa-star text-yellow-500 mr-1"></i> {vendor.ratings.average}
            </div>
          </Flex>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant={vendor.isOpen ? "success" : "error"} className="px-3 py-1 rounded-full">
              <i className="fas fa-clock mr-1"></i> 
              {vendor.isOpen ? 'Open now' : 'Closed'}
              {vendor.isOpen && ` (${vendor.locations[0].schedules[0].open} - ${vendor.locations[0].schedules[0].close})`}
            </Badge>
            <Badge variant="info" className="px-3 py-1 rounded-full">
              <i className="fas fa-dollar-sign mr-1"></i> 
              {vendor.paymentMethods.join("/")}
            </Badge>
            {vendor.ratings.average >= 4.7 && (
              <Badge variant="default" className="px-3 py-1 rounded-full">
                Popular
              </Badge>
            )}
            <Badge variant="warning" className="px-3 py-1 rounded-full">
              <i className="fas fa-utensils mr-1"></i> Authentic
            </Badge>
          </div>
          
          <Text className="mb-6">
            {vendor.description}
          </Text>
          
          <Flex gap="1rem" className="flex-wrap">
            <Button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium">
              <i className="fas fa-map-marker-alt mr-2"></i> Get Directions
            </Button>
            <Button variant="outline" className="flex items-center px-4 py-2 rounded-lg font-medium">
              <i className="fas fa-phone-alt mr-2"></i> Call
            </Button>
            <Button variant="outline" className="flex items-center px-4 py-2 rounded-lg font-medium">
              <i className="fas fa-share-alt mr-2"></i> Share
            </Button>
          </Flex>
        </DetailContent>
      </DetailContainer>
      
      {/* Tabs Navigation */}
      <TabContainer className="custom-scrollbar">
        <TabButton 
          active={activeTab === 'menu'} 
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </TabButton>
        <TabButton 
          active={activeTab === 'info'} 
          onClick={() => setActiveTab('info')}
        >
          Location & Hours
        </TabButton>
        <TabButton 
          active={activeTab === 'reviews'} 
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </TabButton>
        <TabButton 
          active={activeTab === 'photos'} 
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </TabButton>
      </TabContainer>
      
      {/* Tab Content */}
      {activeTab === 'menu' && (
        <TabContent>
          <Heading level={2} className="text-2xl mb-4">Menu</Heading>
          
          {/* Menu Categories */}
          <MenuNavigation className="custom-scrollbar">
            <MenuCategoryButton 
              active={activeCategory === 'All Items'} 
              onClick={() => setActiveCategory('All Items')}
            >
              All Items
            </MenuCategoryButton>
            
            {menuCategories.map(category => (
              <MenuCategoryButton 
                key={category} 
                active={activeCategory === category} 
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </MenuCategoryButton>
            ))}
          </MenuNavigation>
          
          {/* Menu Items */}
          <div className="space-y-6">
            {activeCategory !== 'All Items' && (
              <Heading level={3} className="text-xl mb-3">{activeCategory}</Heading>
            )}
            
            {filteredMenuItems.map(item => (
              <MenuItemCard key={item.id}>
                {item.image && (
                  <MenuItemImage src={item.image} alt={item.name} />
                )}
                <MenuItemContent>
                  <MenuItemHeader>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemPrice>{formatCurrency(item.price)}</MenuItemPrice>
                  </MenuItemHeader>
                  <Text size="sm" color={colors.neutral[600]} className="mt-1 mb-2">
                    {item.description}
                  </Text>
                  {item.popular && (
                    <Badge variant="default" className="px-3 py-1 text-sm rounded-lg">
                      Popular Choice
                    </Badge>
                  )}
                  {item.dietary && item.dietary.includes('Vegetarian') && (
                    <Badge variant="success" className="px-3 py-1 text-sm rounded-lg">
                      Vegetarian
                    </Badge>
                  )}
                </MenuItemContent>
              </MenuItemCard>
            ))}
          </div>
        </TabContent>
      )}
      
      {activeTab === 'info' && (
        <TabContent>
          <Heading level={2} className="text-2xl mb-4">Location & Hours</Heading>
          
          <div className="mb-6">
            <Heading level={3} className="text-xl mb-3">Address</Heading>
            <Text className="mb-2">{vendor.locations[0].address}</Text>
            <div className="h-64 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1545211510-e88924995047?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Location map" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div>
            <Heading level={3} className="text-xl mb-3">Hours</Heading>
            <table className="w-full">
              <tbody>
                {vendor.locations[0].schedules.map((schedule, index) => (
                  <tr key={index}>
                    <td className="py-1 font-medium">{schedule.day}</td>
                    <td className="py-1">{schedule.open} - {schedule.close}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabContent>
      )}
      
      {activeTab === 'reviews' && (
        <TabContent>
          <Heading level={2} className="text-2xl mb-2">Reviews</Heading>
          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={vendor.ratings.average} size="lg" />
            <span className="text-neutral-600">({vendor.ratings.count} reviews)</span>
          </div>
          
          {vendor.reviews.map(review => (
            <div key={review.id} className="border-b border-neutral-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <Text weight="bold">{review.userName}</Text>
                <Text size="sm" color={colors.neutral[500]}>{review.date}</Text>
              </div>
              <StarRating rating={review.rating} size="sm" showValue={false} className="mb-2" />
              <Text>{review.comment}</Text>
            </div>
          ))}
        </TabContent>
      )}
      
      {activeTab === 'photos' && (
        <TabContent>
          <Heading level={2} className="text-2xl mb-4">Photos</Heading>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[vendor.images[0], ...vendor.menu.filter(item => item.image).map(item => item.image!)].map((img, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={img} 
                  alt={`Vendor photo ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </TabContent>
      )}
    </Container>
  );
};

export default VendorDetail;
