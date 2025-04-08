import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../base/Navbar';
import WalletRequireOverlay from '../core/WalletRequireOverlay';
import UserWalletRequireOverlay from '../core/UserWalletRequireOverlay';
import Footer from '../base/Footer';

const AdminLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1, // Pushes the footer to the bottom
          position: 'relative'
        }}
      >
        <UserWalletRequireOverlay />
        <WalletRequireOverlay />
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminLayout;
