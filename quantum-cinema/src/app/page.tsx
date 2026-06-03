"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import ParticleField from "@/components/ParticleField";
import NobelPrizeStep from "@/components/steps/NobelPrizeStep";
import VideoShowcaseStep from "@/components/steps/VideoShowcaseStep";
import WorldModelStep from "@/components/steps/WorldModelStep";
import ComparisonStep from "@/components/steps/ComparisonStep";

export type DeviceId = "ion-trap" | "superconducting" | "neutral-atoms";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<DeviceId>("ion-trap");

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectDevice = useCallback(
    (deviceId: DeviceId) => {
      setSelectedDevice(deviceId);
      nextStep();
    },
    [nextStep]
  );

  return (
    <main className="relative min-h-screen overflow-hidden quantum-grid">
      <StepIndicator
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      <ParticleField
        color={
          currentStep === 0
            ? "245, 158, 11"
            : currentStep === 1
              ? "168, 85, 247"
              : currentStep === 2
                ? "0, 240, 255"
                : "245, 158, 11"
        }
        count={30}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {currentStep === 0 && <NobelPrizeStep onNext={nextStep} />}
          {currentStep === 1 && (
            <VideoShowcaseStep
              onNext={nextStep}
              onSelectDevice={handleSelectDevice}
              onBack={prevStep}
            />
          )}
          {currentStep === 2 && (
            <WorldModelStep
              deviceId={selectedDevice}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && <ComparisonStep onBack={prevStep} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
