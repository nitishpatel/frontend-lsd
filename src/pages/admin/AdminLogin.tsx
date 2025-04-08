/**
 * AdminLogin component
 *
 * This component renders the admin login page, including a login form, and a background image.
 *
 * @example
 * ```jsx
 * <AdminLogin />
 * ```
 *
 * @returns {JSX.Element} The admin login page component
 */
import { Typography, Box, Button, Paper } from '@mui/material';
import LoginForm from '../../components/admin/AdminLoginForm';
import LoginNavbar from '../../components/base/LoginNavbar';
import loginCover from '../../assets/login-bg.png';
import BrandLogos from '../../components/base/BrandLogos';

const AdminLogin = () => {
  return (
    <>
      <LoginNavbar />
      <Box
        sx={{
          height: '75vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${loginCover})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          flexDirection: 'column'
        }}
      >
        <Paper
          sx={{
            padding: 5,
            width: 500,
            margin: '20px auto',
            boxShadow: '0px 3px 20px #00000005',
            backgroundColor: '#131313'
          }}
        >
          <Typography textAlign="center" variant="h4" sx={{ mb: 4 }}>
            Login
          </Typography>
          <LoginForm />
        </Paper>
      </Box>
      <BrandLogos />
    </>
  );
};

export default AdminLogin;
