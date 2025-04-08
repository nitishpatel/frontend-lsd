import { Address } from '..';

export interface appConfigData {
  _id: string;
  key: string;
  value: string;
  __v: number;
}

export type NodeType = 'STANDBY' | 'VALIDATOR' | 'SLASHED';

export type NodeStatus = {
  _id: string;
  status: string;
};

export type Anchor = {
  email: string;
  wallet_address: string;
  role: string;
  name: string;
  address: string;
  phone_number: string;
  anchor_address: string;
  user_id: string;
  anchor_investor_id: string;
};

export type NodeToken = {
  _id: string;
  name: string;
  symbol: string;
  type: NodeType;
  anchor: Anchor;
  indicative_apy: number;
  lot_size: number;
  stake_requirement: number;
  max_supply: number;
  new_max_supply?: number;
  anchor_stake: number;
  over_collateralisation: number;
  hosted_by: string;
  subscription_end_date: string;
  node_status: NodeStatus;
  initial_lock_in: number;
  redemption_window_status: string;
  redemption_open_period: number;
  node_activation_date: string;
  redemption_interval: number;
  node_resignation_date: string;
  node_closure_date: string;
  last_redemption_window_opened: string;
  last_redemption_window_closed: string;
  last_reward_date?: Date;
  calculatedMaxSupply?: number;
  noOfNodeTokens?: bigint;
  nodeAddress?: Address;
  tokenAddress?: Address;
  currentSupply?: bigint;
  participants?: number;
  unclaimed_rewards?: string;
  inventoryBalance?: string;
};

export type TokenQuery = {
  id: string;
  blockHeight: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  nodeAddress: string;
  anchorInvested: boolean;
  currentSupply: bigint;
  redeemSupply?: bigint;
  noOfNodeTokens?: bigint;
  subscriptionEndDate: bigint;
  createdAt: string;
  tokenInvestors: {
    totalCount: number;
  };
};

export interface Token {
  _id?: string;
  nodeAddress: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  lot_size?: string;
}

export interface TokenInvestor {
  investor: string;
  amount: string; // If amount is actually a string in the JSON data
  token: Token;
  unclaimed_rewards?: string;
}

export interface TokenInvestorsResponse {
  nodes: TokenInvestor[];
}

export interface createRedeemRequestProps {
  node: string;
  investor_address: Address;
  redemption_qty: number;
}

export interface LSDFeesAndRewardsNode {
  id: string;
  devFeesAccrued: BigInt; // Accrued developer fees
  devRewardAccrued: BigInt; // Accrued developer rewards
  adminFeesAccrued: BigInt; // Accrued admin fees
  adminRewardAccrued: BigInt; // Accrued admin rewards
  totalAmount: BigInt; // Total amount
  createdAt: string; // ISO 8601 date-time string
}

export interface LSDFeesAndRewardsSummary {
  nodes: LSDFeesAndRewardsNode[];
}

export interface RedemptionStatus {
  redemptionOpen: boolean;
}
