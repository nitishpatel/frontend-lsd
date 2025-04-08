import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';

export const Ellipsis = (name: string | ReactElement, elipWidth = '10rem', options?: any) => {
  return (
    <Box
      sx={{
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: elipWidth
      }}
      {...options}
    >
      <Typography variant="body2" noWrap>
        {name}
      </Typography>
    </Box>
  );
};

export const dateTimeToDate = (datetime: Date) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Add 1 to get the correct month
  const day = date.getDate();

  // Ensure that month and day are formatted as two digits
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const TextWrap = (text: string, width = '10rem') => {
  return (
    <Box
      sx={{
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        width: width
      }}
    >
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};
