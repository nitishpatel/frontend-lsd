import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface WithdrawConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WithdrawConfirmationModal: React.FC<WithdrawConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="withdraw-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: '400px',
          width: '90%'
        }}
      >
        <Typography id="withdraw-modal-title" variant="h6" component="h2" gutterBottom>
          Confirmation
        </Typography>
        <Typography variant="body1" gutterBottom>
          You are withdrawing your contribution as Node Anchor as the subscription period of the
          Node has ended without the node getting fully subscribed.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained">
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WithdrawConfirmationModal;
