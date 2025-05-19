import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { cartService } from '@/api/services/cartService';
import { RestaurantCard } from '@/components/common/Card';
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

    const { id } = useParams();
    const handleAddCartClick = () => {
      navigate(`/vendor-register/${id}`); // 👉 navigate to the route
    };
   const [carts, setCarts] = useState([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const data = await cartService.getCartsById(id as string);
        setCarts(data);
      } catch (err: any) {
        console.error('Error fetching carts:', err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchCarts();
  }, [id]);
console.log(carts.data);

  return (
    <Container>
      <Title>Vendor Dashboard</Title>
      <AddCartButton onClick={handleAddCartClick}>Add Cart</AddCartButton>
      {
        carts.data && carts.data.map((cart)=>(
            <div key={cart._id} style={{ padding: 20 }}>
              <RestaurantCard
                name={cart.businessName}
                description={cart.description}
                menuImage={cart.menuImage}
              />
            </div>
          )
        )
      }
       {/* <div style={{ padding: 20 }}>
      <RestaurantCard
        name="Biryani Blues"
        description="Delicious Hyderabadi Biryani and Kebabs. Quick Delivery!"
        menuImage="https://via.placeholder.com/400x600.png?text=Menu+Image"
      />
    </div> */}
    </Container>
  );
};

export default VendorDashboard;