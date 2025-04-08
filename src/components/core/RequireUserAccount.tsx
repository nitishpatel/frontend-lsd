import { xdcToEthAddress } from '../../helpers/text';
import useAuthStore from '../../store/useAuthStore';
import useWebStore from '../../store/useWebStore';

const RequireUserXinFinAccount = ({
  children,
  not = true
}: {
  children: JSX.Element | JSX.Element[];
  not?: boolean;
}) => {
  const { account } = useWebStore();
  const { user } = useAuthStore();

  const walletAddress = user !== null ? user?.wallet_address?.toLowerCase() : null;
  const connectedAccount = account?.toLowerCase();
  const condition =
    walletAddress === null
      ? false
      : !connectedAccount || xdcToEthAddress(connectedAccount) === walletAddress
      ? xdcToEthAddress(walletAddress as string)
      : false;
  const show = not ? !condition : condition;

  return show ? children : null;
};

export default RequireUserXinFinAccount;
