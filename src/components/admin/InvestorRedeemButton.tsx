import { useMemo, useState } from 'react';
import { Address, NodeToken } from '../../types';
import useWebStore from '../../store/useWebStore';
import useAppStore from '../../store/useAppStore';
import AdminRedeemModal from './AdminRedeemModal';
import { throwErrorMessage } from '../../helpers/errors';
import WithdrawConfirmationModal from './WithdrawConfirmationModal';
import useTransaction from '../../store/hooks/useTransaction';
import { arrayToDictForToken } from '../../helpers/text';
import { LoadingButton } from '@mui/lab';

interface InvestorRedeemButtonProps {
  node: NodeToken;
  fetchAllData: () => Promise<void>;
}

const InvestorRedeemButton = ({ node, fetchAllData }: InvestorRedeemButtonProps) => {
  const account = useWebStore((state) => state.account);
  // const wagmiConfig = useWebStore((state) => state.wagmiConfig);

  const {
    fetchRedemptionOpenStatus,
    allTokensQuery,
    allTokenInvestors = { nodes: [] }
  } = useAppStore();

  const [selectedNode, setSelectedNode] = useState<NodeToken | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { withdrawFunds } = useTransaction();

  const nodesDict = useMemo(
    () => arrayToDictForToken(allTokenInvestors?.nodes, 'name'),
    [allTokenInvestors]
  );

  const [openRedeem, setRedeemOpen] = useState(false);
  const handleRedeemOpen = (node: NodeToken) => {
    if (allTokensQuery) {
      const nodeAddress = (allTokensQuery[node?.name]?.nodeAddress as Address) ?? undefined;
      const tokenAddress = (allTokensQuery[node?.name]?.tokenAddress as Address) ?? undefined;
      const inventoryBalance = nodesDict[node?.name]?.amount;
      setSelectedNode({ ...node, nodeAddress, tokenAddress, inventoryBalance });
      setRedeemOpen(true);
    }
  };

  const handleCloseRedeem = () => {
    setRedeemOpen(false);
    setSelectedNode(null);
  };

  const redemptionWindowStatus = node ? node.redemption_window_status : 'N/A';

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleWithdraw = async () => {
    setModalOpen(false);
    try {
      setIsSubmitting(true);
      const nodeAddress = (allTokensQuery[node?.name]?.nodeAddress as Address) ?? undefined;
      await withdrawFunds(nodeAddress);
    } catch (error) {
      console.log(error);
      throwErrorMessage(error);
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
    }
  };

  console.log('node111111', node);

  const handleRedeem = async () => {
    try {
      setIsSubmitting(true);

      if (node?.node_status?.status === 'CLOSED') {
        handleButtonClick();
      }
      if (redemptionWindowStatus === 'OPEN') {
        if (node?.unclaimed_rewards !== '0') {
          throw Error('Claim Pending Rewards!');
        }
        if (account) {
          const redemptionStatus = await fetchRedemptionOpenStatus(account, node?._id);
          const status = redemptionStatus?.redemptionOpen ?? null;
          if (status) {
            throw Error('Previous request still processing. Please wait.');
          }
        }
        handleRedeemOpen(node);
      }
    } catch (error) {
      throwErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LoadingButton
        variant="outlined"
        size="small"
        loadingPosition="start"
        loading={isSubmitting}
        onClick={() => {
          handleRedeem();
        }}
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
        Redeem
      </LoadingButton>
      <AdminRedeemModal
        fetchData={fetchAllData}
        open={openRedeem}
        onClose={handleCloseRedeem}
        node={selectedNode}
      />
      <WithdrawConfirmationModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleWithdraw}
      />
    </>
  );
};

export default InvestorRedeemButton;
