import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import onboard from '../helpers/web3-onboard';
import { getBalance } from '@web3-onboard/wagmi';
import { OnboardAPI } from '@web3-onboard/core';
import { WagmiConfig, WalletState } from '@web3-onboard/core/dist/types';

interface useWebStoreProps {
  wagmiConfig: WagmiConfig | null;
  wallet: WalletState | null;
  chainId: number;
  account: `0x${string}` | null;
  balance: string;
  onBoard: OnboardAPI;
  setConnectWallet: (connectedWallet: WalletState) => void;
  disconnectWallet: () => void;
  pollBalance: () => void;
  erc20Balance: string;
  fetchErc20Balance: (erc20Balance: string) => void;
}

// Create the Zustand store with devtools and persist middleware
const useWebStore = create<useWebStoreProps>()(
  devtools(
    persist(
      (set, get) => {
        return {
          // Initial state
          wagmiConfig: null,
          account: null,
          chainId: 0,
          wallet: null,
          balance: '0',
          onBoard: onboard,
          erc20Balance: '0',

          /**
           * Set the connected wallet state.
           * @param connectedWallet - The connected wallet object.
           */

          setConnectWallet: async (connectedWallet) => {
            const wagmiConfig = onboard.state.get().wagmiConfig;
            if (!wagmiConfig || !connectedWallet.accounts[0]) {
              console.error('Error: wagmiConfig or connected wallet account is null.');
              return;
            }

            set({
              wallet: connectedWallet,
              account: connectedWallet.accounts[0]['address'],
              wagmiConfig: wagmiConfig,
              chainId: wagmiConfig?.chains[0]?.id || 0
            });
          },

          /**
           * Disconnect the wallet and reset the state.
           */
          disconnectWallet: () => {
            console.log('disconnectWallet');
            localStorage.removeItem('wallet');
            set({
              wallet: null,
              account: null,
              wagmiConfig: null,
              balance: '0'
            });
          },

          /**
           * Poll and update the balance of the connected account.
           */
          pollBalance: async () => {
            const _wagmiConfig = get().wagmiConfig;
            const _account = get().account;
            if (_wagmiConfig && _account) {
              const _balance = await getBalance(_wagmiConfig, {
                address: _account,
                unit: 'ether'
              });
              set({ balance: _balance['formatted'] });
            }
          },

          fetchErc20Balance: (erc20Balance: string) => {
            set({ erc20Balance });
          }
        };
      },
      {
        name: 'web3-store', // Name for persisted storage
        partialize: (state) => ({
          account: state.account // Only persist the account state
        })
      }
    )
  )
);

export default useWebStore;
