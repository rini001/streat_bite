import React from "react";
import styled from "styled-components";
import { Link } from "wouter";
import { Container, Flex, colors, fonts } from "@/components/styled";

const FooterContainer = styled.footer`
  background-color: ${colors.neutral[800]};
  color: ${colors.white};
  padding: 3rem 0;
`;

const Logo = styled.h2`
  font-family: ${fonts.accent};
  font-size: 1.875rem;
  color: ${colors.primary};
  margin-bottom: 1rem;
`;

const FooterDescription = styled.p`
  color: ${colors.neutral[400]};
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: ${colors.white};
  font-size: 1.25rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const FooterHeading = styled.h3`
  font-family: ${fonts.header};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.white};
  margin-bottom: 1rem;
`;

const FooterLinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: ${colors.neutral[400]};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  color: ${colors.neutral[400]};
`;

const ContactIcon = styled.i`
  color: ${colors.primary};
  margin-right: 0.75rem;
  margin-top: 0.25rem;
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${colors.neutral[700]};
  margin-top: 2rem;
  padding-top: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Copyright = styled.p`
  color: ${colors.neutral[500]};
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterBottomLink = styled.a`
  color: ${colors.neutral[500]};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Logo>StreetBite</Logo>
            <FooterDescription>
              Connecting food lovers with amazing street food vendors. Discover authentic, local cuisine right around the corner.
            </FooterDescription>
            <SocialIcons>
              <SocialIcon href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Pinterest">
                <i className="fab fa-pinterest"></i>
              </SocialIcon>
            </SocialIcons>
          </div>
          
          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <FooterLinksList>
              <FooterLinkItem>
                <FooterLink href="/">Home</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/discover">Discover Vendors</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/vendor-register">Register as Vendor</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/about">About Us</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/contact">Contact</FooterLink>
              </FooterLinkItem>
            </FooterLinksList>
          </div>
          
          {/* Contact Info */}
          <div>
            <FooterHeading>Contact Us</FooterHeading>
            <FooterLinksList>
              <ContactItem>
                <ContactIcon className="fas fa-map-marker-alt"></ContactIcon>
                <span>123 Street Food Lane, Foodie City, FC 12345</span>
              </ContactItem>
              <ContactItem>
                <ContactIcon className="fas fa-phone-alt"></ContactIcon>
                <span>(123) 456-7890</span>
              </ContactItem>
              <ContactItem>
                <ContactIcon className="fas fa-envelope"></ContactIcon>
                <span>hello@streetbite.com</span>
              </ContactItem>
            </FooterLinksList>
          </div>
        </div>
        
        <FooterBottom>
          <Copyright>© {new Date().getFullYear()} StreetBite. All rights reserved.</Copyright>
          <FooterBottomLinks>
            <FooterBottomLink href="#">Privacy Policy</FooterBottomLink>
            <FooterBottomLink href="#">Terms of Service</FooterBottomLink>
            <FooterBottomLink href="#">Cookie Policy</FooterBottomLink>
          </FooterBottomLinks>
        </FooterBottom>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
