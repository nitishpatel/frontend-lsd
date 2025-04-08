import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormLabel, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { throwErrorMessage } from '../../helpers/errors';
import { Address, NodeToken } from '../../types';
import useTransaction from '../../store/hooks/useTransaction';
import useWebStore from '../../store/useWebStore';
import buildApi from '../../store/useApiStore';
import toast from 'react-hot-toast';
import deployedAddresses from '../../abis/deployed_addresses.json';

const defaultStyle = {
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

interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
  fetchData?: () => Promise<void>;
  style?: React.CSSProperties;
  node: NodeToken | undefined | null;
}

/**
 * A modal component that allows users to redeem tokens from a node.
 * It checks if the number of tokens entered is valid and if the user has enough balance to redeem.
 * If the validation passes, it calls the redeem request API and creates a new redemption request.
 * If the validation fails, it sets an error message.
 *
 * @param open - Whether the modal is open or not
 * @param onClose - Function to close the modal
 * @param style - Additional CSS styles for the modal
 * @param node - The node to redeem from
 *
 * @example
 * <RedeemModal open={true} onClose={() => console.log('Modal closed')} node={{ name: 'Node 1', ...}} />
 */
const AdminRedeemModal: React.FC<RedeemModalProps> = ({ open, onClose, style, node }) => {
  const [numberOfTokens, setNumberOfTokens] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { createRedeemRequest } = buildApi();

  const { approveTokenForNodeContract } = useTransaction();

  /**
   * Handles the redeem request submission.
   * It checks if the number of tokens entered is valid and if the user has enough balance to redeem.
   * If the validation passes, it calls the redeem request API and creates a new redemption request.
   * If the validation fails, it sets an error message.
   */
  const handleRedeem = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      const value = numberOfTokens ? Number(numberOfTokens) : undefined!;

      if (!value) {
        setError('No. of Tokens is required');
        return;
      }

      const res = await approveTokenForNodeContract(
        node?.nodeAddress as Address,
        node?.tokenAddress as Address,
        `${value}`
      );

      const apiData = {
        node: node?._id ?? '',
        investor_address: deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
        redemption_qty: value
      };

      if (res) {
        await createRedeemRequest(apiData);
      }
      setError(null);
      toast.success('Redeemed Successfully');
      setNumberOfTokens('');
      onClose();
    } catch (error) {
      console.log('error', error);
      throwErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles changes to the number of tokens input field.
   * If the input value is invalid, it sets an error message.
   * @param {string} value The new value of the number of tokens input field.
   */
  const handleNumberOfTokensChange = (value: string) => {
    setNumberOfTokens(value);
    setError(null);

    const number = Number(value);

    if (!value) {
      setError('No. of Tokens is required');
      return;
    }

    if (number <= 0) {
      setError('Number of tokens must be greater than 0');
      return;
    }

    if (number > Number(node?.inventoryBalance)) {
      setError('Insufficient balance');
      return;
    }
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          setNumberOfTokens('');
          setError(null);
          onClose();
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
    >
      <Box sx={{ ...defaultStyle, ...style }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {node?.name}
        </Typography>
        <Box>
          <FormLabel>No. of Tokens</FormLabel>
          <TextField
            sx={{ mt: 1.5 }}
            fullWidth
            size="small"
            type="number"
            value={numberOfTokens}
            onChange={(e) => handleNumberOfTokensChange(e.target.value)}
            error={error ? true : false}
            helperText={error}
          />
        </Box>
        <Box mt={5} display="flex" justifyContent="space-between" alignItems="center">
          <LoadingButton
            size="small"
            variant="outlined"
            disabled={!!error}
            loading={isSubmitting}
            onClick={() => handleRedeem()}
          >
            Redeem
          </LoadingButton>
          <Button
            sx={{
              textTransform: 'none'
            }}
            onClick={() => {
              setError(null);
              onClose();
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdminRedeemModal;
