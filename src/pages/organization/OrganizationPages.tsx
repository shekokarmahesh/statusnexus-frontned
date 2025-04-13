import { 
    CreateOrganization, 
    OrganizationProfile,
    useOrganization
  } from '@clerk/clerk-react';
  
  export const CreateOrganizationPage = () => (
    <div className="create-org-container">
      <h1>Create a New Team</h1>
      <CreateOrganization />
    </div>
  );
  
  export const OrganizationProfilePage = () => (
    <div className="org-profile-container">
      <h1>Team Settings</h1>
      <OrganizationProfile 
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
              maxWidth: '800px',
            },
          },
        }}
      />
    </div>
  );
  
  export const OrganizationCheck = ({ children }) => {
    const { organization, isLoaded } = useOrganization();
    
    if (!isLoaded) return <div>Loading...</div>;
    
    if (!organization) {
      return (
        <div className="no-org-message">
          <h2>No Team Selected</h2>
          <p>Please create or select a team to continue.</p>
          <CreateOrganization />
        </div>
      );
    }
    
    return children;
  };
  