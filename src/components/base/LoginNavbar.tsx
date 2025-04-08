/**
 * A custom navigation bar component for the login page.
 *
 * This component renders a transparent app bar with a logo that links to the homepage.
 * The logo is only visible on medium-sized screens and above.
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import LoginNavbar from './LoginNavbar';
 *
 * const LoginPage = () => {
 *   return (
 *     <div>
 *       <LoginNavbar />
 *       <!-- login form goes here -->
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {JSX.Element} A JSX element representing the login navigation bar.
 */
import { AppBar, Box, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import validLogo from '../../assets/logo.svg';

const LoginNavbar = () => {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        px: 4
      }}
      position="static"
    >
      <Toolbar disableGutters>
        <Link to="/">
          <Box
            component="img"
            src={validLogo}
            sx={{
              display: { xs: 'none', md: 'flex' }
            }}
          ></Box>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default LoginNavbar;
