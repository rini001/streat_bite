import React, { useRef, useState } from "react";
import { useLocation } from "wouter";
import styled from "styled-components";
import {
  Container,
  Button,
  Flex,
  Heading,
  Text,
  colors,
  fonts,
} from "@/components/styled";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { CuisineType, RegistrationFormData } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { CartData } from "@/types/cart.types";
import { previousDay } from "date-fns";
import { cartService } from "@/api/services/cartService";

// Styled components for this page
const RegistrationContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  background-color: ${colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const RegistrationHeader = styled.div`
  background-color: ${colors.primary};
  color: ${colors.white};
  padding: 1.5rem;
`;

const RegistrationContent = styled.div`
  padding: 1.5rem;
`;

const ProgressStepsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepCircle = styled.div<{ active: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: ${({ active }) =>
    active ? colors.primary : colors.neutral[200]};
  color: ${({ active }) => (active ? colors.white : colors.neutral[600])};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const StepLabel = styled.span<{ active: boolean }>`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ active }) => (active ? colors.primary : colors.neutral[600])};
  font-weight: ${({ active }) => (active ? 500 : 400)};
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 0.25rem;
  background-color: ${colors.neutral[200]};
  margin: 0 0.5rem;
`;

const ProgressIndicator = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${colors.primary};
  transition: width 0.3s ease;
`;

const FormSection = styled.section`
  margin-bottom: 2rem;
`;

const FormSectionTitle = styled.h3`
  font-family: ${fonts.header};
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${colors.neutral[800]};
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${colors.neutral[300]};
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border-color: ${colors.primary};
    background-color: ${colors.primaryLight}10;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

type RegistrationStep = "business" | "menu" | "location" | "review";

const VendorRegistration: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("business");
  const [formData, setFormData] = useState<CartData>({
    businessName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  description: "",
  menuImage:null
  });
  // const [formData, setFormData] = useState<RegistrationFormData>({
  //   businessName: "",
  //   cuisineType: "Mexican",
  //   ownerName: "",
  //   email: "",
  //   phone: "",
  //   password: "",
  //   description: "",
  //   termsConditions: false,
  // });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof CartData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        menuImage: e.target.files![0],
      }));
    }
  };

  const validateBusinessInfo: () => boolean = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    // if (!formData.ownerName.trim()) {
    //   newErrors.ownerName = "Owner name is required";
    // }

    // if (!formData.email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = "Please enter a valid email address";
    // }

    // if (!formData.phone.trim()) {
    //   newErrors.phone = "Phone number is required";
    // }

    // if (!formData.password.trim()) {
    //   newErrors.password = "Password is required";
    // } else if (formData.password.length < 8) {
    //   newErrors.password = "Password must be at least 8 characters";
    // }

    // if (!formData.termsConditions) {
    //   newErrors.termsConditions = "You must agree to the terms and conditions";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === "business") {
      // if (validateBusinessInfo()) {
      setCurrentStep("menu");
      // }
    } else if (currentStep === "menu") {
      setCurrentStep("location");
    } else if (currentStep === "location") {
      setCurrentStep("review");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "menu") {
      setCurrentStep("business");
    } else if (currentStep === "location") {
      setCurrentStep("menu");
    } else if (currentStep === "review") {
      setCurrentStep("location");
    }
  };
  const navigate = useNavigate();
   const { id } = useParams();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 try {
      const response = await cartService.addCart(formData);
      console.log("Cart added successfully:", response);
      navigate(`/dashboard/${id}`); // redirect on success
    } catch (error) {
      console.error("Failed to add cart:", error);
      // Optional: show error to user
    }
    console.log("Form data:", formData);

  };
  
  // Calculate step progress
  const getStepProgress = (): number => {
    switch (currentStep) {
      case "business":
        return 0;
      case "menu":
        return 33.3;
      case "location":
        return 66.6;
      case "review":
        return 100;
      default:
        return 0;
    }
  };

  // Get cuisineType options for the select input
  const cuisineOptions = [
    { value: "Mexican", label: "Mexican" },
    { value: "Japanese", label: "Japanese" },
    { value: "Greek", label: "Greek" },
    { value: "French", label: "French" },
    { value: "Thai", label: "Thai" },
    { value: "Indian", label: "Indian" },
    { value: "Italian", label: "Italian" },
    { value: "American", label: "American" },
    { value: "Chinese", label: "Chinese" },
    { value: "Other", label: "Other" },
  ];
