import { Typography, Box } from '@mui/material';
import ypLogo from '../../assets/yplogo.png';
import xdcLogo from '../../assets/xinfinnetworklogo.png';

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 0.5,
        width: '100%',
        backgroundColor: '#000000'
      }}
    >
      <Typography
        variant="body1"
        align="center"
        sx={{
          py: 2,
          color: '#fff'
        }}
      >
        &copy; {new Date().getFullYear()} LSD. All rights reserved.
      </Typography>
      <Box>
        <Typography
          variant="body1"
          align="center"
          component={'a'}
          href="#"
          sx={{
            pb: 2,
            color: '#fff'
          }}
        >
          Privacy Policy
        </Typography>
        |{' '}
        <Typography
          variant="body1"
          align="center"
          component={'a'}
          href="#"
          sx={{
            pb: 2,
            color: '#fff'
          }}
        >
          Terms of Use
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" textAlign="right">
        <Typography variant="body1" sx={{ pr: 1 }}>
          Powered By -
        </Typography>
        <Box
          component="img"
          sx={{
            width: 100,
            height: 25,
            mx: 'auto'
          }}
          src={ypLogo}
        />
        <Box
          component="img"
          sx={{
            width: 100,
            height: 50,
            mx: 'auto'
          }}
          src={xdcLogo}
        />
      </Box>
    </Box>
  );
};

export default Footer;
