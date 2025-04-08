import { Box, Button, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Ellipsis } from '../../helpers/textHandler';
import Tanstacktable from '../../components/tables/Tanstacktable';
import CountdownTimer from '../../components/investor/CountdownTImer';
import AddressFieldTools from '../../components/core/AddressFieldTools';
import { BorderLinearProgress } from '../../components/core/BorderLinearProgress';
import Page from '../../components/defaults/Page';
import BackButton from '../../components/core/BackButton';
import useAppStore from '../../store/useAppStore';
import useWebStore from '../../store/useWebStore';
import { Address, NodeToken, TokenQuery } from '../../types';
import AdminStakeModal from '../../components/admin/AdminStakeModal';
import AdminClaimRewardsModal from '../../components/admin/AdminClaimRewardsModal';
import { fromWei, toBigInt, toChecksumAddress } from 'web3-utils';
import { arrayToDictForToken, checksumAddress } from '../../helpers/text';
import useTransaction from '../../store/hooks/useTransaction';
import deployedAddresses from '../../abis/deployed_addresses.json';
import InvestorRedeemButton from '../../components/admin/InvestorRedeemButton';

// Define a type for the node
interface Node {
  name: string;
  max_supply: number;
  symbol: string;
}

const ValidStakingPage = () => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const { account, wagmiConfig } = useWebStore();
  const [openStake, setStakeOpen] = useState(false);

  const [openClaim, setClaimOpen] = useState(false);
  const [data, setData] = useState<(Node & { nodeAddress?: string })[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeToken | null>();
  const today = new Date();

  const {
    fetchAllNodeTokens,
    fetchAllTokenQuery,
    allNodeTokens = [],
    allTokensQuery = {} as Record<string, TokenQuery>,
    allTokenInvestors = { nodes: [] },
    fetchAllTokenInvestorsByAddress
  } = useAppStore();

  const fetchAllData = async () => {
    await fetchAllNodeTokens('LSD');
    await fetchAllTokenQuery();
    await fetchAllTokenInvestorsByAddress(
      `${checksumAddress(deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address)}`
    );
  };

  useEffect(() => {
    fetchAllData();
  }, [account, wagmiConfig]);

  const nodesDict = useMemo(
    () => arrayToDictForToken(allTokenInvestors?.nodes, 'name'),
    [allTokenInvestors]
  );

  /**
   * Handle opening the stake modal
   * @param node The node to stake
   */
  const handleStakeOpen = (node: NodeToken) => {
    if (allTokensQuery) {
      const nodeAddress = (allTokensQuery[node.name]?.nodeAddress as Address) ?? undefined;
      const currentSupply = allTokensQuery[node.name]?.currentSupply ?? 0;
      const calculatedMaxSupply =
        Number(node.max_supply) + Number(allTokensQuery[node.name]?.redeemSupply);
      setSelectedNode({ ...node, nodeAddress, calculatedMaxSupply, currentSupply });
      setStakeOpen(true);
    }
  };

  /**
   * Handle closing the stake modal
   */

  const handleCloseStake = () => {
    setStakeOpen(false);
    setSelectedNode(null);
  };

  const handleClaimOpen = (node: NodeToken) => {
    if (allTokensQuery) {
      const nodeAddress = (allTokensQuery[node?.name]?.nodeAddress as Address) ?? undefined;
      const tokenAddress = (allTokensQuery[node?.name]?.tokenAddress as Address) ?? undefined;
      const inventoryBalance = nodesDict[node?.name]?.amount;
      setSelectedNode({ ...node, nodeAddress, tokenAddress, inventoryBalance });
      setClaimOpen(true);
    }
  };

  const handleCloseClaim = () => {
    setClaimOpen(false);
    setSelectedNode(null);
  };

  const { getUnclaimedRewards } = useTransaction();

  const updateData = async () => {
    const _rows = await Promise.all(
      allNodeTokens.map(async (row) => {
        const nodeAddress = allTokensQuery[row?.name]?.nodeAddress as Address;
        const condition = await getUnclaimedRewards(nodeAddress);
        if (condition?.[0].status === 'failure') {
          return row;
        }
        const unclaimedAmount =
          condition?.[0].result === 0n ? 0 : fromWei(toBigInt(condition?.[0]?.result), 'ether');

        row.unclaimed_rewards = `${unclaimedAmount}`;
        return row;
      })
    );
    setData(_rows);
  };

  useEffect(() => {
    updateData();
  }, [allTokenInvestors.nodes, allNodeTokens, wagmiConfig, account]);

  const isButtonDisabled = (
    account: Address | null,
    token: NodeToken,
    maxSupply: number,
    today: Date,
    subscriptionEndDate: Date,
    allTokensQuery: Record<string, TokenQuery>
  ): boolean => {
    if (
      account &&
      toChecksumAddress(`${account}`) === toChecksumAddress(token?.anchor?.anchor_address)
    ) {
      return true;
    } else if (Number(allTokensQuery[token?.name]?.currentSupply) === maxSupply) {
      return true;
    } else if (today.getTime() > subscriptionEndDate.getTime()) {
      return true;
    } else if (!allTokensQuery[token?.name]?.anchorInvested) {
      return true;
    } else {
      return false;
    }
  };

  // Define table columns
  const columns = useMemo(() => {
    return [
      {
        header: 'Node Name',
        accessorKey: 'name',
        size: 1000,
        cell: (row: { getValue: () => string }) =>
          Ellipsis(row?.getValue(), '8rem', { title: row?.getValue() })
      },
      {
        header: 'Symbol',
        accessorKey: 'symbol',
        cell: (row: { getValue: () => string }) =>
          Ellipsis(row?.getValue(), '8rem', { title: row?.getValue() })
      },

      {
        header: 'Node Space Available',
        accessorKey: '',
        cell: (info: { row: { original: NodeToken } }) => {
          const token = info.row.original;
          const maxSupply =
            Number(token?.max_supply) + Number(allTokensQuery[token.name]?.redeemSupply);
          return (
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Typography sx={{ fontSize: '0.7rem' }}>
                {allTokensQuery[token.name]?.currentSupply?.toString() ?? 0} /{maxSupply}
              </Typography>
              <Grid sx={{ display: 'flex' }}>
                <BorderLinearProgress
                  variant="determinate"
                  value={
                    100 -
                    Math.round(
                      Number(100) -
                        (Number(allTokensQuery[token.name]?.currentSupply ?? 0) / maxSupply) *
                          Number(100)
                    )
                  }
                />
              </Grid>
            </Box>
          );
        }
      },
      {
        header: 'Subscription Closure(Days)',
        accessorKey: 'name',
        size: 1000,
        cell: (row: { getValue: () => string }) => {
          const subscriptionEndDate = new Date(
            Number(allTokensQuery[row?.getValue()]?.subscriptionEndDate) * 1000
          );
          return (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CountdownTimer maturityDate={subscriptionEndDate} showDay />
            </Box>
          );
        }
      },
      {
        header: 'Node Address',
        accessorKey: 'name',
        cell: (row: { getValue: () => string }) => {
          return (
            <Box sx={{ color: '#ffffff' }}>
              {typeof row === 'object' && row !== null && 'getValue' in row && (
                <>
                  {allTokensQuery[row.getValue()]?.nodeAddress ? (
                    <AddressFieldTools
                      address={allTokensQuery[row.getValue()]?.nodeAddress}
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
      },
      {
        header: 'Inventory Balance',
        accessorKey: 'name',
        cell: (row: { getValue: () => string }) => {
          const inventoryBalance = nodesDict[row?.getValue()]?.amount ?? 'N/A';

          return Ellipsis(inventoryBalance, '8rem', { title: inventoryBalance });
        }
      },
      {
        header: 'Unclaimed Reward',
        accessorKey: 'unclaimed_rewards',
        cell: (row: { getValue: () => string }) => {
          const unclaimedAmount = row?.getValue();
          return Ellipsis(unclaimedAmount, '8rem', { title: unclaimedAmount });
        }
      },
      {
        header: 'Action',
        accessorKey: 'actions',
        cell: (info: { row: { original: NodeToken } }) => {
          const node = info.row.original;
          const name = node.name;
          const subscriptionEndDate = new Date(
            Number(allTokensQuery[name]?.subscriptionEndDate) * 1000
          );
          const maxSupply = Number(node?.max_supply) + Number(allTokensQuery[name]?.redeemSupply);
          const redemptionWindowStatus = node?.redemption_window_status;
          return (
            <Box display="flex" justifyContent="end" alignItems="center" gap={2}>
              {(redemptionWindowStatus === 'OPEN' || node?.node_status?.status === 'CLOSED') && (
                <InvestorRedeemButton node={node} fetchAllData={fetchAllData} />
              )}
              <Button
                size="small"
                variant="outlined"
                disabled={isButtonDisabled(
                  account,
                  node,
                  maxSupply,
                  today,
                  subscriptionEndDate,
                  allTokensQuery
                )}
                onClick={() => {
                  handleStakeOpen(node);
                }}
              >
                Stake
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  handleClaimOpen(node);
                }}
                disabled={node?.unclaimed_rewards === '0'}
                sx={{
                  width: '9.375rem',
                  '&.MuiLoadingButton-loading': {
                    backgroundColor: '#424347'
                  },
                  '& .MuiCircularProgress-root': {
                    color: '#000000'
                  }
                }}
              >
                Claim Rewards
              </Button>
            </Box>
          );
        },
        filterFn: 'includesString'
      }
    ];
  }, [allTokenInvestors.nodes, allNodeTokens, allTokensQuery, data]);

  return (
    <Page title="V2 Nodes">
      <Tanstacktable
        columns={columns}
        data={Array.isArray(allTokenInvestors.nodes) ? data : []}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rowSize={5}
        refreshFunction={fetchAllData}
      />
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <BackButton />
      </Box>
      <AdminStakeModal
        fetchData={fetchAllData}
        open={openStake}
        handleClose={handleCloseStake}
        node={selectedNode}
      />
      <AdminClaimRewardsModal
        fetchData={fetchAllData}
        open={openClaim}
        handleClose={handleCloseClaim}
        row={selectedNode}
      />
    </Page>
  );
};

export default ValidStakingPage;
