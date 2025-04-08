import { useConnectWallet } from '@web3-onboard/react';
import useWebStore from '../../store/useWebStore';

type Props = {
  children: JSX.Element;
  not?: boolean;
};
const WalletRequire = ({ children, not }: Props) => {
  const { account } = useWebStore();
  const [{ wallet }] = useConnectWallet();

  const condition = account && wallet;
  const show = not ? !condition : condition;

  return show ? children : null;
};

export default WalletRequire;
