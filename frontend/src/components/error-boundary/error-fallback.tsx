import { type FC } from "react";

type ErrorFallbackProps = {
  message: string;
  resetErrorBoundary: () => void;
};

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  resetErrorBoundary,
  message,
}) => {
  function handleTryAgain() {
    resetErrorBoundary();
  }

  return (
    <div>
     {message}
      <button onClick={handleTryAgain}>Tentar de novo!</button>
    </div>
  );
};
