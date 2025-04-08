// Protocol Setup Types
export interface ProtocolFormValues {
  v2_admin_contract_address: string;
  staking_contract_address: string;
  protocol_owner_address: string;
  lsd_inventory_contract_address: string;
  lsd_admin_contract_address: string;
  devAddress: string;
  liquidityThreshold: string;
  stakingFees: string;
  unstakingFees: string;
  liquidityTolerance: string;
  devInvestmentFees: string;
  adminRewardCut: string;
  devRewardCut: string;
  xdcRewardRate: string;
}

export interface ProtocolFormFieldProps {
  fieldName: string;
  label: string;
  type?: string; // Optional type for input (e.g., text, number)
  readOnly?: boolean; // Optional flag to make the field read-only
}

export interface ProtocolContractValues {
  devAddress: string;
  liquidityThreshold: bigint;
  stakingFees: bigint;
  unstakingFees: bigint;
  liquidityTolerance: bigint;
  devRewardCut: bigint;
  adminRewardCut: bigint;
  devInvestmentFees: bigint;
  adminAddress?: string;
  xdcRewardRate: string;
}

export interface InventoryData {
  inventoryProtocolFreeBalance: bigint | undefined;
  liquidityThresholdPercent: bigint | undefined;
  liquidityTolerancePercent: bigint | undefined;
  nodeTokenHolding: bigint | undefined;
  protocolInvnentoryBalance: bigint | undefined;
  protocolRewardsAccrued: bigint | undefined;
  stXDCSupply: bigint | undefined;
  stXDCValue: bigint | undefined;
  stakingContractBalance: bigint | undefined;
  v2ResignationProceeds: bigint | undefined;
  v2RewardsReceived: bigint | undefined;
}

export interface Result {
  result: bigint[]; // Array of `bigint` numbers
  status: string; // Status string, e.g., "success"
}
