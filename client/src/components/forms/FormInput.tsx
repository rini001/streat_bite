import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '@/components/styled';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${colors.neutral[700]};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input<{ hasError?: boolean; hasIcon?: boolean }>`
  width: 100%;
  padding: ${props => props.hasIcon ? '0.75rem 2.5rem 0.75rem 0.75rem' : '0.75rem'};
  border: 1px solid ${props => props.hasError ? colors.error : colors.neutral[300]};
  border-radius: 0.5rem;
  font-family: ${fonts.body};
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
  
  &:focus {
    border-color: ${props => props.hasError ? colors.error : colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? `${colors.error}20` : `${colors.primary}20`};
  }
  
  &::placeholder {
    color: ${colors.neutral[500]};
  }
  
  &:disabled {
    background-color: ${colors.neutral[200]};
    cursor: not-allowed;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  color: ${colors.neutral[500]};
`;

const ErrorMessage = styled.p`
  color: ${colors.error};
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
`;

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  icon, 
  className, 
  ...props 
}) => {
  const id = props.id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <InputContainer className={className}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <InputWrapper>
        <StyledInput 
          id={id} 
          hasError={!!error} 
          hasIcon={!!icon} 
          aria-invalid={!!error}
          {...props} 
        />
        {icon && <IconContainer>{icon}</IconContainer>}
      </InputWrapper>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default FormInput;
