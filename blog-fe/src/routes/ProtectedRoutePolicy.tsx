import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/loadingSpinner/LoadingSpinner';

type Props = {
  template: JSX.Element;
};

export default function ProtectedRoutePolicy({ template }: Props) {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <LoadingSpinner />;
  }

  const { isAuthenticated, isLoading } = authContext;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  return template;
}
