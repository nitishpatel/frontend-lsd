import { Alert, AlertTitle, Box } from '@mui/material';

import Overlay from './Overlay';
import RequireUserXinFinAccount from './RequireUserAccount';

const UserWalletRequireOverlay = () => {
  return (
    <RequireUserXinFinAccount not>
      <Overlay show>
        <Box
          sx={{
            height: '60vh',
            width: '100%',
            display: 'flex',
            position: 'fixed',
            scrollSnapStop: 'unset',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Alert severity="warning">
            <AlertTitle>Wrong address</AlertTitle>
            {/* The wallet is connected to {account},which is not linked to logged in user account. */}
            The current wallet address is not linked to logged in user account.
          </Alert>
        </Box>
      </Overlay>
    </RequireUserXinFinAccount>
  );
};

export default UserWalletRequireOverlay;
