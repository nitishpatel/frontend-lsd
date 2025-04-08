import React, { useEffect } from 'react';
import Page from '../../components/defaults/Page';
import { Box, Button, Container, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddLiquidityModal from '../../components/admin/AddLiquidityModal';
import useTransaction from '../../store/hooks/useTransaction';
import useWebStore from '../../store/useWebStore';
import { bigIntToPercent, convertFromWei, ethToXdcAddress, formatFloat } from '../../helpers/text';
import { InventoryData } from '../../types';
import deployAddresses from '../../abis/deployed_addresses.json';

const ProtocolInventoryPage = () => {
  const navigate = useNavigate();
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { getProtocolInventoryDetails } = useTransaction();
  const [inventoryDetails, setInventoryDetails] = React.useState<InventoryData | null>(null);

  const fetchAllInventoryDetails = async () => {
    const protocolInventoryDetails = await getProtocolInventoryDetails();
    const inventoryDetails = protocolInventoryDetails?.[0]?.result as InventoryData;
    setInventoryDetails(inventoryDetails);
  };

  useEffect(() => {
    fetchAllInventoryDetails();
  }, [wagmiConfig]);

  const inventoryData = [
    {
      id: '1',
      label: 'Protocol Inventory Address',
      value: ethToXdcAddress(deployAddresses?.['ValidAdminModule#LSDInventory'])
    },
    {
      id: '2',
      label: 'Staking Contract Balance (XDC)',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.stakingContractBalance?.toString() ?? '0')),
        5
      )
    },
    {
      id: '3',
      label: 'Protocol Inventory Balance (XDC)',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.protocolInvnentoryBalance?.toString() ?? '0')),
        5
      )
    },
    {
      id: '4',
      label: 'Liquidity Threshold (% of total stXDC)',
      value: bigIntToPercent(inventoryDetails?.liquidityThresholdPercent ?? BigInt(0)) ?? '0'
    },
    {
      id: '5',
      label: 'Total stXDC in circulation',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.stXDCSupply?.toString() ?? '0')),
        5
      )
    },
    {
      id: '6',
      label: 'Protocol Accrued Rewards',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.protocolRewardsAccrued?.toString() ?? '0')),
        5
      )
    },
    {
      id: '7',
      label: 'Protocol Node Token Holding',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.nodeTokenHolding?.toString() ?? '0')),
        5
      )
    },
    {
      id: '8',
      label: 'Liquidity Tolerance (%)',
      value: bigIntToPercent(inventoryDetails?.liquidityTolerancePercent ?? BigInt(0)) ?? '0'
    },
    {
      id: '9',
      label: 'Inventory Protocol Free Balance',
      value: formatFloat(
        parseFloat(
          convertFromWei(inventoryDetails?.inventoryProtocolFreeBalance?.toString() ?? '0')
        ),
        5
      )
    },
    {
      id: '10',
      label: 'stXDC Value',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.stXDCValue?.toString() ?? '0'))
      )
    },
    {
      id: '11',
      label: 'V2 Resignation Proceeds',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.v2ResignationProceeds?.toString() ?? '0'))
      )
    },
    {
      id: '12',
      label: 'V2 Rewards Received',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.v2RewardsReceived?.toString() ?? '0'))
      )
    }
  ];

  return (
    <Page title="Protocol Inventory">
      <Container
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
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
          {inventoryData.map((item) => (
            <Grid
              item
              lg={6}
              md={6}
              xs={12}
              sm={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              key={item.id}
            >
              <TextField
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
                label={item.label}
                variant="filled"
                value={item.value}
              />
            </Grid>
          ))}
        </Grid>
        <Box gap={2} display="flex" justifyContent="center" alignItems="center" sx={{ my: 4 }}>
          <Button variant="outlined" onClick={() => navigate('/admin/protocol-earnings')}>
            Protocol Earnings
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              handleOpen();
            }}
          >
            Add Liquidity
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigate('/admin/distribute-dev-reward');
            }}
          >
            Withdraw Fees
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/stxdc-valuation')}>
            Calculate stXDC Value
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigate('/admin/valid-staking');
            }}
          >
            Stake
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Container>

      <AddLiquidityModal
        open={open}
        onClose={handleClose}
        inventoryDetails={inventoryDetails}
        fetchAllInventoryDetails={fetchAllInventoryDetails}
      />
    </Page>
  );
};

export default ProtocolInventoryPage;
