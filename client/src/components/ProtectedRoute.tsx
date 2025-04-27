// src/components/ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, ReactNode, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Context for authentication
import { Spinner } from "@/components/ui/spinner"; // Custom spinner component for loading states
import { Toast } from "@/components/ui/toast"; // Optional Toast for notifications
import { ErrorBoundary } from "react-error-boundary"; // Optional error boundary for route-specific errors

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  onAuthFailed?: () => void; // Optional callback to run when auth fails (optional)
}

const ProtectedRoute = ({ children, redirectTo = "/", onAuthFailed }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, loading, error, retryCount, refreshAuth } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Trigger redirect logic after the retryCount exceeds a threshold
    if (!isAuthenticated && !loading && retryCount > 0) {
      setIsRedirecting(true);
      // Avoid unnecessary redirects by limiting retries
      const timer = setTimeout(() => setIsRedirecting(false), 3000);
      return () => clearTimeout(timer); // Cleanup on component unmount
    }
  }, [isAuthenticated, loading, retryCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && onAuthFailed) {
    onAuthFailed(); // Optional callback when auth fails (e.g., show a toast notification)
    return (
      <div className="fixed top-0 left-0 right-0 p-4 bg-red-500 text-white text-center">
        Authentication failed. Please try again.
      </div>
    );
  }

  if (!isAuthenticated) {
    // Handle redirecting with message
    return (
      <>
        {isRedirecting && (
          <div className="fixed top-0 left-0 right-0 p-4 bg-yellow-500 text-white text-center">
            You are being redirected... Please wait.
          </div>
        )}
        <Navigate to={redirectTo} state={{ from: location }} replace />
      </>
    );
  }

  return (
    <ErrorBoundary fallbackRender={() => <div>Something went wrong!</div>}>
      <Suspense fallback={<Spinner size="lg" />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProtectedRoute;