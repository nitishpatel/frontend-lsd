import { IconButton, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  checksumAddress,
  ethToXdcAddress,
  formatAddressShort,
  xdcToEthAddress
} from '../../helpers/text';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useWebStore from '../../store/useWebStore';
import { Address } from '../../types';

interface AddressFieldToolsProps {
  address: string;
  showAddress?: boolean;
  showCopyButton?: boolean;
  showInBlockExplorer?: boolean;
  withBackground?: boolean;
}

const AddressFieldTools = ({
  address,
  showAddress = true,
  showCopyButton = false,
  showInBlockExplorer = false,
  withBackground = false
}: AddressFieldToolsProps) => {
  const { chainId } = useWebStore();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        m: 0,
        p: 0,
        alignItems: 'center'
      }}
    >
      {showAddress && (
        <Box
          sx={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          {ethToXdcAddress(formatAddressShort(address as Address))}
        </Box>
      )}
      {showCopyButton && (
        <IconButton
          aria-label="subs detail"
          onClick={() =>
            navigator.clipboard.writeText(xdcToEthAddress(checksumAddress(address as Address)))
          }
        >
          {!withBackground && <ContentCopyIcon sx={{ fontSize: '1.2rem', color: '#ffffff' }} />}
          {withBackground && (
            <ContentCopyIcon sx={{ fontSize: '1.8rem', p: 0.7, backgroundColor: '#F5F8FA' }} />
          )}
        </IconButton>
      )}
      {showInBlockExplorer && (
        <IconButton
          onClick={() => {
            switch (chainId) {
              case 50:
                window.open(
                  `https://explorer.xinfin.network/address/${ethToXdcAddress(address)}`,
                  '_blank'
                );
                break;
              case 51:
                window.open(
                  `https://explorer.apothem.network/address/${ethToXdcAddress(address)}`,
                  '_blank'
                );
                break;
              default:
                window.open('https://explorer.xinfin.network/ ', '_blank');
            }
          }}
        >
          {!withBackground && <OpenInNewIcon sx={{ fontSize: '1.2rem' }} />}
          {withBackground && (
            <OpenInNewIcon sx={{ fontSize: '1.8rem', p: 0.7, backgroundColor: '#F5F8FA' }} />
          )}
        </IconButton>
      )}
      {/* {showAddToWallet && (
        <IconButton
          onClick={() => {
            const provider = web3.currentProvider;
            provider.sendAsync(
              {
                method: 'metamask_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address,
                    symbol,
                    decimals
                  }
                },
                id: Math.round(Math.random() * 100000)
              },
              (err, added) => {
                console.log('provider returned', err, added);
                if (err || 'error' in added) {
                  enqueueSnackbar('Something went wrong!', {
                    variant: 'error'
                  });
                  return;
                }
                enqueueSnackbar('Added token to wallet', {
                  variant: 'success'
                });
              }
            );
          }}
        >
          {!withBackground && <AddBoxIcon sx={{ fontSize: '1.2rem' }} />}
          {withBackground && (
            <AddBoxIcon sx={{ fontSize: '1.8rem', p: 0.7, backgroundColor: '#F5F8FA' }} />
          )}
        </IconButton>
      )} */}
    </Box>
  );
};

export default AddressFieldTools;
