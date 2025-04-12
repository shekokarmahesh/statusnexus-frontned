
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the landing page
    navigate('/', { replace: true });
  }, [navigate]);

  return null; // This component doesn't render anything as it redirects immediately
};

export default Index;
