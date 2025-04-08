import Page from '../../components/defaults/Page';
import { Box, Button, Container, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useTransaction from '../../store/hooks/useTransaction';
import { useEffect, useState } from 'react';
import { convertFromWei, formatFloat } from '../../helpers/text';
import useWebStore from '../../store/useWebStore';
import { InventoryData } from '../../types';

const STXDCValuationPage = () => {
  const navigate = useNavigate();
  const { getProtocolInventoryDetails } = useTransaction();
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);

  const [inventoryDetails, setInventoryDetails] = useState<InventoryData | null>(null);

  const fetchAllInventoryDetails = async () => {
    const protocolInventoryDetails = await getProtocolInventoryDetails();
    const inventoryDetails = protocolInventoryDetails?.[0]?.result as InventoryData;
    setInventoryDetails(inventoryDetails);
  };

  const fetchAllData = async () => {
    await fetchAllInventoryDetails();
  };

  useEffect(() => {
    fetchAllData();
  }, [wagmiConfig]);

  const valuationData = [
    {
      id: '1',
      label: 'Protocol Inventory Balance (XDC)',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.protocolInvnentoryBalance?.toString() ?? '0')),
        5
      )
    },
    {
      id: '2',
      label: 'Inventory Contract Free XDC Balance',
      value: formatFloat(
        parseFloat(
          convertFromWei(inventoryDetails?.inventoryProtocolFreeBalance?.toString() ?? '0')
        ),
        5
      )
    },
    {
      id: '3',
      label: 'Inventory Contract Node Token Holding',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.nodeTokenHolding?.toString() ?? '0')),
        5
      )
    },
    {
      id: '4',
      label: 'Staking Contract Balance (XDC)',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.stakingContractBalance?.toString() ?? '0')),
        5
      )
    },
    {
      id: '5',
      label: 'Accrued Reward on Node Holdings',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.protocolRewardsAccrued?.toString() ?? '0')),
        5
      )
    },
    {
      id: '6',
      label: 'Total stXDC Supply',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.stXDCSupply?.toString() ?? '0')),
        5
      )
    },
    {
      id: '7',
      label: 'stXDC Fair Value',
      value: formatFloat(
        parseFloat(convertFromWei(inventoryDetails?.stXDCValue?.toString() ?? '0')),
        5
      )
    }
  ];

  return (
    <Page title="stXDC Valuation">
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
          {valuationData?.map((item) => (
            <Grid
              item
              lg={6}
              md={6}
              xs={12}
              sm={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
                key={item?.id}
                label={item?.label}
                variant="filled"
                value={item?.value}
              />
            </Grid>
          ))}
        </Grid>
        <Box gap={2} display="flex" justifyContent="flex-end" alignItems="center" sx={{ my: 4 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            BACK
          </Button>
        </Box>
      </Container>
    </Page>
  );
};

export default STXDCValuationPage;
