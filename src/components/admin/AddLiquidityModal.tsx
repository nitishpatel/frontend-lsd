import { Box, Button, Chip, FormLabel, Grid, Modal, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useTransaction from '../../store/hooks/useTransaction';
import { throwErrorMessage } from '../../helpers/errors';
import { fromWei, toWei } from 'web3-utils';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { InventoryData } from '../../types';
import { convertFromWei, formatFloat } from '../../helpers/text';
import useWebStore from '../../store/useWebStore';

interface AddLiquidityModalProps {
  open: boolean;
  onClose: () => void;
  inventoryDetails: InventoryData | null;
  fetchAllInventoryDetails: () => Promise<void>;
}

interface Tolerance {
  result: {
    0: number;
    1: number;
  };
}

const AddLiquidityModal = ({
  open,
  onClose,
  inventoryDetails,
  fetchAllInventoryDetails
}: AddLiquidityModalProps) => {
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

  const wagmiConfig = useWebStore((state) => state.wagmiConfig);

  const [amount, setAmount] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBalanceLow, setIsBalanceLow] = useState(false);

  const { transferLiquidityToStaking, calculateTolerance } = useTransaction();

  const getFloorBalance = async () => {
    const tolerance = (await calculateTolerance()) as Tolerance[];
    const toleranceValue = tolerance?.[0]?.result;
    const liquidityThreshold = toleranceValue?.[0];
    const toleranceAdjustment = toleranceValue?.[1];
    const floorBalance = liquidityThreshold - toleranceAdjustment;
    return floorBalance;
  };

  useEffect(() => {
    getFloorBalance();
  }, [wagmiConfig]);

  const checkBalanceStatus = async () => {
    try {
      if (inventoryDetails) {
        const floorBalance = await getFloorBalance();
        const currentBalance = Number(inventoryDetails?.stakingContractBalance);
        const calcFloorBalance = Number(floorBalance);

        // Check if the current balance is below the floor balance
        setIsBalanceLow(currentBalance < calcFloorBalance);
      }
    } catch (error) {
      console.error('Error checking balance status:', error);
    }
  };

  useEffect(() => {
    checkBalanceStatus();
  }, [inventoryDetails]);

  const handleLiquidityChange = (value: string) => {
    setAmount(value);
    setError(null);

    const inventoryFreeBalance = parseFloat(
      convertFromWei(inventoryDetails?.inventoryProtocolFreeBalance?.toString() ?? '0')
    );

    const number = Number(value);

    if (!value) {
      setError('Amount is required');
      return;
    }

    if (number > inventoryFreeBalance) {
      setError('Not enough inventory free balance');
      return;
    }

    if (number <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (amount) {
        await transferLiquidityToStaking(toWei(amount, 'ether'));
      }
      await fetchAllInventoryDetails();
      onClose();
      setIsSubmitting(false);
      toast.success('Successfully Added Liquidity');
    } catch (error) {
      throwErrorMessage(error);
      console.log('transferLiquidityToStaking', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setAmount('');
        setError(null);
        onClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <Typography id="modal-modal-title" variant="h6">
            Add Liquidity
          </Typography>

          <Box display="flex">
            <Typography>Staking Balance:&nbsp;</Typography>
            <Typography
              sx={{
                color: isBalanceLow ? 'red' : 'blue', // Highlight in red if balance is low
                fontWeight: 'bold'
              }}
            >
              {formatFloat(
                parseFloat(
                  convertFromWei(inventoryDetails?.stakingContractBalance?.toString() ?? '0')
                )
              )}
            </Typography>
          </Box>
        </Box>
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
          onChange={(e) => handleLiquidityChange(e.target.value)}
          error={error ? true : false}
          helperText={error}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FormLabel>Transaction Type : &nbsp;</FormLabel>
            <Chip
              label="Top Up"
              size="small"
              sx={{
                backgroundColor: '#092448',
                color: '#fff',
                border: '1px solid #0D6FF0'
              }}
            />
          </Box>

          <LoadingButton
            size="small"
            variant="outlined"
            loading={isSubmitting}
            disabled={!!error}
            onClick={() => onSubmit()}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddLiquidityModal;
