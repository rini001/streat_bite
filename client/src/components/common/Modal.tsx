import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colors, fonts } from '@/components/styled';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
`;

const ModalContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 28rem;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  background-color: ${colors.primary};
  color: ${colors.white};
  padding: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-family: ${fonts.header};
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0 0 0.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 1.25rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subTitle, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer ref={modalRef}>
        <ModalHeader>
          <ModalTitle>
            {title}
            <CloseButton onClick={onClose} aria-label="Close modal">
              <i className="fas fa-times"></i>
            </CloseButton>
          </ModalTitle>
          {subTitle && <ModalSubtitle>{subTitle}</ModalSubtitle>}
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
