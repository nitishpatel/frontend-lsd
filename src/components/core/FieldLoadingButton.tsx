import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Box } from '@mui/material';

interface FieldUpdateButtonProps extends LoadingButtonProps {
  label: string;
}

const FieldLoadingButton = ({ label, loading, onClick, ...rest }: FieldUpdateButtonProps) => {
  return (
    <Box display="flex" justifyContent="flex-end">
      <LoadingButton
        variant="contained"
        size="small"
        loading={loading}
        onClick={onClick}
        sx={{
          '&.MuiLoadingButton-loading': {
            backgroundColor: '#424347'
          },
          '& .MuiCircularProgress-root': {
            color: '#000000',
            marginRight: '20px'
          }
        }}
        {...rest}
      >
        {label}
      </LoadingButton>
    </Box>
  );
};

export default FieldLoadingButton;
