import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import Tanstacktable from '../tables/Tanstacktable';
import AddressFieldTools from '../core/AddressFieldTools';
import { LSDFeesAndRewardsNode } from '../../types';
import { Ellipsis } from '../../helpers/textHandler';
import { format } from 'date-fns';
import { convertFromWei, formatFloat } from '../../helpers/text';

interface Props {
  node: LSDFeesAndRewardsNode[];
  fetchAllData: () => void;
}

const ViewProtocolTransactions = ({ node, fetchAllData }: Props) => {
  const columns = useMemo(
    () => [
      {
        header: 'Transaction Date',
        accessorKey: 'createdAt',
        cell: (row: { getValue: () => string }) => {
          const formattedDate = format(new Date(Number(row?.getValue()) * 1000), 'dd MMM yyyy');
          return Ellipsis(formattedDate, '5rem', { title: formattedDate });
        }
      },

      {
        header: 'Withdrawal Amount (XDC)',
        accessorKey: 'totalAmount',
        cell: (row: { getValue: () => string }) => {
          return (
            <Typography>{formatFloat(parseFloat(convertFromWei(row.getValue())), 5)}</Typography>
          );
        }
      },

      {
        header: 'Dev Cut',
        accessorKey: '',
        cell: ({ row }: { row: { original: LSDFeesAndRewardsNode } }) => {
          const { original } = row;
          const devCut = Number(original?.devFeesAccrued) + Number(original?.devRewardAccrued);
          return (
            <Typography>
              {formatFloat(parseFloat(convertFromWei(devCut?.toString())), 5)}
            </Typography>
          );
        }
      },
      {
        header: 'Net Protocol Fees',
        accessorKey: '',
        cell: ({ row }: { row: { original: LSDFeesAndRewardsNode } }) => {
          const { original } = row;
          const devCut = Number(original?.devFeesAccrued) + Number(original?.devRewardAccrued);
          return (
            <Typography>
              {formatFloat(parseFloat(convertFromWei(devCut?.toString())), 5)}
            </Typography>
          );
        }
      },
      {
        header: 'Transaction Reference',
        accessorKey: 'id',
        cell: (row: { getValue: () => string }) => {
          return (
            <Box sx={{ color: '#ffffff' }}>
              {typeof row === 'object' && row !== null && 'getValue' in row && (
                <>
                  {row ? (
                    <AddressFieldTools
                      address={row.getValue()}
                      showCopyButton
                      showInBlockExplorer
                    />
                  ) : (
                    ''
                  )}
                </>
              )}
            </Box>
          );
        }
      }
    ],
    []
  );

  return (
    <Box marginTop={8}>
      <Box display="flex" justifyContent="start" alignItems="center">
        <Typography fontSize="1.75rem" color="#DEE2EE" gutterBottom>
          Protocol Reward Withdrawal Transactions
        </Typography>
      </Box>

      <Tanstacktable
        data={node ?? []}
        columns={columns}
        rowSize={5}
        showSearchField={false}
        refreshFunction={fetchAllData}
      />
    </Box>
  );
};

export default ViewProtocolTransactions;
