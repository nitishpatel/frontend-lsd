import yplogo from '../../assets/yplogo.png';
import { Box, Typography } from '@mui/material';
import xinfinnetworklogo from '../../assets/xinfinnetworklogo.png';

const BrandLogos = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          mt: '3.125rem'
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1.5rem', mr: 2, color: '#8e8ea7' }}>
          Co-Powered By :
        </Typography>
        <Box sx={{ height: '3rem', width: 'auto', mr: 2 }} component="img" src={yplogo} />
        <Box sx={{ height: '3.5rem', width: 'auto' }} component="img" src={xinfinnetworklogo} />
      </Box>
    </>
  );
};

export default BrandLogos;