const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger the file input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      setFormData(prev => ({
      ...prev,
      menuImage: file,
    }));
    }
  };
  return (
    <Container className="py-8">
      <RegistrationContainer>
        <RegistrationHeader>
          <Heading level={1} className="text-2xl" color={colors.white}>
            Register Your Food Business
          </Heading>
          <Text color={colors.white + "E6"} className="mt-2">
            Join our platform and reach more customers
          </Text>
        </RegistrationHeader>

        <RegistrationContent>
          {/* Progress Steps */}
          <ProgressStepsContainer>
            <StepItem>
              <StepCircle active={currentStep === "business"}>1</StepCircle>
              <StepLabel active={currentStep === "business"}>
                Business Info
              </StepLabel>
            </StepItem>

            <ProgressBar>
              <ProgressIndicator progress={getStepProgress() > 0 ? 100 : 0} />
            </ProgressBar>

            <StepItem>
              <StepCircle active={currentStep === "menu"}>2</StepCircle>
              <StepLabel active={currentStep === "menu"}>Menu</StepLabel>
            </StepItem>

            <ProgressBar>
              <ProgressIndicator
                progress={getStepProgress() > 33.3 ? 100 : 0}
              />
            </ProgressBar>

            <StepItem>
              <StepCircle active={currentStep === "location"}>3</StepCircle>
              <StepLabel active={currentStep === "location"}>
                Location
              </StepLabel>
            </StepItem>

            <ProgressBar>
              <ProgressIndicator
                progress={getStepProgress() > 66.6 ? 100 : 0}
              />
            </ProgressBar>

            <StepItem>
              <StepCircle active={currentStep === "review"}>4</StepCircle>
              <StepLabel active={currentStep === "review"}>Review</StepLabel>
            </StepItem>
          </ProgressStepsContainer>

          <form onSubmit={handleSubmit}>
            {/* Business Information Step */}
            {currentStep === "business" && (
              <FormSection>
                <FormSectionTitle>Business Information</FormSectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormInput
                    label="Business Name *"
                    placeholder="Your business name"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    error={errors.businessName}
                    required
                  />

                  {/* <FormSelect
                    label="Cuisine Type *"
                    options={cuisineOptions}
                    value={formData.cuisineType}
                    onChange={(value) =>
                      handleInputChange("cuisineType", value as CuisineType)
                    }
                    error={errors.cuisineType}
                    required
                  /> */}

                  {/* <FormInput 
                    label="Owner Name *"
                    placeholder="Your full name"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    error={errors.ownerName}
                    required
                  /> */}

                  {/* <FormInput 
                    label="Email Address *"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  /> */}

                  {/* <FormInput 
                    label="Phone Number *"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    required
                  /> */}
                  {/*                   
                  <FormInput 
                    label="Create Password *"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    required
                  /> */}
                </div>

                <FormInput
                  label="Business Description *"
                  as="textarea"
                  placeholder="Tell customers about your business, food, and what makes you special"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  error={errors.description}
                  className="mb-6"
                  style={{ height: "8rem" }}
                  required
                />

                {/* <div className="mb-8">
                  <label className="block text-neutral-700 font-medium mb-2">
                    Business Image
                  </label>
                  <DropzoneContainer
                    onClick={() =>
                      document.getElementById("businessImage")?.click()
                    }
                  >
                    <i className="fas fa-cloud-upload-alt text-4xl text-neutral-400 mb-2"></i>
                    <p className="text-neutral-600 mb-2">
                      Drag and drop an image here, or click to browse
                    </p>
                    <p className="text-neutral-500 text-sm">
                      JPG, PNG or GIF, max 5MB
                    </p>
                    <HiddenFileInput
                      type="file"
                      id="businessImage"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="text"
                      className="mt-4 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg"
                    >
                      Browse Files
                    </Button>
                  </DropzoneContainer>
                </div> */}

                <div className="mb-8">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="termsConditions"
                      className="mt-1 w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                      checked={formData.termsConditions}
                      onChange={(e) =>
                        handleInputChange("termsConditions", e.target.checked)
                      }
                      required
                    />
                    <label
                      htmlFor="termsConditions"
                      className="ml-2 text-neutral-700"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.termsConditions && (
                    <p className="text-error text-sm mt-1">
                      {errors.termsConditions}
                    </p>
                  )}
                </div>
              </FormSection>
            )}

            {/* Menu Step (Placeholder) */}
            {currentStep === "menu" && (
              <FormSection>
                {/* <FormSectionTitle>Menu Information</FormSectionTitle>
                <p className="text-neutral-600 mb-4">
                  Add your menu items with prices and descriptions.
                </p> */}

                {/* Menu item would be dynamically added in a real implementation */}
                {/* <div className="border border-neutral-300 rounded-lg p-4 mb-4">
                  <Heading level={4} className="text-lg mb-3">
                    Item #1
                  </Heading>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormInput
                      label="Item Name"
                      placeholder="e.g., Carne Asada Taco"
                      value=""
                      onChange={() => {}}
                    />

                    <FormInput
                      label="Price ($)"
                      type="number"
                      placeholder="e.g., 3.50"
                      value=""
                      onChange={() => {}}
                    />
                  </div>

                  <FormInput
                    label="Description"
                    placeholder="Describe your item..."
                    value=""
                    onChange={() => {}}
                    className="mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Category"
                      options={[
                        { value: "appetizers", label: "Appetizers" },
                        { value: "main-courses", label: "Main Courses" },
                        { value: "sides", label: "Sides" },
                        { value: "desserts", label: "Desserts" },
                        { value: "beverages", label: "Beverages" },
                      ]}
                      value=""
                      onChange={() => {}}
                      placeholder="Select a category"
                    /> */}

                     <div>
      <label className="block text-neutral-700 font-medium mb-2">
        Item Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        className="w-full py-2"
        onClick={handleButtonClick}
      >
        <i className="fas fa-upload mr-2"></i> Upload Menu Image
      </Button>

      {formData.menuImage && (
        <p className="mt-2 text-sm text-green-600">
          Selected: {formData.menuImage.name}
        </p>
      )}
    </div>
                  {/* </div> */}
                {/* </div> */}

                {/* <Button type="button" variant="outline" className="mb-8">
                  <i className="fas fa-plus mr-2"></i> Add Another Item
                </Button> */}
              </FormSection>
            )}

            {/* Location Step (Placeholder) */}
            {currentStep === "location" && (
              <FormSection>
                <FormSectionTitle>Location </FormSectionTitle>
                <p className="text-neutral-600 mb-4">
                  Add your primary location 
                </p>

                <div className="mb-6">
                  <Heading level={4} className="text-lg mb-3">
                    Address
                  </Heading>

                  <FormInput
                    label="Street Address"
                    placeholder="e.g., 123 Food Truck Lane"
                    value={formData.address}
                    onChange={(e) =>
                    handleInputChange("address", e.target.value)
                  }
                    className="mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="City"
                      placeholder="e.g., New York"
                      value={formData.city}
                      onChange={(e) =>
                    handleInputChange("city", e.target.value)
                  }
                    />

                    <FormInput
                      label="State"
                      placeholder="e.g., NY"
                      value={formData.state}
                      onChange={(e) =>
                    handleInputChange("state", e.target.value)
                  }
                    />

                    <FormInput
                      label="ZIP Code"
                      placeholder="e.g., 10001"
                      value={formData.zipCode}
                      onChange={(e) =>
                    handleInputChange("zipCode", e.target.value)
                  }
                    />
                  </div>
                </div>

                {/* <div className="mb-8">
                  <Heading level={4} className="text-lg mb-3">
                    Operating Hours
                  </Heading>

                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <div className="w-24 font-medium">{day}</div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${index}`}
                          className="w-4 h-4 mr-2"
                          defaultChecked
                        />
                        <label htmlFor={`day-${index}`}>Open</label>
                      </div>
                      <div className="flex items-center ml-4">
                        <input
                          type="time"
                          className="border border-neutral-300 rounded px-2 py-1 mx-2"
                          defaultValue="09:00"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          className="border border-neutral-300 rounded px-2 py-1 mx-2"
                          defaultValue="17:00"
                        />
                      </div>
                    </div>
                  ))}
                </div> */}
              </FormSection>
            )}

            {/* Review Step (Placeholder) */}
            {currentStep === "review" && (
              <FormSection>
                <FormSectionTitle>Review Your Information</FormSectionTitle>
                <p className="text-neutral-600 mb-6">
                  Please review all the information you've provided before
                  submitting.
                </p>

                <div className="bg-neutral-100 p-4 rounded-lg mb-6">
                  <Heading level={4} className="text-lg mb-2">
                    Business Information
                  </Heading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Text size="sm" color={colors.neutral[500]}>
                        Business Name
                      </Text>
                      <Text weight="medium">
                        {formData.businessName || "Not provided"}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" color={colors.neutral[500]}>
                        Cuisine Type
                      </Text>
                      <Text weight="medium">
                        {formData.cuisineType || "Not provided"}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" color={colors.neutral[500]}>
                        Owner Name
                      </Text>
                      <Text weight="medium">
                        {formData.ownerName || "Not provided"}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" color={colors.neutral[500]}>
                        Contact Information
                      </Text>
                      <Text weight="medium">{formData.email}</Text>
                      <Text weight="medium">{formData.phone}</Text>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-100 p-4 rounded-lg mb-6">
                  <Heading level={4} className="text-lg mb-2">
                    Menu Items
                  </Heading>
                  <Text className="text-neutral-500 italic">
                    Menu information will be displayed here.
                  </Text>
                </div>

                <div className="bg-neutral-100 p-4 rounded-lg mb-8">
                  <Heading level={4} className="text-lg mb-2">
                    Location & Schedule
                  </Heading>
                  <Text className="text-neutral-500 italic">
                    Location and schedule information will be displayed here.
                  </Text>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg mb-6">
                  <Heading level={4} className="text-lg mb-2 text-primary">
                    Ready to Submit?
                  </Heading>
                  <Text>
                    By clicking "Submit Registration", your information will be
                    reviewed by our team. Once approved, your food business will
                    be visible to customers on StreetBite.
                  </Text>
                </div>
              </FormSection>
            )}

            {/* Navigation Buttons */}
            <Flex justify="space-between">
              <Button
                type="button"
                variant="outline"
                className="px-6 py-3"
                onClick={
                  currentStep === "business"
                    ? () => setLocation("/")
                    : handlePrevious
                }
              >
                {currentStep === "business" ? "Back" : "Previous"}
              </Button>

              {currentStep === "review" ? (
                <Button type="button" variant="primary" className="px-6 py-3" onClick={handleSubmit}>
                  Submit Registration
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  className="px-6 py-3"
                  onClick={handleNext}
                >
                  Next:{" "}
                  {currentStep === "business"
                    ? "Add Menu"
                    : currentStep === "menu"
                    ? "Set Location"
                    : "Review"}
                </Button>
              )}
            </Flex>
          </form>
        </RegistrationContent>
      </RegistrationContainer>
    </Container>
  );
};

export default VendorRegistration;
