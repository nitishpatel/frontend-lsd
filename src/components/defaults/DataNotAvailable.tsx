/**
 * A React component that displays a message indicating that no data is available.
 *
 * It renders an image with a semi-transparent opacity and an optional custom style.
 *
 * @param {object} props - The component props.
 * @param {object} [props.sx] - Optional custom style for the image.
 *
 * @example
 * import React from 'react';
 * import DataNotAvailable from './DataNotAvailable';
 *
 * const MyComponent = () => {
 *   return (
 *     <DataNotAvailable sx={{ width: 200, height: 200 }} />
 *   );
 * };
 *
 * @returns {React.ReactElement} A React element representing the "no data available" message.
 */

import { Box, SxProps, Theme } from '@mui/material';
import EmptyDashboard from '../../assets/empty-assets.svg';

const DataNotAvailable = ({ sx }: { sx?: SxProps<Theme> }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component="img"
          sx={{
            opacity: 0.5,
            ...sx
          }}
          src={EmptyDashboard}
          alt="Empty Dashboard"
        />
        {/* <Typography sx={{ fontWeight: '600', color: '#DEE2EE' }}>No records found</Typography> */}
      </Box>
    </>
  );
};

export default DataNotAvailable;
