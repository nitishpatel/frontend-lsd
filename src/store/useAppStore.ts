import { create } from 'zustand';
import buildApi from './useApiStore';
import {
  Address,
  appConfigData,
  LSDFeesAndRewardsNode,
  NodeToken,
  RedemptionStatus,
  TokenInvestorsResponse,
  TokenQuery
} from '../types';
import toast from 'react-hot-toast';

// Define the interface for the store properties and functions
interface useAppStoreProps {
  appConfigByKey: appConfigData;
  fetchAppConfigByKey: (key: string) => Promise<void>;
  allNodeTokens: NodeToken[];
  fetchAllNodeTokens: (filter?: string) => Promise<void>;
  allTokensQuery: Record<string, TokenQuery>;
  fetchAllTokenQuery: () => Promise<void>;
  allTokenInvestors: TokenInvestorsResponse;
  fetchAllTokenInvestorsByAddress: (investorAddress: string) => Promise<void>;
  allLSDFeesAndRewardsByDates: LSDFeesAndRewardsNode[];
  fetchAllLSDFeesAndRewardsByDates: (startDate: string, endDate: string) => Promise<void>;
  fetchRedemptionOpenStatus: (
    address: Address,
    nodeID?: string
  ) => Promise<RedemptionStatus | null | undefined>;
  redemptionOpenStatus: RedemptionStatus;
}

// Create the Zustand store
const useAppStore = create<useAppStoreProps>((set) => {
  // Initialize API functions from buildApi
  const {
    getAppConfigByKey,
    getAllNodeTokens,
    getTokensQuery,
    getTokenInvestorsByAddress,
    getLSDFeesAndRewardsByDates,
    getRedemptionOpenStatus
  } = buildApi();

  return {
    appConfigByKey: {} as appConfigData,
    allNodeTokens: [],
    allTokensQuery: {},
    allTokenInvestors: { nodes: [] },
    allLSDFeesAndRewardsByDates: [],
    redemptionOpenStatus: {} as RedemptionStatus,

    fetchAppConfigByKey: async (key: string) => {
      try {
        const res = await getAppConfigByKey(key);
        if (res) {
          // Update the state with the fetched data
          set({ appConfigByKey: res });
        }
        return res?.value;
      } catch (error: unknown) {
        // Log the error to the console
        console.error('Failed to fetch:', error);
        // Display an error toast notification
        toast.error((error as Error)?.message);
      }
    },
    fetchAllNodeTokens: async (filter?: string) => {
      try {
        const res = await getAllNodeTokens(filter);
        if (res) {
          // Update the state with the fetched data
          set({ allNodeTokens: res });
        }
      } catch (error: unknown) {
        // Log the error to the console
        console.error('Failed to fetch nodes:', error);
        // Display an error toast notification
        toast.error((error as Error)?.message);
      }
    },
    fetchAllTokenQuery: async () => {
      try {
        const res = await getTokensQuery();
        if (res) {
          // Update the state with the fetched data
          set({ allTokensQuery: res });
        }
      } catch (error: unknown) {
        // Log the error to the console
        console.error('Failed to fetch tokens:', error);
        // Display an error toast notification
        toast.error((error as Error)?.message);
      }
    },
    fetchAllTokenInvestorsByAddress: async (investorAddress: string) => {
      try {
        const res = await getTokenInvestorsByAddress(investorAddress);
        if (res) {
          // Update the state with the fetched data
          set({ allTokenInvestors: res });
        }
      } catch (error: unknown) {
        // Log the error to the console
        console.error('Failed to fetch tokens:', error);
        // Display an error toast notification
        toast.error((error as Error)?.message);
      }
    },
    fetchAllLSDFeesAndRewardsByDates: async (startDate: string, endDate: string) => {
      try {
        const res = await getLSDFeesAndRewardsByDates(startDate, endDate);
        if (res) {
          // Update the state with the fetched data
          set({ allLSDFeesAndRewardsByDates: res });
        }
      } catch (error: unknown) {
        // Log the error to the console
        console.error('Failed to fetch tokens:', error);
        // Display an error toast notification
        toast.error((error as Error)?.message);
      }
    },
    fetchRedemptionOpenStatus: async (address: Address, nodeID?: string) => {
      try {
        const res = await getRedemptionOpenStatus(address, nodeID);
        if (res) {
          // Update the state with the fetched data
          set({ redemptionOpenStatus: res });
          return res;
        }
      } catch (error: unknown) {
        // Log the error to the console
        console.error('Failed to fetch tokens:', error);
        // Display an error toast notification
        toast.error((error as Error)?.message);
        return null;
      }
    }
  };
});

export default useAppStore;
