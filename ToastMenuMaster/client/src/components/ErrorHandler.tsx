import { useState } from "react";
import ErrorModal from "./ErrorModal";

interface ErrorState {
  message: string;
  code?: string;
}

export function useErrorHandler() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentError, setCurrentError] = useState<ErrorState | null>(null);

  const showError = (error: ErrorState) => {
    setCurrentError(error);
    setShowErrorModal(true);
  };

  const closeError = () => {
    setShowErrorModal(false);
    setCurrentError(null);
  };

  const ErrorModalComponent = () => (
    <ErrorModal
      isOpen={showErrorModal}
      error={currentError}
      onClose={closeError}
    />
  );

  return {
    showError,
    closeError,
    ErrorModalComponent
  };
}