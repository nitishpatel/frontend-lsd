/**
 * StakeModal component
 *
 * A modal component that allows users to stake XDC to a node.
 *
 * @param {object} props - Component props
 * @param {boolean} props.open - Whether the modal is open or not
 * @param {function} props.handleClose - Function to close the modal
 * @param {object} props.node - The node to stake to
 *
 * @example
 * <StakeModal open={true} handleClose={() => console.log('Modal closed')} node={{ name: 'Node 1', anchor_stake: 100, ... }} />
 */

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { checksumAddress, convertFromWei, formatFloat } from '../../helpers/text';
import { Button, Chip, FormLabel, TextField } from '@mui/material';
import useTransaction from '../../store/hooks/useTransaction';
import { throwErrorMessage } from '../../helpers/errors';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Address, InventoryData, NodeToken } from '../../types';
import useWebStore from '../../store/useWebStore';
import useAppStore from '../../store/useAppStore';

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

interface AdminStakeModalProps {
  open: boolean;
  handleClose: () => void;
  node: NodeToken | undefined | null;
  fetchData?: () => Promise<void>;
}

export default function AdminStakeModal({ open, handleClose, node }: AdminStakeModalProps) {
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { stakeInNodeV2, getProtocolInventoryDetails } = useTransaction();
  const [inventoryDetails, setInventoryDetails] = useState<InventoryData | null>(null);
  const [lotSize, setLotSize] = useState<string>();
  const { fetchAppConfigByKey } = useAppStore();

  const fetchAllInventoryDetails = async () => {
    const protocolInventoryDetails = await getProtocolInventoryDetails();
    const inventoryDetails = protocolInventoryDetails?.[0]?.result as InventoryData;
    setInventoryDetails(inventoryDetails);
  };

  const fetchAppConfigForNodeSpace = async () => {
    const lotSize = await fetchAppConfigByKey('LOT_SIZE');
    setLotSize(`${lotSize}`);
  };

  useEffect(() => {
    fetchAllInventoryDetails();
    fetchAppConfigForNodeSpace();
  }, [wagmiConfig]);

  const navigate = useNavigate();

  const stake = async () => {
    try {
      setIsSubmitting(true);
      const nodeAddress = checksumAddress(node?.nodeAddress ?? '0x');
      await stakeInNodeV2(nodeAddress as Address, amount);
      setIsSubmitting(false);
      handleClose();
      toast.success('Staked Successfully');
      navigate('/admin/valid-staking');
    } catch (error) {
      console.log('Error', error);
      throwErrorMessage(error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (data.amount < currentNodeLotSize) {
  //   ctx.addIssue({
  //     code: 'custom',
  //     path: ['amount'],
  //     message: `Stake must be at least ${currentNodeLotSize}`
  //   });
  // }
  // if (data.amount % currentNodeLotSize !== 0) {
  //   ctx.addIssue({
  //     code: 'custom',
  //     path: ['amount'],
  //     message: `Stake must be a multiple of ${currentNodeLotSize}`
  //   });
  // }
  // if (data?.amount > Number(balance)) {
  //   ctx.addIssue({
  //     code: 'custom',
  //     path: ['amount'],
  //     message: `Stake amount exceeds available balance`
  //   });
  // }
  // if (data.amount > currentNodeMaxSupply - Number(currentNodeCurrentSupply)) {
  //   ctx.addIssue({
  //     code: 'custom',
  //     path: ['amount'],
  //     message: `Stake amount exceeds maximum available supply of ${
  //       currentNodeMaxSupply - Number(currentNodeCurrentSupply)
  //     }`
  //   });
  // }

  const handleAmountChange = (value: string) => {
    try {
      setAmount(value);
      setError(null);
      const inventoryFreeBalance = parseFloat(
        convertFromWei(inventoryDetails?.inventoryProtocolFreeBalance?.toString() ?? '0') ?? '0'
      );

      const currentNodeLotSize = parseFloat(lotSize ?? '0');
      const currentNodeMaxSupply = node?.calculatedMaxSupply ?? 0;
      const currentNodeCurrentSupply = node?.currentSupply ?? 0;
      const amountValue = Number(value);
      if (!amountValue) {
        setError('Invalid amount');
      }
      if (amountValue > inventoryFreeBalance) {
        setError('Stake amount exceeds available balance');
      }

      if (amountValue < currentNodeLotSize) {
        setError(`Stake must be at least ${lotSize}`);
      }

      if (amountValue % currentNodeLotSize !== 0) {
        setError(`Stake must be a multiple of ${lotSize}`);
      }

      if (amountValue > currentNodeMaxSupply - Number(currentNodeCurrentSupply)) {
        setError(
          `Stake amount exceeds maximum available supply of ${
            currentNodeMaxSupply - Number(currentNodeCurrentSupply)
          }`
        );
      }
    } catch (error) {
      console.error('Error', error);
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
          Staking in {node ? node?.name : 'NA'}
        </Typography>
        <Box id="modal-modal-description" sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
          {node ? (
            <>
              <Typography variant="body2" component="p" mb={2}>
                Inventory Free Balance: &nbsp;
                <Chip
                  label={formatFloat(
                    parseFloat(
                      convertFromWei(
                        inventoryDetails?.inventoryProtocolFreeBalance?.toString() ?? '0'
                      )
                    ),
                    5
                  )}
                  size="small"
                  color={
                    parseFloat(
                      convertFromWei(
                        inventoryDetails?.inventoryProtocolFreeBalance?.toString() ?? '0'
                      )
                    ) > parseFloat(amount)
                      ? 'success'
                      : 'error'
                  }
                />
              </Typography>
              <FormLabel>Amount (XDC)</FormLabel>
              <TextField
                sx={{
                  my: 1.5,
                  WebkitAppearance: 'none'
                }}
                fullWidth
                size="small"
                autoComplete="off"
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                error={error ? true : false}
                helperText={error}
              />
            </>
          ) : (
            'No node selected'
          )}
        </Box>
        <Box mt={5} display="flex" justifyContent="space-between" alignItems="center">
          <LoadingButton
            disabled={!!error}
            size="small"
            variant="outlined"
            loading={isSubmitting}
            onClick={() => {
              stake();
            }}
          >
            Stake
          </LoadingButton>
          <Button
            sx={{
              textTransform: 'none'
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
