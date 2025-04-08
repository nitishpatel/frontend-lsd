import { Alert, AlertTitle } from '@mui/material';
import WalletRequire from './WalletRequire';
import Overlay from './Overlay';

const WalletRequireOverlay = () => {
  return (
    <WalletRequire not>
      <>
        <Overlay show />
        <Alert
          severity="warning"
          sx={{
            position: 'fixed',
            top: '40vh',
            left: 'calc(50vw - 550px / 2)',
            'z-index': 3,
            width: '450px'
          }}
        >
          <AlertTitle>Connect Wallet</AlertTitle>
          Please Connect to the Wallet
        </Alert>
      </>
    </WalletRequire>
  );
};

export default WalletRequireOverlay;
