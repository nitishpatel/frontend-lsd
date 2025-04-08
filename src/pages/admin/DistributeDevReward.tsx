import React, { useEffect, useState } from 'react';
import Page from '../../components/defaults/Page';
import { Box, Button, Container, FormLabel, Grid, SxProps, TextField, Theme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import useTransaction from '../../store/hooks/useTransaction';
import useWebStore from '../../store/useWebStore';
import toast from 'react-hot-toast';
import { throwErrorMessage } from '../../helpers/errors';
import { convertFromWei, ethToXdcAddress, formatFloat } from '../../helpers/text';

interface DistributeRewardsFieldProps {
  label: string;
  type: string;
  fieldName?: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  value?: unknown;
}

interface DistributeDevRewardsValues {
  adminAddress: string;
  adminFeesAccrued: bigint;
  adminRewardAccrued: bigint;
  devAddress: string;
  devFeesAccrued: bigint;
  devRewardAccrued: bigint;
}

const DistributeDevReward = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);

  const navigate = useNavigate();
  const { feesAndRewardsDetails, withdrawProtocolFeesAndReward } = useTransaction();

  const [feesAndRewards, setFeesAndReward] = useState<DistributeDevRewardsValues>();

  /**
   * A component that renders a form field for distributing rewards.
   * It displays a label and a read-only text field with specified styling.
   *
   * @param {string} label - The label displayed above the text field.
   * @param {string} type - The type of the text field, e.g., 'text', 'number'.
   * @param {SxProps<Theme>} [sx] - Optional styling properties applied to the text field.
   *
   * @returns {React.ReactElement} A grid item containing the form label and text field.
   */
  const DistributeRewardsField = ({ label, type, sx, value }: DistributeRewardsFieldProps) => {
    return (
      <Grid item lg={6} md={6} xs={12} sm={12}>
        <FormLabel>{label}</FormLabel>
        <TextField
          sx={{ mt: 1.5, ...sx }}
          inputProps={{ readOnly: true }}
          fullWidth
          size="small"
          value={value}
          autoComplete="off"
          type={type}
        />
      </Grid>
    );
  };

  const fetchAllfeesAndRewards = async () => {
    try {
      const res = await feesAndRewardsDetails();
      const data = res?.[0]?.result as DistributeDevRewardsValues;
      setFeesAndReward(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllfeesAndRewards();
  }, [wagmiConfig]);

  const handleWithdrawProtocolFeesAndReward = async () => {
    try {
      setIsSubmitting(true);
      await withdrawProtocolFeesAndReward();
      await fetchAllfeesAndRewards();
      toast.success('Successfully Distributed LSD & Dev Reward');
    } catch (error) {
      console.error(error);
      throwErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const feesandRewardData = [
    {
      label: 'Protocol Owner Address',
      type: 'text',
      fieldName: 'protocolOwnerAddress',
      value: ethToXdcAddress(feesAndRewards?.adminAddress ?? '')
    },
    {
      label: 'Dev Address',
      type: 'text',
      fieldName: 'devAddress',
      value: ethToXdcAddress(feesAndRewards?.devAddress ?? '')
    },
    {
      label: 'Protocol V2 Reward Cut (XDC)',
      type: 'text',
      fieldName: 'protocolV2RewardCut',
      value: formatFloat(
        parseFloat(convertFromWei(feesAndRewards?.adminRewardAccrued?.toString() ?? ''))
      )
    },
    {
      label: 'Dev V2 Reward Cut (XDC)',
      type: 'text',
      fieldName: 'devV2RewardCut',
      value: formatFloat(
        parseFloat(convertFromWei(feesAndRewards?.devRewardAccrued?.toString() ?? ''))
      )
    },
    {
      label: 'Protocol Staking / Unstaking Reward Cut (XDC)',
      type: 'text',
      fieldName: 'protocolStakingRewardCut',
      value: formatFloat(
        parseFloat(convertFromWei(feesAndRewards?.adminFeesAccrued?.toString() ?? ''))
      )
    },
    {
      label: 'Dev Staking / Unstaking Reward Cut (XDC)',
      type: 'text',
      fieldName: 'devStakingRewardCut',
      value: formatFloat(
        parseFloat(convertFromWei(feesAndRewards?.devFeesAccrued?.toString() ?? ''))
      )
    },
    {
      label: 'Protocol Total Fees (XDC)',
      type: 'text',
      fieldName: 'protocolTotalFees',
      value: formatFloat(
        parseFloat(
          convertFromWei(
            (
              BigInt(feesAndRewards?.adminFeesAccrued ?? 0n) +
              BigInt(feesAndRewards?.adminRewardAccrued ?? 0n)
            ).toString()
          )
        )
      )
    },
    {
      label: 'Dev Total Fees (XDC)',
      type: 'text',
      fieldName: 'devTotalFees',
      value: formatFloat(
        parseFloat(
          convertFromWei(
            (
              BigInt(feesAndRewards?.devFeesAccrued ?? 0n) +
              BigInt(feesAndRewards?.devRewardAccrued ?? 0n)
            ).toString()
          )
        )
      )
    }
  ];

  return (
    <Page title="Distribute LSD & Dev Reward">
      <Container
        sx={{
          mt: 4
        }}
      >
        <Grid
          container
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
          sx={{ width: '100%' }}
        >
          {feesandRewardData?.map((item, index) => (
            <DistributeRewardsField
              key={index}
              label={item.label}
              type={item.type}
              value={item.value}
            />
          ))}
        </Grid>
        <Box
          sx={{
            mt: 5,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            variant="contained"
            sx={{
              mr: 2
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loadingPosition="start"
            loading={isSubmitting}
            onClick={handleWithdrawProtocolFeesAndReward}
            sx={{
              '&.MuiLoadingButton-loading': {
                backgroundColor: '#424347'
                // color: '#ffffff'
              },

              '& .MuiCircularProgress-root': {
                color: '#000000',
                marginRight: '20px'
              }
            }}
          >
            Distribute Reward
          </LoadingButton>
        </Box>
      </Container>
    </Page>
  );
};

export default DistributeDevReward;
