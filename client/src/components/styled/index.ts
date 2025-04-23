import styled from "styled-components";

// Colors
export const colors = {
  primary: "#FF6B35",
  primaryHover: "#FF8358",
  primaryLight: "#FFF0EB",
  secondary: "#2EC4B6",
  secondaryHover: "#25A396",
  secondaryLight: "#E6F7F5",
  white: "#FFFFFF",
  black: "#333333",
  success: "#27AE60",
  error: "#EB5757",
  warning: "#F2C94C",
  neutral: {
    100: "#FFFFFF",
    200: "#F5F5F5",
    300: "#E0E0E0",
    400: "#CCCCCC",
    500: "#999999",
    600: "#666666",
    700: "#333333",
    800: "#1A1A1A",
  },
};

// Typography
export const fonts = {
  header: "'Montserrat', sans-serif",
  body: "'Open Sans', sans-serif",
  accent: "'Pacifico', cursive",
};

// Common button styles
export const Button = styled.button<{ variant?: "primary" | "secondary" | "outline" | "text" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return `
          background-color: ${colors.primary};
          color: ${colors.white};
          border: none;
          
          &:hover {
            background-color: ${colors.primaryHover};
          }
        `;
      case "secondary":
        return `
          background-color: ${colors.secondary};
          color: ${colors.white};
          border: none;
          
          &:hover {
            background-color: ${colors.secondaryHover};
          }
        `;
      case "outline":
        return `
          background-color: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
          
          &:hover {
            background-color: ${colors.primaryLight};
          }
        `;
      case "text":
        return `
          background-color: transparent;
          color: ${colors.primary};
          border: none;
          padding: 0.5rem;
          
          &:hover {
            color: ${colors.primaryHover};
            text-decoration: underline;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Card component
export const Card = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// Input component
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.neutral[300]};
  border-radius: 0.5rem;
  font-family: ${fonts.body};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  outline: none;
  
  &:focus {
    border-color: ${colors.primary};
  }
  
  &::placeholder {
    color: ${colors.neutral[500]};
  }
  
  &:disabled {
    background-color: ${colors.neutral[200]};
    cursor: not-allowed;
  }
`;

// Select component
export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.neutral[300]};
  border-radius: 0.5rem;
  font-family: ${fonts.body};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    border-color: ${colors.primary};
  }
  
  &:disabled {
    background-color: ${colors.neutral[200]};
    cursor: not-allowed;
  }
`;

// Container component
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

// Label component
export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-family: ${fonts.body};
  font-weight: 600;
  color: ${colors.neutral[700]};
  font-size: 0.875rem;
`;

// Section component
export const Section = styled.section<{ background?: string }>`
  padding: 4rem 0;
  background-color: ${props => props.background || colors.white};
`;

// Flex container
export const Flex = styled.div<{ 
  direction?: "row" | "column";
  justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  align?: "flex-start" | "flex-end" | "center" | "stretch";
  gap?: string;
  wrap?: "nowrap" | "wrap";
}>`
  display: flex;
  flex-direction: ${props => props.direction || "row"};
  justify-content: ${props => props.justify || "flex-start"};
  align-items: ${props => props.align || "stretch"};
  gap: ${props => props.gap || "0"};
  flex-wrap: ${props => props.wrap || "nowrap"};
`;

// Grid container
export const Grid = styled.div<{
  columns?: string;
  gap?: string;
}>`
  display: grid;
  grid-template-columns: ${props => props.columns || "1fr"};
  gap: ${props => props.gap || "1rem"};
`;

// Text component
export const Text = styled.p<{
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "bold";
  color?: string;
}>`
  font-family: ${fonts.body};
  margin: 0;
  
  ${({ size }) => {
    switch (size) {
      case "xs":
        return "font-size: 0.75rem;";
      case "sm":
        return "font-size: 0.875rem;";
      case "md":
        return "font-size: 1rem;";
      case "lg":
        return "font-size: 1.125rem;";
      case "xl":
        return "font-size: 1.25rem;";
      default:
        return "font-size: 1rem;";
    }
  }}
  
  ${({ weight }) => {
    switch (weight) {
      case "normal":
        return "font-weight: 400;";
      case "medium":
        return "font-weight: 500;";
      case "bold":
        return "font-weight: 700;";
      default:
        return "font-weight: 400;";
    }
  }}
  
  color: ${({ color }) => color || colors.neutral[700]};
`;

// Heading component
export const Heading = styled.h1<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: string;
}>`
  font-family: ${fonts.header};
  font-weight: 700;
  margin: 0;
  color: ${({ color }) => color || colors.neutral[800]};
  
  ${({ level }) => {
    switch (level) {
      case 1:
        return "font-size: 2.5rem;";
      case 2:
        return "font-size: 2rem;";
      case 3:
        return "font-size: 1.75rem;";
      case 4:
        return "font-size: 1.5rem;";
      case 5:
        return "font-size: 1.25rem;";
      case 6:
        return "font-size: 1rem;";
      default:
        return "font-size: 2.5rem;";
    }
  }}
`;

// Separator
export const Separator = styled.hr<{ color?: string }>`
  border: none;
  border-top: 1px solid ${({ color }) => color || colors.neutral[300]};
  margin: 1.5rem 0;
`;

// Badge
export const Badge = styled.span<{
  variant?: "default" | "success" | "warning" | "error" | "info";
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: ${fonts.body};
  
  ${({ variant = "default" }) => {
    switch (variant) {
      case "default":
        return `
          background-color: ${colors.primaryLight};
          color: ${colors.primary};
        `;
      case "success":
        return `
          background-color: #E6F7EF;
          color: ${colors.success};
        `;
      case "warning":
        return `
          background-color: #FCF8E3;
          color: ${colors.warning};
        `;
      case "error":
        return `
          background-color: #FDEEEE;
          color: ${colors.error};
        `;
      case "info":
        return `
          background-color: #E6F7FF;
          color: #1890FF;
        `;
    }
  }}
`;
