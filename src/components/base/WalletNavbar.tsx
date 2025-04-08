import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';
import { convertFromWei, formatAddressShort, formatFloat } from '../../helpers/text';
import useWebStore from '../../store/useWebStore';
import useBalance from '../../store/hooks/useBalance';
import { useConnectWallet } from '@web3-onboard/react';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import xdcLogo from '../../assets/x.svg';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * WalletNavbar component displays the user's wallet information and balance,
 * and allows connecting, disconnecting, and logging out.
 */
const WalletNavbar = () => {
  // State for controlling the user menu anchor element
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  // Get logout function from auth store
  const { logout, user } = useAuthStore();
  const location = useLocation();

  // Web3-onboard hooks for wallet connection
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  // Get balance from custom hook
  const balance = useBalance();

  // Effect for connecting wallet on initial load
  React.useEffect(() => {
    const localStorageWallet = localStorage.getItem('wallet');
    if (localStorageWallet) {
      connect({
        autoSelect: {
          label: localStorageWallet,
          disableModals: true
        }
      });
    }
  }, []);

  // Get web store functions and account information
  const { setConnectWallet, account, disconnectWallet, erc20Balance } = useWebStore();

  // Effect for setting wallet connection in the store
  React.useEffect(() => {
    if (wallet) {
      setConnectWallet(wallet);
      localStorage.setItem('wallet', wallet.label);
      localStorage.setItem(
        'onboard.js:last_connected_wallet',
        JSON.stringify({ label: wallet.label })
      );
    }
  }, [wallet]);

  // Handle opening user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // Handle closing user menu and logout
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center">
      {wallet && account && (
        <List sx={{ display: { xs: 'none', md: 'flex' } }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="xdc" src={xdcLogo} />
            </ListItemAvatar>
            <ListItemText
              primary={formatAddressShort(account!)}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline', cursor: 'pointer' }}
                    component="span"
                    variant="body2"
                    color="#ffffff"
                    onClick={() => {
                      if (wallet?.label) {
                        disconnect({ label: wallet.label });
                        disconnectWallet();
                      }
                    }}
                  >
                    Disconnect
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider
            sx={{
              backgroundColor: '#454C70',
              mx: 4
            }}
            orientation="vertical"
            flexItem
          />
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="Balance"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{
                      display: 'inline',
                      whiteSpace: 'nowrap', // Prevent text wrapping
                      overflow: 'hidden', // Hide overflow if text exceeds the container
                      textOverflow: 'ellipsis' // Add ellipsis if text overflows
                    }}
                    component="span"
                    variant="body2"
                    color="#ffffff"
                  >
                    {formatFloat(parseFloat(balance ?? '0'))} XDC
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {location.pathname === '/' && (
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Balance"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{
                        display: 'inline',
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        overflow: 'hidden', // Hide overflow if text exceeds the container
                        textOverflow: 'ellipsis' // Add ellipsis if text overflows
                      }}
                      component="span"
                      variant="body2"
                      color="#ffffff"
                    >
                      {formatFloat(parseFloat(convertFromWei(erc20Balance) ?? '0'))} stXDC
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          )}
        </List>
      )}
      {!wallet && (
        <Button
          variant="outlined"
          sx={{
            ml: 4
          }}
          onClick={() => {
            connect();
          }}
        >
          Connect
        </Button>
      )}

      {user?.role === 'LSD_ADMIN' && (
        <Box
          sx={{
            ml: 4
          }}
        >
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem
              key="logout"
              onClick={() => {
                navigate('/admin/change-password');
              }}
            >
              <Typography textAlign="center">Change Password</Typography>
            </MenuItem>
            <MenuItem
              key="logout"
              onClick={() => {
                logout();
                if (wallet) {
                  disconnect({ label: wallet?.label });
                  disconnectWallet();
                }
                handleCloseUserMenu();
                toast.success('Successfully Logout');
              }}
            >
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default WalletNavbar;
