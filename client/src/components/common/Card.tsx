import React, { useState } from 'react';
import styled from 'styled-components';

interface RestaurantCardProps {
  name: string;
  description: string;
  menuImage: string;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  description,
  menuImage,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card>
        <Title>{name}</Title>
        <Description>{description}</Description>
        <ViewMenuButton onClick={() => setShowModal(true)}>View Menu</ViewMenuButton>
      </Card>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            <MenuImage src={menuImage} alt={`${name} Menu`} />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};


const Card = styled.div`
  width: 300px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #555;
  flex-grow: 1;
`;

const ViewMenuButton = styled.button`
  margin-top: 12px;
  padding: 10px 16px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #e04344;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 16px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const MenuImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
`;
