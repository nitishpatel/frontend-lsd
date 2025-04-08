import useWebStore from '../useWebStore';
import lsdAbi from '../../abis/LSDAdmin.json';
import lsdInventoryAbi from '../../abis/LSDInventory.json';
import stxdcAbi from '../../abis/stXDCToken.json';
import ercAbi from '../../abis/erc20.json';
import nodeAbi from '../../abis/NodeContract.json';
import deployedAddresses from '../../abis/deployed_addresses.json';
import { multicall, waitForTransactionReceipt, writeContract } from '@web3-onboard/wagmi';
import { useState } from 'react';
import { Address, ProtocolContractValues } from '../../types';
import { reconnect } from '@wagmi/core';
import { metaMask } from '@wagmi/connectors';

const useTransaction = () => {
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);
  const account = useWebStore((state) => state.account);
  const [loading, setLoading] = useState(false);

  /**
   * Sends a transaction to a smart contract.
   * @param abi - The ABI of the contract.
   * @param address - The contract address.
   * @param functionName - The function to call on the contract.
   * @param args - The arguments for the function call.
   * @returns The transaction receipt.
   */
  const sendTransaction = async (
    abi: any,
    address: `0x${string}`,
    functionName: string,
    args: any[],
    value?: any
  ) => {
    const { wagmiConfig, account } = useWebStore.getState();

    const result = await reconnect(wagmiConfig as any, {
      connectors: [metaMask()]
    });

    if (!wagmiConfig || !account) {
      throw new Error('wagmiConfig or account is not set.');
    }

    console.log('result', result);
    setLoading(true);
    try {
      const tx = await writeContract(wagmiConfig, {
        address: address,
        abi: abi,
        functionName: functionName,
        args: args,
        value: value,
        account: account!
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx,
        confirmations: 2
      });
      return receipt;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reads data from a smart contract.
   * @param abi - The ABI of the contract.
   * @param address - The contract address.
   * @param functionName - The function to call on the contract.
   * @param args - The arguments for the function call.
   * @returns The result of the contract call.
   */
  const readFromContract = async (
    abi: any,
    address: `0x${string}`,
    functionName: string,
    args: any[]
  ) => {
    if (wagmiConfig !== null) {
      const result = await multicall(wagmiConfig, {
        contracts: [
          {
            address: address,
            abi: abi,
            functionName: functionName,
            args: args
          }
        ],
        // multicallAddress: '0xbF2e4C6bdFEA5e08372A1ec4eB56c253cC1D5893' // mainnet
        multicallAddress: '0x1574aE4d1C2E93D3AfF58b19DA2c481F68802E17' // apothem
      });
      return result;
    }
  };

  const getErc20Balance = async () => {
    return readFromContract(
      ercAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'balanceOf',
      [account]
    );
  };

  /**
   * Sets up the LSD Admin contract with the given parameters.
   * @param data - The parameters to set up the contract with.
   * @returns The transaction receipt.
   */
  const setupAdminContract = async (data: ProtocolContractValues) => {
    return sendTransaction(
      lsdAbi,
      deployedAddresses?.['ValidAdminModule#LSDAdmin'] as Address,
      'setupAdminContract',
      [data]
    );
  };

  /**
   * Retrieves the LSD protocol parameters.
   * @returns The LSD protocol parameters.
   */
  const getLSDParams = async () => {
    return readFromContract(
      lsdAbi,
      deployedAddresses?.['ValidAdminModule#LSDAdmin'] as Address,
      'getLSDParams',
      []
    );
  };

  const transferLiquidityToStaking = async (amount: string) => {
    return sendTransaction(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'transferLiquidityToStaking',
      [amount]
    );
  };

  const stake = async (value: string) => {
    return sendTransaction(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'stake',
      [],
      value
    );
  };

  const unstake = async (amount: string) => {
    return sendTransaction(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'unstake',
      [amount]
    );
  };

  const calculateStakeParams = async (amount: string) => {
    return readFromContract(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'calculateStakeParams',
      [amount]
    );
  };

  const calculateUnStakingParams = async (amount: string) => {
    return readFromContract(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'calculateUnStakingParams',
      [amount]
    );
  };

  const getPrice = async () => {
    return readFromContract(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'getPrice',
      [0]
    );
  };

  const getProtocolInventoryDetails = async () => {
    return readFromContract(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'getProtocolInventoryDetails',
      []
    );
  };

  const calculateTolerance = async () => {
    return readFromContract(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'calculateTolerance',
      []
    );
  };

  const feesAndRewardsDetails = async () => {
    return readFromContract(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'getFeesAndRewardsDetails',
      []
    );
  };

  const withdrawProtocolFeesAndReward = async () => {
    return sendTransaction(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'withdrawProtocolFeesAndReward',
      []
    );
  };

  const stakeInNodeV2 = async (nodeAddress: Address, amount: string) => {
    return sendTransaction(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'stakeInNodeV2',
      [nodeAddress, amount]
    );
  };

  const claimNodeRewardsV2 = async (nodeAddress: Address) => {
    return sendTransaction(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'claimNodeRewardsV2',
      [nodeAddress]
    );
  };

  const getUnclaimedRewards = async (nodeAddress: Address) => {
    return readFromContract(nodeAbi, nodeAddress, 'getUnclaimedRewards', [
      deployedAddresses?.['ValidAdminModule#LSDInventory']
    ]);
  };

  const approveTokenForNodeContract = async (
    nodeAddress: Address,
    tokenAddress: Address,
    amount: string
  ) => {
    return await sendTransaction(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'approveTokenForNodeContract',
      [nodeAddress, tokenAddress, amount]
    );
  };

  const pauseStaking = async () => {
    return sendTransaction(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'pauseStaking',
      []
    );
  };

  const unpauseStaking = async () => {
    return sendTransaction(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'unpauseStaking',
      []
    );
  };

  const pauseUnstaking = async () => {
    return sendTransaction(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'pauseUnstaking',
      []
    );
  };

  const unpauseUnstaking = async () => {
    return sendTransaction(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'unpauseUnstaking',
      []
    );
  };

  const getStakingAndUnstakingStatus = async () => {
    return readFromContract(
      stxdcAbi,
      deployedAddresses?.['ValidAdminModule#stXDCToken'] as Address,
      'getStakingAndUnstakingStatus',
      []
    );
  };

  /**
   * Sends a transaction to withdraw funds from a node.
   *
   * @param {Address} nodeAddress - The address of the node.
   * @return {Promise<TransactionReceipt>} A promise that resolves to the transaction receipt.
   */
  const withdrawFunds = async (nodeAddress: Address) => {
    return await sendTransaction(
      lsdInventoryAbi,
      deployedAddresses?.['ValidAdminModule#LSDInventory'] as Address,
      'withdrawV2Funds',
      [nodeAddress]
    );
  };

  return {
    txnInProgress: loading,
    setupAdminContract,
    getLSDParams,
    transferLiquidityToStaking,
    stake,
    unstake,
    calculateStakeParams,
    getPrice,
    getErc20Balance,
    getProtocolInventoryDetails,
    calculateTolerance,
    feesAndRewardsDetails,
    withdrawProtocolFeesAndReward,
    calculateUnStakingParams,
    stakeInNodeV2,
    claimNodeRewardsV2,
    getUnclaimedRewards,
    approveTokenForNodeContract,
    pauseStaking,
    unpauseStaking,
    pauseUnstaking,
    unpauseUnstaking,
    getStakingAndUnstakingStatus,
    withdrawFunds
  };
};

export default useTransaction;
