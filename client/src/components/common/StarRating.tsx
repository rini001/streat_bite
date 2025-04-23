import React from 'react';
import styled from 'styled-components';
import { colors } from '@/components/styled';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const RatingContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.size === 'sm' ? '0.125rem' : props.size === 'md' ? '0.25rem' : '0.375rem'};
`;

const Star = styled.span<{ filled: boolean; size: 'sm' | 'md' | 'lg' }>`
  color: ${props => props.filled ? '#F2C94C' : colors.neutral[300]};
  font-size: ${props => props.size === 'sm' ? '0.75rem' : props.size === 'md' ? '1rem' : '1.25rem'};
`;

const RatingValue = styled.span<{ size: 'sm' | 'md' | 'lg' }>`
  font-weight: 600;
  font-size: ${props => props.size === 'sm' ? '0.75rem' : props.size === 'md' ? '0.875rem' : '1rem'};
  color: ${colors.neutral[700]};
  margin-left: 0.25rem;
`;

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 'md', 
  showValue = true,
  className 
}) => {
  // Limit rating between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, rating));
  
  // Generate array of stars
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    // Determine if the star should be filled, half-filled, or empty
    const filled = i <= Math.floor(normalizedRating);
    const halfFilled = !filled && i === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
    
    stars.push(
      <Star key={i} filled={filled || halfFilled} size={size}>
        {filled ? (
          <i className="fas fa-star"></i>
        ) : halfFilled ? (
          <i className="fas fa-star-half-alt"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </Star>
    );
  }
  
  return (
    <RatingContainer size={size} className={className}>
      {stars}
      {showValue && <RatingValue size={size}>{normalizedRating.toFixed(1)}</RatingValue>}
    </RatingContainer>
  );
};

export default StarRating;
