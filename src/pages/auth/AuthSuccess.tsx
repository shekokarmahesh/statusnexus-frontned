import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const AuthSuccess = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is authenticated, redirect to dashboard
        navigate("/dashboard");
      } else {
        // User is not authenticated, redirect to sign in
        navigate("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  // Show loading state while determining where to redirect
  return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
};