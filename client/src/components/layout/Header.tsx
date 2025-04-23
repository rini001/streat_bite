import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import styled from "styled-components";
import { Button, Container, Flex, colors, fonts } from "@/components/styled";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/common/Modal";

const HeaderContainer = styled.header`
  background-color: ${colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 0.75rem 0;
`;

const Logo = styled(Link)`
  font-family: ${fonts.accent};
  font-size: 1.875rem;
  color: ${colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${colors.primaryHover};
  }
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${props => props.active ? colors.primary : colors.neutral[700]};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${colors.neutral[700]};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${colors.white};
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 40;
`;

const MobileNavLink = styled(Link)<{ active?: boolean }>`
  display: block;
  color: ${props => props.active ? colors.primary : colors.neutral[700]};
  font-weight: 500;
  text-decoration: none;
  padding: 0.75rem 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Container>
        <Flex justify="space-between" align="center">
          <Logo href="/">StreetBite</Logo>
          
          <NavLinks>
            <NavLink href="/discover" active={location === "/discover"}>Discover</NavLink>
            <NavLink href="/about" active={location === "/about"}>About</NavLink>
            <NavLink href="/vendor-register" active={location === "/vendor-register"}>For Vendors</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink href="/profile" active={location === "/profile"}>My Profile</NavLink>
                <Button variant="outline" onClick={logout}>Log Out</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsSignInModalOpen(true)}>Sign In</Button>
                <Button variant="primary" onClick={() => setIsSignUpModalOpen(true)}>Sign Up</Button>
              </>
            )}
          </NavLinks>
          
          <MobileMenuButton onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </MobileMenuButton>
        </Flex>
      </Container>
      
      <MobileMenu isOpen={isMenuOpen}>
        <MobileNavLink href="/discover" active={location === "/discover"} onClick={closeMenu}>Discover</MobileNavLink>
        <MobileNavLink href="/about" active={location === "/about"} onClick={closeMenu}>About</MobileNavLink>
        <MobileNavLink href="/vendor-register" active={location === "/vendor-register"} onClick={closeMenu}>For Vendors</MobileNavLink>
        
        {isAuthenticated ? (
          <>
            <MobileNavLink href="/profile" active={location === "/profile"} onClick={closeMenu}>My Profile</MobileNavLink>
            <Button variant="outline" onClick={() => { logout(); closeMenu(); }} style={{ width: '100%', marginTop: '0.5rem' }}>Log Out</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => { setIsSignInModalOpen(true); closeMenu(); }} style={{ width: '100%', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Sign In</Button>
            <Button variant="primary" onClick={() => { setIsSignUpModalOpen(true); closeMenu(); }} style={{ width: '100%' }}>Sign Up</Button>
          </>
        )}
      </MobileMenu>
      
      {/* Sign In Modal */}
      <Modal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title="Sign In"
        subTitle="Welcome back! Please login to your account"
      >
        <form>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.neutral[300]}`,
                outline: 'none',
              }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              placeholder="Your password" 
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.neutral[300]}`,
                outline: 'none',
              }}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" style={{ marginLeft: '0.5rem' }}>Remember me</label>
            </div>
            <a href="#" style={{ color: colors.primary, textDecoration: 'none' }}>Forgot Password?</a>
          </div>
          
          <Button variant="primary" style={{ width: '100%', marginBottom: '1rem' }}>Sign In</Button>
          
          <p style={{ textAlign: 'center' }}>
            Don't have an account? <a 
              href="#" 
              style={{ color: colors.primary, textDecoration: 'none' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setIsSignInModalOpen(false); 
                setIsSignUpModalOpen(true); 
              }}
            >
              Create one
            </a>
          </p>
        </form>
      </Modal>
      
      {/* Sign Up Modal */}
      <Modal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        title="Sign Up"
        subTitle="Create your account to save favorite vendors"
      >
        <form>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
            <input 
              type="text" 
              placeholder="Your full name" 
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.neutral[300]}`,
                outline: 'none',
              }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.neutral[300]}`,
                outline: 'none',
              }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              placeholder="Create a password (min. 8 characters)" 
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.neutral[300]}`,
                outline: 'none',
              }}
              required 
            />
          </div>
          
          <Button variant="primary" style={{ width: '100%', marginBottom: '1rem' }}>Create Account</Button>
          
          <p style={{ textAlign: 'center' }}>
            Already have an account? <a 
              href="#" 
              style={{ color: colors.primary, textDecoration: 'none' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setIsSignUpModalOpen(false); 
                setIsSignInModalOpen(true); 
              }}
            >
              Sign in
            </a>
          </p>
        </form>
      </Modal>
    </HeaderContainer>
  );
};

export default Header;
