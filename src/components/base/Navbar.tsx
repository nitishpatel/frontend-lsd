import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import validLogo from '../../assets/logo.svg';
import WalletNavbar from './WalletNavbar';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
// import useAuthStore from '../../store/useAuthStore';
// import { useNavigate } from 'react-router-dom';

const pages = ['Products', 'Pricing', 'Blog'];

function Navbar({ sidebarClick }: { sidebarClick?: () => void }) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { user } = useAuthStore();

  const navigate = useNavigate();

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        px: 4
      }}
      position="static"
    >
      <Toolbar
        sx={{
          width: '100%',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between'
        }}
        disableGutters
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              top: '-10px',
              left: '-20px',
              backgroundColor: '#000000',
              p: 2,
              border: '3px solid #1B1C22',
              borderTopColor: 'transparent',
              borderRadius: '0px 0px 56px 56px'
            }}
          >
            <Box
              component="img"
              src={validLogo}
              onClick={() => {
                if (user) {
                  navigate('/');
                } else {
                  if (sidebarClick) {
                    sidebarClick();
                  }
                }
              }}
              sx={{
                cursor: 'pointer'
              }}
            />
          </Box>
        </Box>

        {/* logo for mobile */}
        <Box
          justifyContent="space-between"
          alignItems="center"
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            LOGO
          </Typography>
        </Box>
        <WalletNavbar />
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
