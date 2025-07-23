import { useState } from "react";
import { OnboardingForm } from "./OnboardingForm";
import { FeeCalculator } from "./FeeCalculator";

interface StudentData {
  name: string;
  phone: string;
}

export const FeeCalculatorApp = () => {
  const [currentStep, setCurrentStep] = useState<'onboarding' | 'calculator'>('onboarding');
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  const handleOnboardingSubmit = (data: StudentData) => {
    setStudentData(data);
    setCurrentStep('calculator');
  };

  const handleBack = () => {
    setCurrentStep('onboarding');
    setStudentData(null);
  };

  return (
    <>
      {currentStep === 'onboarding' && (
        <OnboardingForm onSubmit={handleOnboardingSubmit} />
      )}
      
      {currentStep === 'calculator' && studentData && (
        <FeeCalculator 
          studentData={studentData} 
          onBack={handleBack}
        />
      )}
    </>
  );
};