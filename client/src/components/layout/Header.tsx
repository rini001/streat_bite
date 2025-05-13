import React, { ChangeEvent, FormEvent, useState } from "react";
// import { Link, useLocation } from "wouter";
import styled from "styled-components";
import { Button, Container, Flex, colors, fonts } from "@/components/styled";
import { Link, useLocation } from 'react-router-dom';
import Modal from "@/components/common/Modal";
import { LoginCredentials, UserData } from "@/types/auth.types";
import { useAuth } from "@/hooks/useAuth";
import SignUpModal from "../common/SignUpModal";
import { useNavigate } from "react-router-dom";

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
  color: ${(props) => (props.active ? colors.primary : colors.neutral[700])};
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
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 40;
`;

const MobileNavLink = styled(Link)<{ active?: boolean }>`
  display: block;
  color: ${(props) => (props.active ? colors.primary : colors.neutral[700])};
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
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  // const [location] = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  // const { isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    role: "vendor",
  });
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const {isAuthenticated, login, register,logout } = useAuth();
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeSignIn = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // setLoading(true);
    // setError(null);

    try {
      await register(formData);
      // setSuccess(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (err: any) {
      // setError(err.response?.data?.message || 'Registration failed');
    } finally {
      // setLoading(false);
    }
  };
  const handleSubmitSignIn = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    // setLoading(true);
    // setError(null);

    try {
     const response= await login(credentials);
     setDashboardId(response.user._id);
      navigate(`/dashboard/${response.user._id}`)
    setIsSignInModalOpen(false);
      // Redirect or handle successful login
    } catch (err: any) {
      // setError(err.response?.data?.message || 'Login failed');
    } finally {
      // setLoading(false);
    }
  };
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
          
          {isAuthenticated? <Logo to={`/dashboard/${dashboardId}`}>StreetBite</Logo>:<Logo to="/">StreetBite</Logo>}
          <NavLinks>
            <NavLink to= "/discover" >
              Discover
            </NavLink>
         
            <NavLink to="/about">
              About
            </NavLink>
            {/* <NavLink
              href="/vendor-register"
              active={location === "/vendor-register"}
            >
              For Vendors
            </NavLink> */}

            {isAuthenticated ? (
              <>
                {/* <NavLink to="/profile">
                  My Profile
                </NavLink> */}
                <Button variant="outline" onClick={logout}>
                  Log Out
                </Button>
              </>
            ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsSignInModalOpen(true)}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                // onClick={() => setIsSignUpAsUserModalOpen(true)}
              >
                Sign Up
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsSignUpModalOpen(true)}
              >
                For Vendors
              </Button>
            </>
            )} 
          </NavLinks>

          <MobileMenuButton onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </MobileMenuButton>
        </Flex>
      </Container>

      <MobileMenu isOpen={isMenuOpen}>
        <MobileNavLink
          to = "/discover"
          onClick={closeMenu}
        >
          Discover
        </MobileNavLink>
        <MobileNavLink
          to= "/about"
          onClick={closeMenu}
        >
          About
        </MobileNavLink>
        {/* <MobileNavLink
          href="/vendor-register"
          active={location === "/vendor-register"}
          onClick={closeMenu}
        >
          For Vendors
        </MobileNavLink> */}

        {/* {isAuthenticated ? (
          <>
            <MobileNavLink
              href="/profile"
              active={location === "/profile"}
              onClick={closeMenu}
            >
              My Profile
            </MobileNavLink>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                closeMenu();
              }}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              Log Out
            </Button>
          </>
        ) : ( */}
        <>
          <Button
            variant="outline"
            onClick={() => {
              setIsSignInModalOpen(true);
              closeMenu();
            }}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // setIsSignUpModalOpen(true);
              closeMenu();
            }}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            Sign Up
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setIsSignUpModalOpen(true);
              closeMenu();
            }}
            style={{ width: "100%" }}
          >
            For Vendors
          </Button>
        </>
        {/* )} */}
      </MobileMenu>

      {/* Sign In Modal */}
      <Modal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title="Sign In"
        subTitle="Welcome back! Please login to your account"
      >
        <form onSubmit={handleSubmitSignIn}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              id="emailSignIn"
              name="email"
              value={credentials.email}
              onChange={handleChangeSignIn}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: `1px solid ${colors.neutral[300]}`,
                outline: "none",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              id="passwordSignIn"
              name="password"
              value={credentials.password}
              onChange={handleChangeSignIn}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: `1px solid ${colors.neutral[300]}`,
                outline: "none",
              }}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" style={{ marginLeft: "0.5rem" }}>
                Remember me
              </label>
            </div>
            <a
              href="#"
              style={{ color: colors.primary, textDecoration: "none" }}
            >
              Forgot Password?
            </a>
          </div>

          <Button
            variant="primary"
            style={{ width: "100%", marginBottom: "1rem" }}
            type="submit"
          >
            Sign In
          </Button>

          <p style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <a
              href="#"
              style={{ color: colors.primary, textDecoration: "none" }}
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
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        // onSubmit={handleSubmit}
      />
    </HeaderContainer>
  );
};

export default Header;
