import { useState } from 'react';
import useTransaction from '../../store/hooks/useTransaction';
import { LoadingButton } from '@mui/lab';
import { Address, NodeToken } from '../../types';
import toast from 'react-hot-toast';
import { throwErrorMessage } from '../../helpers/errors';
import { Box, Button, Chip, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

interface AdminClaimRewardsModalProps {
  open: boolean;
  handleClose: () => void;
  row: NodeToken | undefined | null;
  fetchData?: () => Promise<void>;
}

const AdminClaimRewardsModal = ({ row, open, handleClose }: AdminClaimRewardsModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { claimNodeRewardsV2 } = useTransaction();

  const onClaimReward = async (nodeAddress: Address) => {
    try {
      setIsSubmitting(true);
      if (row?.unclaimed_rewards === '0') {
        throw Error('No Rewards To Claim');
      }
      await claimNodeRewardsV2(nodeAddress);
      toast.success('Successfully Claimed Rewards');
      setIsSubmitting(false);

      handleClose();
    } catch (error) {
      console.log(error);
      throwErrorMessage(error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Claiming Rewards from {row ? row?.name : 'NA'}
        </Typography>
        <Typography my={4} variant="body2" component="p">
          XDC Balance: &nbsp;
          <Chip
            label={row?.unclaimed_rewards}
            size="small"
            color={row?.unclaimed_rewards !== '0' ? 'success' : 'error'}
          />
        </Typography>
        <Box mt={5} display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            variant="outlined"
            size="small"
            loadingPosition="start"
            loading={isSubmitting}
            disabled={row?.unclaimed_rewards === '0'}
            onClick={async () => {
              await onClaimReward(row?.nodeAddress as Address);
            }}
            sx={{
              width: '9.375rem',
              '&.MuiLoadingButton-loading': {
                backgroundColor: '#424347'
              },
              '& .MuiCircularProgress-root': {
                color: '#000000'
              }
            }}
          >
            Claim Rewards
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdminClaimRewardsModal;
