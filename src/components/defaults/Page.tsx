import { Box, Card, CardContent, Typography } from '@mui/material';
import DataNotAvailable from './DataNotAvailable';

/**
 * Page component to provide a consistent layout for pages with optional title and custom styles.
 *
 * @param {string} title - The title of the page.
 * @param {React.ReactNode} children - The content of the page.
 * @param {object} sx - Custom styles to apply to the root Box component.
 * @param {object} other - Other props to pass to the root Box component.
 */
interface PagePropTypes {
  title?: string;
  children?: React.ReactNode;
  sx?: object;
  fixedHeight?: boolean;
  marginX?: number;
  marginTop?: number;
}

const Page = ({
  children,
  title = '',
  fixedHeight = false,
  marginX = 4,
  marginTop = 3,
  sx,
  ...other
}: PagePropTypes) => {
  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
      {...other}
    >
      <Box
        sx={{
          width: '87%',
          p: '0.2rem',
          background: 'linear-gradient(45deg, #131313 0%, #292929 52%, #131313 100%, #0D111D 100%)',
          borderRadius: '0.75rem'
        }}
      >
        <Card
          sx={{
            width: '100%',
            minHeight: fixedHeight ? '41rem' : 'none',
            borderRadius: '0.75rem'
          }}
        >
          <CardContent
            sx={{
              mt: marginTop,
              mx: marginX
            }}
          >
            <Typography fontSize="1.75rem" color="#DEE2EE" gutterBottom>
              {title}
            </Typography>
            {children ? children : <DataNotAvailable />}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Page;
