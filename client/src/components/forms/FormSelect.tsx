import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '@/components/styled';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Option[];
  error?: string;
  onChange: (value: string) => void;
}

const SelectContainer = styled.div`
  margin-bottom: 1rem;
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${colors.neutral[700]};
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? colors.error : colors.neutral[300]};
  border-radius: 0.5rem;
  font-family: ${fonts.body};
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  
  &:focus {
    border-color: ${props => props.hasError ? colors.error : colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? `${colors.error}20` : `${colors.primary}20`};
  }
  
  &:disabled {
    background-color: ${colors.neutral[200]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${colors.error};
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
`;

const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  options, 
  error, 
  onChange, 
  className, 
  ...props 
}) => {
  const id = props.id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <SelectContainer className={className}>
      <SelectLabel htmlFor={id}>{label}</SelectLabel>
      <StyledSelect 
        id={id} 
        hasError={!!error} 
        onChange={handleChange}
        aria-invalid={!!error}
        {...props} 
      >
        {props.placeholder && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </SelectContainer>
  );
};

export default FormSelect;
