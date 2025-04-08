/**
 * Interface defining the structure of the admin card props.
 */
export interface AdminCardProps {
  title: string;
  count?: number | string | undefined;
  iconPath: string;
  dividerColor: string;
  viewClick?: () => void;
  addClick?: () => void;
  viewButtonText?: string;
}

/**
 * Interface defining the structure of the admin reward form data.
 */
export interface AdminRewardFormProps {
  devCutAccount: string;
  devCutPercent: number;
  protocolCutAccount: string;
  protocolCutPercent: number;
}

/**
 * Interface for Admin Node Form Props
 */
export interface AdminNodeFromProps {
  adminWalletAddress: string;
  anchorInvestorStake: number;
  baseNodeStakeRequired: number;
  lockInPeriod: number;
  minStake: number;
  noOfNodeTokens: number;
  overCollateralizationRate: number;
  requiredNodeStake: number;
  validatorAddress: string;
  withdrawWalletAddress: string;
  xdcPerToken: number;
  anchorInvestorCut: number;
}

/**
 * Interface for Admin Details
 *
 * This interface represents the admin details data.
 *
 * @example
 * ```typescript
 * const adminDetails: AdminDetails = {
 *   name_of_organization: 'Example Organization',
 *   company_email: 'example@example.com',
 *   telegram_handle: '@example',
 *   phone_number: '+1234567890',
 *   company_website: 'https://example.com',
 * };
 * ```
 */

export type AdminDetails = {
  name_of_organization: string;
  company_email: string;
  telegram_handle: string;
  phone_number: string;
  company_website: string;
};
