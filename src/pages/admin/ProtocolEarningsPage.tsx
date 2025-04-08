import { useEffect, useMemo, useState } from 'react';
import Page from '../../components/defaults/Page';
import { Box, Button, Typography } from '@mui/material';
import BackButton from '../../components/core/BackButton';
import HeaderTable from '../../components/core/HeaderTable';
import ViewProtocolTransactions from '../../components/admin/ViewProtocolTransactions';
import MenuButton from '../../components/core/MenuButton';
import DateRangePickerField from '../../components/core/fields/DateRangePickerField';
import useAppStore from '../../store/useAppStore';
import { convertFromWei, formatFloat, toEpoch } from '../../helpers/text';
import useWebStore from '../../store/useWebStore';

const ProtocolEarningsPage = () => {
  const today = new Date();
  const previousYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);
  const [deploymentCostMonthUSD, setDeploymentCostMonthUSD] = useState('');
  const [xdcToUSDRate, setXdcToUSDRate] = useState('');
  const [start, setStart] = useState<Date | null>(previousYear);
  const [end, setEnd] = useState<Date | null>(today);
  const [numberOfMonths, setNumberOfMonths] = useState(0);

  const {
    fetchAppConfigByKey,
    fetchAllLSDFeesAndRewardsByDates,
    allLSDFeesAndRewardsByDates = []
  } = useAppStore();

  const fetchAllAppConfig = async () => {
    const resDeploymentCostMonthUSD = await fetchAppConfigByKey('DEPLOYMENT_COST_MONTH_USD');
    setDeploymentCostMonthUSD(resDeploymentCostMonthUSD ?? '');
    const resXdcToUSDRate = await fetchAppConfigByKey('XDC_TO_USD_RATE');
    setXdcToUSDRate(resXdcToUSDRate ?? '');
  };

  const calculateMonths = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      const diffInMilliseconds = endDate.getTime() - startDate.getTime();
      const millisecondsInMonth = 1000 * 60 * 60 * 24 * 30.4375; // Average days in a month
      return Math.ceil(diffInMilliseconds / millisecondsInMonth); // Or Math.floor for rounding down
    }
    return 0;
  };

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStart(startDate);
    setEnd(endDate);

    // Calculate and set number of months
    const months = calculateMonths(startDate, endDate);
    setNumberOfMonths(months);
  };

  const handleFilterClick = async () => {
    if (start && end) {
      const startTimestamp = String(toEpoch(start));
      const endTimestamp = String(toEpoch(end));
      await fetchAllLSDFeesAndRewardsByDates(startTimestamp, endTimestamp);
    }
  };

  const fetchAllData = async () => {
    await fetchAllAppConfig();
    await fetchAllLSDFeesAndRewardsByDates(String(toEpoch(start)), String(toEpoch(end)));
    const months = calculateMonths(start, end);
    setNumberOfMonths(months);
  };

  useEffect(() => {
    fetchAllData();
  }, [wagmiConfig]);

  const totalAmount = useMemo(() => {
    return (
      allLSDFeesAndRewardsByDates?.reduce((total, node) => {
        return total + BigInt(node.totalAmount?.toString());
      }, BigInt(0)) || BigInt(0)
    );
  }, [allLSDFeesAndRewardsByDates]);

  const tempData = [
    {
      header: 'No of Month',
      value: numberOfMonths // Dynamically set the number of months
    },
    {
      header: 'Deployment cost / month (USD)',
      value: deploymentCostMonthUSD
    },
    {
      header: 'Deployment cost (USD)',
      value: numberOfMonths * parseFloat(deploymentCostMonthUSD || '0') // Calculate total cost
    },
    {
      header: 'XDC to USD rate',
      value: xdcToUSDRate
    },
    {
      header: 'Deployment cost (XDC)',
      value: parseFloat(deploymentCostMonthUSD || '0') * parseFloat(xdcToUSDRate || '0')
    },
    {
      header: 'Total Earning (XDC)',
      value: formatFloat(parseFloat(convertFromWei(totalAmount?.toString())), 5)
    },
    {
      header: 'P&L (XDC)',
      value: formatFloat(
        parseFloat(convertFromWei(totalAmount?.toString())) -
          (parseFloat(deploymentCostMonthUSD || '0') * parseFloat(xdcToUSDRate || '0') || 0),
        5
      )
    }
  ];

  const renderMenuContent = (handleClose: () => void) => {
    return (
      <Box>
        <DateRangePickerField
          label="Date Filter"
          start={start}
          end={end}
          onDateChange={handleDateChange ?? (() => {})}
        />
        <Button
          onClick={() => {
            handleFilterClick?.();
            handleClose();
          }}
        >
          Submit
        </Button>
      </Box>
    );
  };

  return (
    <Page marginX={1} marginTop={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}
        >
          Protocol Earnings Summary
        </Typography>
        <MenuButton menuContent={renderMenuContent} buttonAriaLabel="Date Filter" />
      </Box>
      <HeaderTable data={tempData} />
      <ViewProtocolTransactions node={allLSDFeesAndRewardsByDates} fetchAllData={fetchAllData} />
      <Box display="flex" justifyContent="flex-end">
        <BackButton />
      </Box>
    </Page>
  );
};

export default ProtocolEarningsPage;
