import React, { useEffect, useState } from 'react';
import Page from '../../components/defaults/Page';
import {
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/core/BackButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { addressRegex } from '../../helpers/regex';
import { zodResolver } from '@hookform/resolvers/zod';
import deployAddresses from '../../abis/deployed_addresses.json';
import {
  bigIntToPercent,
  convertFromWei,
  ethToXdcAddress,
  percentToBigInt,
  xdcToEthAddress
} from '../../helpers/text';
import useTransaction from '../../store/hooks/useTransaction';
import useWebStore from '../../store/useWebStore';
import toast from 'react-hot-toast';
import { throwErrorMessage } from '../../helpers/errors';
import { ProtocolContractValues, ProtocolFormFieldProps, ProtocolFormValues } from '../../types';
import ProtocolUpdates from '../../components/admin/ProtocolUpdates';
import { toWei } from 'web3-utils';

interface Warnings {
  stakingFees: string;
  unstakingFees: string;
  adminRewardCut: string;
}

/**
 * Page for setting up the protocol parameters.
 *
 * This page allows the admin to set the protocol parameters, such as the
 * liquidity threshold, staking fees, unstaking fees, liquidity tolerance,
 * dev staking/un-staking fees (% of protocol cut), protocol V2 reward cut
 * (% of total), and dev V2 reward cut (% of protocol cut).
 *
 * The page fetches the current protocol parameters from the LSDAdmin
 * contract and populates the form fields with the current values. The
 * admin can then modify the values and submit the form to update the
 * protocol parameters.
 *
 * @returns {React.ReactElement} The protocol setup page.
 */
const ProtocolSetupPage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  const { setupAdminContract, getLSDParams } = useTransaction();
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);
  const [warnings, setWarnings] = useState({
    stakingFees: '',
    unstakingFees: '',
    adminRewardCut: ''
  });

  const twoDecimalAndRangeValidation = z
    .string()
    .regex(/^(100(\.0{1,2})?|(\d{1,2}(\.\d{1,2})?))$/, {
      message: 'Value must be a number from 0 to 100 with up to two decimal places'
    })
    .refine(
      (value) => {
        const num = parseFloat(value);
        return num >= 0 && num <= 100;
      },
      { message: 'Value must be from 0 to 100' }
    );

  const ProtocolFormValidationSchema: ZodType = z.object({
    devAddress: z.string().regex(new RegExp(addressRegex), { message: 'Invalid Address' }),
    liquidityThreshold: twoDecimalAndRangeValidation,
    stakingFees: twoDecimalAndRangeValidation,
    unstakingFees: twoDecimalAndRangeValidation,
    liquidityTolerance: twoDecimalAndRangeValidation,
    devInvestmentFees: twoDecimalAndRangeValidation,
    adminRewardCut: twoDecimalAndRangeValidation,
    devRewardCut: twoDecimalAndRangeValidation,
    xdcRewardRate: z
      .string()
      .refine(
        (value) => /^-?\d+(\.\d{1,4})?$/.test(value),
        'Must be a valid number with up to 4 decimal places'
      )
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger
  } = useForm<ProtocolFormValues>({
    defaultValues: {
      v2_admin_contract_address: ethToXdcAddress(deployAddresses?.['ValidAdminModule#ValidAdmin']),
      staking_contract_address: ethToXdcAddress(deployAddresses?.['ValidAdminModule#stXDCToken']),
      protocol_owner_address: '',
      lsd_inventory_contract_address: ethToXdcAddress(
        deployAddresses?.['ValidAdminModule#LSDInventory']
      ),
      lsd_admin_contract_address: ethToXdcAddress(deployAddresses?.['ValidAdminModule#LSDAdmin']),
      devAddress: '',
      liquidityThreshold: '',
      stakingFees: '',
      unstakingFees: '',
      liquidityTolerance: '',
      devInvestmentFees: '',
      adminRewardCut: '',
      devRewardCut: '',
      xdcRewardRate: ''
    },
    resolver: zodResolver(ProtocolFormValidationSchema)
  });

  /**
   * Fetches the current protocol parameters from the LSDAdmin contract
   * and populates the form fields with the current values.
   */
  const getAllLSDParams = async () => {
    const response = await getLSDParams();
    const lsdParams = response?.[0]?.result as ProtocolContractValues;
    setValue('devAddress', ethToXdcAddress(lsdParams?.devAddress));
    setValue('protocol_owner_address', ethToXdcAddress(lsdParams?.adminAddress ?? ''));
    setValue(
      'liquidityThreshold',
      bigIntToPercent(BigInt(lsdParams?.liquidityThreshold))?.toString()
    );
    setValue('stakingFees', bigIntToPercent(BigInt(lsdParams?.stakingFees))?.toString());
    setValue('unstakingFees', bigIntToPercent(BigInt(lsdParams?.unstakingFees))?.toString());
    setValue(
      'liquidityTolerance',
      bigIntToPercent(BigInt(lsdParams?.liquidityTolerance))?.toString()
    );
    setValue(
      'devInvestmentFees',
      bigIntToPercent(BigInt(lsdParams?.devInvestmentFees))?.toString()
    );
    setValue('adminRewardCut', bigIntToPercent(BigInt(lsdParams?.adminRewardCut))?.toString());
    setValue('devRewardCut', bigIntToPercent(BigInt(lsdParams?.devRewardCut))?.toString());
    setValue('xdcRewardRate', convertFromWei(lsdParams?.xdcRewardRate));
  };

  useEffect(() => {
    if (wagmiConfig) {
      getAllLSDParams();
    }
  }, [wagmiConfig]); // Ensure dependencies are correct.

  /**
   * Submits the protocol form values to the contract.
   * @param data the form data
   */
  const onSubmit: SubmitHandler<ProtocolFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      const newData = {
        devAddress: xdcToEthAddress(data.devAddress),
        liquidityThreshold: percentToBigInt(parseFloat(data.liquidityThreshold)),
        stakingFees: percentToBigInt(parseFloat(data.stakingFees)),
        unstakingFees: percentToBigInt(parseFloat(data.unstakingFees)),
        liquidityTolerance: percentToBigInt(parseFloat(data.liquidityTolerance)),
        devRewardCut: percentToBigInt(parseFloat(data.devRewardCut)),
        adminRewardCut: percentToBigInt(parseFloat(data.adminRewardCut)),
        devInvestmentFees: percentToBigInt(parseFloat(data.devInvestmentFees)),
        xdcRewardRate: toWei(data.xdcRewardRate, 'ether')
      };
      await setupAdminContract(newData);
      toast.success('Protocol Setup Successfully');
    } catch (error) {
      console.error(error);
      throwErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = Number(value);

    // Reset warnings
    setWarnings((prevWarnings: Warnings) => ({
      ...prevWarnings,
      [field]: ''
    }));

    // Validate input and set warnings if needed
    if (field === 'stakingFees' && (numValue < 0 || numValue > 10)) {
      setWarnings((prevWarnings: Warnings) => ({
        ...prevWarnings,
        stakingFees: 'Note: Staking fees should be between 0 and 10.'
      }));
    }
    if (field === 'unstakingFees' && (numValue < 0 || numValue > 15)) {
      setWarnings((prevWarnings: Warnings) => ({
        ...prevWarnings,
        unstakingFees: 'Note: Unstaking fees should be between 0 and 15.'
      }));
    }
    if (field === 'adminRewardCut' && (numValue < 0 || numValue > 20)) {
      setWarnings((prevWarnings: Warnings) => ({
        ...prevWarnings,
        adminRewardCut: 'Note: Admin reward cut should be between 0 and 20.'
      }));
    }

    // Update the respective state
    if (field === 'stakingFees') setValue('stakingFees', value);
    if (field === 'unstakingFees') setValue('unstakingFees', value);
    if (field === 'adminRewardCut') setValue('adminRewardCut', value);
  };

  /**
   * Component for rendering a protocol form field.
   *
   * @param {string} fieldName The name of the field in the form.
   * @param {string} label The label to display above the field.
   * @param {string} [type=text] The type of the field.
   * @param {boolean} [readOnly=false] Whether the field is read-only or not.
   * @returns {React.ReactElement}
   */
  const ProtocolFormField: React.FC<ProtocolFormFieldProps> = ({
    fieldName,
    label,
    type = 'text',
    readOnly = false // Default is not read-only
  }) => {
    return (
      <Grid
        item
        lg={6}
        md={6}
        xs={12}
        sm={12}
        display="flex"
        justifyContent="center"
        alignItems="start"
        flexDirection="column"
      >
        <FormLabel>{label}</FormLabel>
        <TextField
          sx={{ mt: 1.5 }}
          fullWidth
          size="small"
          {...register(fieldName as keyof ProtocolFormValues)}
          autoComplete="off"
          type={type}
          inputProps={{ readOnly }}
        />
      </Grid>
    );
  };

  return (
    <Page title="Protocol Set up">
      <Container
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Grid
              container
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
              sx={{ width: '100%' }}
            >
              <ProtocolFormField
                label="V2 Admin Contract Address"
                readOnly={true}
                fieldName="v2_admin_contract_address"
              />
              <ProtocolFormField
                label="Staking Contract Address"
                type="text"
                readOnly={true}
                fieldName="staking_contract_address"
              />
              <ProtocolFormField
                label="Protocol Owner Address"
                type="text"
                readOnly={true}
                fieldName="protocol_owner_address"
              />
              <ProtocolFormField
                label="LSD Inventory Contract Address"
                type="text"
                readOnly={true}
                fieldName="lsd_inventory_contract_address"
              />
              <ProtocolFormField
                label="LSD Admin Contract Address"
                type="text"
                readOnly={true}
                fieldName="lsd_admin_contract_address"
              />
            </Grid>
          </Box>
          <Divider color="#454545" variant="fullWidth" sx={{ borderBottomWidth: 1, my: 4 }} />
          <Box display="flex" justifyContent="center" alignItems="center">
            <Grid
              container
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
              sx={{ width: '100%' }}
            >
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Dev Address</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('devAddress')}
                  autoComplete="off"
                  type="text"
                  error={errors.devAddress !== undefined}
                  helperText={errors.devAddress?.message}
                />
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Liquidity Threshold</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('liquidityThreshold')}
                  autoComplete="off"
                  type="text"
                  error={errors.liquidityThreshold !== undefined}
                  helperText={errors.liquidityThreshold?.message}
                />
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Protocol Staking Fees (%)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('stakingFees')}
                  autoComplete="off"
                  type="text"
                  onChange={(e) => {
                    handleInputChange('stakingFees', e.target.value);
                    trigger('stakingFees');
                  }}
                  error={errors.stakingFees !== undefined}
                  helperText={errors.stakingFees?.message}
                />

                {!Boolean(errors?.stakingFees) && warnings.stakingFees && (
                  <Typography color="warning.main" variant="body2">
                    {warnings.stakingFees}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Protocol Un-Staking Fees (%)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('unstakingFees')}
                  autoComplete="off"
                  type="text"
                  onChange={(e) => {
                    handleInputChange('unstakingFees', e.target.value);
                    trigger('unstakingFees');
                  }}
                  error={errors.unstakingFees !== undefined}
                  helperText={errors.unstakingFees?.message}
                />
                {!Boolean(errors?.unstakingFees) && warnings.unstakingFees && (
                  <Typography color="warning.main" variant="body2">
                    {warnings.unstakingFees}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Liquidity Tolerance (%)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('liquidityTolerance')}
                  autoComplete="off"
                  type="text"
                  error={errors.liquidityTolerance !== undefined}
                  helperText={errors.liquidityTolerance?.message}
                />
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Dev Staking/Un-Staking Fees (% of Protocol Cut)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('devInvestmentFees')}
                  autoComplete="off"
                  type="text"
                  error={errors.devInvestmentFees !== undefined}
                  helperText={errors.devInvestmentFees?.message}
                />
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Protocol V2 Reward Cut (%)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('adminRewardCut')}
                  autoComplete="off"
                  type="text"
                  onChange={(e) => {
                    handleInputChange('adminRewardCut', e.target.value);
                    trigger('adminRewardCut');
                  }}
                  error={errors.adminRewardCut !== undefined}
                  helperText={errors.adminRewardCut?.message}
                />
                {!Boolean(errors?.adminRewardCut) && warnings.adminRewardCut && (
                  <Typography color="warning.main" variant="body2">
                    {warnings.adminRewardCut}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Dev V2 Reward Cut (% of Protocol Cut)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('devRewardCut')}
                  autoComplete="off"
                  type="text"
                  error={errors.devRewardCut !== undefined}
                  helperText={errors.devRewardCut?.message}
                />
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                display="flex"
                justifyContent="center"
                alignItems="start"
                flexDirection="column"
              >
                <FormLabel>Investor Reward (XDC)</FormLabel>
                <TextField
                  sx={{ mt: 1.5 }}
                  fullWidth
                  size="small"
                  {...register('xdcRewardRate')}
                  autoComplete="off"
                  type="text"
                  error={errors.xdcRewardRate !== undefined}
                  helperText={errors.xdcRewardRate?.message}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 5 }} display="flex" justifyContent="space-between" alignItems="center">
            <BackButton />
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Button
                variant="contained"
                sx={{
                  mr: 2
                }}
                onClick={() => {
                  navigate('/admin/protocol-earnings');
                }}
              >
                View Protocol Earnings
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loadingPosition="start"
                loading={isSubmitting}
                sx={{
                  '&.MuiLoadingButton-loading': {
                    backgroundColor: '#424347'
                  },

                  '& .MuiCircularProgress-root': {
                    color: '#000000',
                    marginRight: '20px'
                  }
                }}
              >
                Update
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </Container>
      <Divider color="#454545" variant="fullWidth" sx={{ borderBottomWidth: 1, my: 4 }} />
      <ProtocolUpdates />
    </Page>
  );
};

export default ProtocolSetupPage;
