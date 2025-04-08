import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Page from '../defaults/Page';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import useBalance from '../../store/hooks/useBalance';
import { convertFromWei, formatFloat } from '../../helpers/text';
import { useForm } from 'react-hook-form';
import swapIcon from '../../assets/updown-arrow.svg';
import { LoadingButton } from '@mui/lab';
import useTransaction from '../../store/hooks/useTransaction';
import { throwErrorMessage } from '../../helpers/errors';
import { fromWei, toWei } from 'web3-utils';
import useWebStore from '../../store/useWebStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import toast from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import { debounce } from 'lodash';
import { InventoryData, Result } from '../../types';

type StakeParamsResult = Result[]; // Array of Result objects

const StakingUnstaking = () => {
  const balance = useBalance();
  const [amount, setAmount] = useState(0);
  const [isStaking, setIsStaking] = useState(true);
  const [nodeSpaceAvailable, setNodeSpaceAvailable] = useState<string>();
  const [lotSize, setLotSize] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isStakingLoading, setIsStakingLoading] = useState(false);
  const [stakingStatus, setStakingStatus] = useState<string | null>(null);
  const [unstakingStatus, setUnstakingStatus] = useState<string | null>(null);
  const {
    stake,
    calculateStakeParams,
    getPrice,
    unstake,
    calculateUnStakingParams,
    getProtocolInventoryDetails,
    getStakingAndUnstakingStatus
  } = useTransaction();
  const [calculatedFees, setCalculatedFees] = useState<string | null>(null);
  const { wagmiConfig, account } = useWebStore();
  const { fetchAppConfigByKey } = useAppStore();
  const [inventoryDetails, setInventoryDetails] = React.useState<InventoryData | null>(null);

  const getPriceXDC = async () => {
    try {
      const res = await getPrice();
      const price = fromWei((res?.[0] as { result: string })?.result, 'ether');
      setPrice(price);
    } catch (error) {
      console.error('error', error);
    }
  };

  console.log('stakingStatus:', stakingStatus, 'unstakingStatus:', unstakingStatus);

  const fetchErc20Balance = useWebStore((state) => state.fetchErc20Balance);
  const erc20Balance = useWebStore((state) => state.erc20Balance);
  const { getErc20Balance } = useTransaction();

  const handleFetchBalance = async () => {
    const _erc20Balance = await getErc20Balance();
    fetchErc20Balance((_erc20Balance?.[0]?.result ?? '0')?.toString());
  };

  const fetchAllInventoryDetails = async () => {
    const protocolInventoryDetails = await getProtocolInventoryDetails();
    const inventoryDetails = protocolInventoryDetails?.[0]?.result as InventoryData;
    setInventoryDetails(inventoryDetails);
  };

  const fetchAppConfigForNodeSpace = async () => {
    const nodeSpaceAvailable = await fetchAppConfigByKey('NODE_SPACE_AVAILABLE');
    const lotSize = await fetchAppConfigByKey('LOT_SIZE');
    setLotSize(`${lotSize}`);

    setNodeSpaceAvailable(nodeSpaceAvailable ?? '');
  };

  const fetchStatus = async () => {
    const status = (await getStakingAndUnstakingStatus()) as Result[];
    const resStatus = status[0]?.result;
    setStakingStatus(resStatus?.[0]?.toString());
    setUnstakingStatus(resStatus?.[1]?.toString());
  };

  useEffect(() => {
    handleFetchBalance();
    getPriceXDC();
    fetchAppConfigForNodeSpace();
    fetchAllInventoryDetails();
    fetchStatus();
  }, [wagmiConfig, account]);

  const stakeSchema: ZodType = z
    .object({
      amount: z.coerce.number().min(1, 'Amount is required')
    })
    .superRefine((data, ctx) => {
      const availableBalance = isStaking
        ? balance
        : parseFloat(fromWei(erc20Balance, 'ether') ?? '0'); // Determine which balance to use
      const currentNodeLotSize = Number(lotSize);
      console.log('availableBalance', availableBalance);
      if (data?.amount > Number(availableBalance)) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: `Stake amount exceeds available balance`
        });
      }
      if (isStaking) {
        if (data.amount < currentNodeLotSize) {
          ctx.addIssue({
            code: 'custom',
            path: ['amount'],
            message: `Stake must be at least ${currentNodeLotSize}`
          });
        }
        if (data.amount % currentNodeLotSize !== 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['amount'],
            message: `Stake must be a multiple of ${currentNodeLotSize}`
          });
        }
      }
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger,
    reset
  } = useForm({
    defaultValues: {
      amount: 0,
      calculatedstXDCQty: '0'
    },
    resolver: zodResolver(stakeSchema)
  });

  const calculateMethodsOfStake = useMemo(
    () => async (amount: number, method: 'stakingFees' | 'stXDCQty') => {
      try {
        setIsCalculating(true);
        const amountValue = parseFloat(amount.toString());

        const weiValue = toWei(amountValue, 'ether');

        const res = (await calculateStakeParams(weiValue)) as StakeParamsResult | undefined;

        if (!res || res.length === 0 || res[0].status !== 'success') {
          throw new Error('Invalid response from calculateStakeParams');
        }

        const result = res[0]?.result;

        setIsCalculating(false);
        if (method === 'stXDCQty') {
          return fromWei(result[0], 'ether') === '0.' ? '0' : fromWei(result[0], 'ether');
        } else if (method === 'stakingFees') {
          return fromWei(result[2], 'ether') === '0.' ? '0' : fromWei(result[2], 'ether');
        }
        return 0;
      } catch (error) {
        console.error(error);
        setIsCalculating(false);
        return null;
      }
    },
    [calculateStakeParams]
  );

  const calculateMethodOfUnstake = useMemo(
    () => async (amount: number, method: 'XDCQty' | 'feespaid') => {
      try {
        setIsCalculating(true);
        const amountValue = parseFloat(amount.toString());

        const weiValue = toWei(amountValue, 'ether');
        const res = (await calculateUnStakingParams(weiValue)) as StakeParamsResult | undefined;

        if (!res || res.length === 0 || res[0].status !== 'success') {
          throw new Error('Invalid response from calculateUnStakingParams');
        }
        const result = res[0]?.result;

        setIsCalculating(false);
        if (method === 'XDCQty') {
          return formatFloat(
            Number(fromWei(result[0], 'ether') === '0.' ? '0' : fromWei(result[0], 'ether'))
          );
        } else if (method === 'feespaid') {
          return fromWei(result[1], 'ether') === '0.' ? '0' : fromWei(result[1], 'ether');
        }
        return 0;
      } catch (error) {
        console.error(error);
        setIsCalculating(false);
        return null;
      }
    },
    [calculateUnStakingParams]
  );

  const resetAll = () => {
    setAmount(0);
    setValue('amount', 0);
    setValue('calculatedstXDCQty', '0');
    setCalculatedFees(null);
    reset();
  };

  const onSubmit = async () => {
    try {
      setIsStakingLoading(true);

      if (isStaking) {
        await stake(toWei(amount, 'ether'));
        handleFetchBalance();
        toast?.success('Successfully Staked');
      } else {
        const stakingBalance = parseFloat(
          convertFromWei(inventoryDetails?.stakingContractBalance?.toString() ?? '0')
        );
        const stXDCQty = await calculateMethodOfUnstake(amount, 'XDCQty');
        const priceForInventory = parseFloat(stXDCQty?.toString() ?? '0');

        if (stakingBalance < priceForInventory) {
          throw new Error(
            'Protocol does not have enough balance to fulfill you request, Please try again later!'
          );
        }
        await unstake(toWei(amount, 'ether'));
        toast?.success('Successfully Unstaked');
      }
      handleFetchBalance();
      resetAll();
      setIsStakingLoading(false);
    } catch (error) {
      setIsStakingLoading(false);
      throwErrorMessage(error);
    } finally {
      setIsStakingLoading(false);
    }
  };

  // Debounced handler
  const debouncedHandleChange = useCallback(
    debounce(async (value: number) => {
      if (isStaking) {
        const fees = await calculateMethodsOfStake(value, 'stakingFees');
        const stXDCQty = await calculateMethodsOfStake(value, 'stXDCQty');

        setCalculatedFees(fees || null);
        setValue('calculatedstXDCQty', stXDCQty?.toString() ?? '');
      } else {
        const fees = await calculateMethodOfUnstake(value, 'feespaid');
        const stXDCQty = await calculateMethodOfUnstake(value, 'XDCQty');
        setCalculatedFees(fees || null);
        setValue('calculatedstXDCQty', stXDCQty?.toString() ?? '');
      }
    }, 500), // 500ms debounce
    [isStaking, calculateMethodsOfStake, calculateMethodOfUnstake, setValue]
  );

  // Main onChange handler
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setAmount(value);
    setValue('amount', value);
    trigger('amount'); // Trigger validation
    debouncedHandleChange(value); // Call debounced handler
  };

  const isDisabled = () => {
    if (Boolean(errors.amount)) return true; // Disable if there are errors in the amount field.
    if (isStaking) {
      console.log('nodeSpaceAvailable', nodeSpaceAvailable);
      if (stakingStatus === 'true') {
        return true;
      }
      if (nodeSpaceAvailable === 'false') {
        return true;
      }
    } // Allow if staking and space is available.

    if (!isStaking) {
      if (unstakingStatus === 'true') {
        return true;
      }
    } // Allow if unstaking is allowed.
    return false; // Default to disabled.
  };

  return (
    <Page>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card
            sx={{
              backgroundColor: '#0D0D0D'
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center">
                {isStaking ? (
                  <>
                    {stakingStatus === 'true' ? (
                      <Alert
                        severity="warning"
                        variant="outlined"
                        sx={{
                          fontWeight: 'bold'
                        }}
                      >
                        Staking is currently disabled by Admin, Please use the DEX for Staking
                      </Alert>
                    ) : null}
                  </>
                ) : (
                  <>
                    {unstakingStatus === 'true' ? (
                      <Alert
                        severity="warning"
                        variant="outlined"
                        sx={{
                          fontWeight: 'bold'
                        }}
                      >
                        Unstaking is currently disabled by Admin, Please use the DEX for Unstaking
                      </Alert>
                    ) : null}
                  </>
                )}
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption">
                  {isStaking ? `Stake XDC (Min ${lotSize} and multiple thereof)` : 'Unstake stXDC'}
                </Typography>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mr: 5
                    }}
                  >
                    Balance:{' '}
                    {isStaking
                      ? `${formatFloat(Number(balance))} XDC`
                      : `${formatFloat(parseFloat(convertFromWei(erc20Balance)))} stXDC`}
                  </Typography>
                  <Chip
                    label="Max"
                    size="small"
                    sx={{}}
                    onClick={async () => {
                      if (isStaking) {
                        const maxAmount =
                          parseInt(`${Number(balance) / Number(lotSize)}`) *
                          parseInt(lotSize ?? '0');
                        setAmount(Number(maxAmount));
                        setValue('amount', Number(maxAmount));
                        trigger('amount');
                        const fees = await calculateMethodsOfStake(
                          Number(maxAmount),
                          'stakingFees'
                        );
                        setCalculatedFees(fees || null);
                        const stXDCQty = await calculateMethodsOfStake(
                          Number(maxAmount),
                          'stXDCQty'
                        );
                        setValue('calculatedstXDCQty', stXDCQty?.toString() ?? '');
                      } else {
                        setAmount(parseFloat(fromWei(erc20Balance, 'ether') ?? '0'));
                        setValue('amount', parseFloat(fromWei(erc20Balance, 'ether') ?? '0'));
                        trigger('amount');
                        const fees = await calculateMethodOfUnstake(
                          parseFloat(fromWei(erc20Balance, 'ether') ?? '0'),
                          'feespaid'
                        );
                        setCalculatedFees(fees || null);
                        const stXDCQty = await calculateMethodOfUnstake(
                          parseFloat(fromWei(erc20Balance, 'ether') ?? '0'),
                          'XDCQty'
                        );
                        setValue('calculatedstXDCQty', stXDCQty?.toString() ?? '');
                      }
                    }}
                  />
                </Box>
              </Box>
              <TextField
                fullWidth
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.value.length > 15) {
                    input.value = input.value.slice(0, 15);
                  }
                }}
                size="small"
                sx={{
                  mt: 1.5
                }}
                autoComplete="off"
                type="number"
                {...register('amount')}
                value={amount}
                error={Boolean(errors.amount)}
                helperText={errors.amount && errors.amount.message}
                onChange={handleAmountChange}
              />
            </CardContent>
          </Card>
          <Box
            display="flex"
            sx={{
              py: 3
            }}
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              onClick={() => {
                setIsStaking(!isStaking);
                handleFetchBalance();
                resetAll();
              }}
            >
              <Box component="img" src={swapIcon} />
            </IconButton>
          </Box>
          <Card
            sx={{
              backgroundColor: '#0D0D0D'
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="left" alignItems="center">
                <Typography variant="caption">Receive {isStaking ? 'stXDC' : 'XDC'}</Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                sx={{
                  mt: 1.5
                }}
                InputProps={{
                  readOnly: true
                }}
                autoComplete="off"
                type="text"
                {...register('calculatedstXDCQty')}
                error={Boolean(errors.calculatedstXDCQty)}
                helperText={errors.calculatedstXDCQty && errors.calculatedstXDCQty.message}
              />
              <Grid container rowSpacing={2} marginTop={2}>
                <Grid item xs={6}>
                  <Typography>Protocol Fees</Typography>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }} xs={6}>
                  <Typography>
                    {isCalculating ? <CircularProgress size={12} /> : <>{calculatedFees ?? '0'}</>}{' '}
                    XDC
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Exchange Rate</Typography>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }} xs={6}>
                  <Typography>
                    1 stXDC = {Number(price) === 1 ? '1' : Number(price)?.toFixed(5) ?? '...'} XDC
                  </Typography>
                </Grid>
                <Divider />
                <Grid item xs={6}>
                  <Typography>Average Return</Typography>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }} xs={6}>
                  <Typography>
                    <span>&#8776;</span> &nbsp;
                    <span
                      style={{
                        color: '#FF0000'
                      }}
                    >
                      7 &#37; &nbsp;
                    </span>
                    APY
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Transaction Cost</Typography>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }} xs={6}>
                  <Typography>
                    <span>&#64;</span> 7 gwei
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box marginTop={3} display="flex" justifyContent="center" alignItems="center">
            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              loadingPosition="start"
              loading={isStakingLoading}
              disabled={isDisabled()}
              sx={{
                textTransform: 'none',
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
              {isStaking ? 'Stake' : 'Unstake'}
            </LoadingButton>
          </Box>
        </form>
      </Container>
    </Page>
  );
};

export default StakingUnstaking;
