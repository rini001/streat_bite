import React, { ChangeEvent, FormEvent, useState } from "react";
import Modal from "@/components/common/Modal";
import { Button, colors } from "@/components/styled";
import { UserData } from "@/types/auth.types";

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     await onSubmit(formData);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       role: "user",
//     });
//   };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign Up"
      subTitle="Create your account to save favorite vendors"
    >
      <form onSubmit={onSubmit}>
        {/* Full Name */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            style={inputStyle}
            required
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            style={inputStyle}
            required
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password (min. 8 characters)"
            style={inputStyle}
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="primary" style={{ width: "100%", marginBottom: "1rem" }}>
          Create Account
        </Button>
      </form>
    </Modal>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: `1px solid ${colors.neutral[300]}`,
  outline: "none",
};

export default SignUpModal;
