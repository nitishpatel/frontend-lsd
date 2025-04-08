import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../base/Navbar';
import WalletRequireOverlay from '../core/WalletRequireOverlay';
import Footer from '../base/Footer';

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh' // Ensures the layout spans the full viewport height
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1, // This allows the content to push the footer down
          position: 'relative'
        }}
      >
        <WalletRequireOverlay />
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
