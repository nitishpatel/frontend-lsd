import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';
import icon from '../assets/logo.svg';
import wagmi from '@web3-onboard/wagmi';
import metamaskSDK from '@web3-onboard/metamask';
import walletConnectModule from '@web3-onboard/walletconnect';
import { VITE_APP_WALLET_CONNECT_PROJECT_ID } from '../config';

const WC_PROJECT_ID = VITE_APP_WALLET_CONNECT_PROJECT_ID;
const wcInitOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: WC_PROJECT_ID,
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains: [51],
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  optionalChains: [51],
  /**
   * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
   * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
   * To connect with WalletConnect
   */
  dappUrl: 'http://YourAwesomeDapp.com'
};

// initialize the module with options
const walletConnect = walletConnectModule(wcInitOptions);

// Import the blocknative icon
const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    dappMetadata: {
      name: 'Demo Web3Onboard'
    }
  }
});

const injected = injectedModule({
  custom: [
    // include custom injected wallet modules here
  ],
  filter: {
    // mapping of wallet labels to filter here
  }
});

export default init({
  wagmi,
  // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
  wallets: [metamaskSDKWallet, walletConnect, injected],
  // An array of Chains that your app supports
  chains: [
    {
      id: '0x33',
      token: 'XDC',
      label: 'XinFin Apothem',
      rpcUrl: 'https://rpc.ankr.com/xdc_testnet'
    }
  ],
  appMetadata: {
    // The name of your dApp
    name: 'Blocknative',
    // SVG icon string, with height or width (whichever is larger) set to 100% or a valid image URL
    icon,
    // Optional wide format logo (ie icon and text) to be displayed in the sidebar of connect modal. Defaults to icon if not provided
    logo: '<svg></svg>',
    // The description of your app
    description: 'Demo app for Onboard V2',
    // The url to a getting started guide for app
    gettingStartedGuide: 'http://mydapp.io/getting-started',
    // url that points to more information about app
    explore: 'http://mydapp.io/about',
    // if your app only supports injected wallets and when no injected wallets detected, recommend the user to install some
    recommendedInjectedWallets: [
      {
        // display name
        name: 'MetaMask',
        // link to download wallet
        url: 'https://metamask.io'
      }
    ],
    // Optional - but allows for dapps to require users to agree to TOS and privacy policy before connecting a wallet
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
    }
  },
  accountCenter: {
    desktop: {
      enabled: false
    },
    mobile: {
      enabled: false
    }
  }
  // example customising copy
  // i18n: {
  //   en: {
  //     connect: {
  //       selectingWallet: {
  //         header: 'custom text header'
  //       }
  //     }
  //   }
  // }
});
