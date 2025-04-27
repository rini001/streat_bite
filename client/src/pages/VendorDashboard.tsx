import { FC } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const AddCartButton = styled.button`
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const VendorDashboard: FC = () => {
    const navigate = useNavigate(); // 👉 initialize the hook

    const handleAddCartClick = () => {
      navigate('/vendor-register'); // 👉 navigate to the route
    };
  
  return (
    <Container>
      <Title>Vendor Dashboard</Title>
      <AddCartButton onClick={handleAddCartClick}>Add Cart</AddCartButton>
    </Container>
  );
};

export default VendorDashboard;