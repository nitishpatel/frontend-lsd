import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(-1); // Default behavior
  };

  return <Button onClick={handleClick}>Back</Button>;
};

export default BackButton;
