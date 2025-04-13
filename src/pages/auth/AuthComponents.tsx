import { 
  SignIn, 
  SignUp, 
  UserButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/clerk-react';

export const SignInPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <SignIn 
      routing="path" 
      path="/sign-in" 
      signUpUrl="/sign-up" 
      appearance={{
        elements: {
          rootBox: "mx-auto w-full max-w-md",
          card: "rounded-lg shadow-lg"
        }
      }}
    />
  </div>
);

export const SignUpPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <SignUp 
      routing="path" 
      path="/sign-up" 
      signInUrl="/sign-in"
      appearance={{
        elements: {
          rootBox: "mx-auto w-full max-w-md",
          card: "rounded-lg shadow-lg"
        }
      }}
    />
  </div>
);

export const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export const UserProfileButton = () => <UserButton />;
