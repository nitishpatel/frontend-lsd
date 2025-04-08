import axios from 'axios';
import { userTokenPersistence } from '../persistence';
import { API_URL, GRAPHQL_API_URL } from '../config';
import { ChangePasswordAPIProps, createRedeemRequestProps, LoginDataProps } from '../types';
import { arrayToDict } from '../helpers/text';

type Methods = 'head' | 'options' | 'put' | 'post' | 'patch' | 'delete' | 'get';

// interface MyErrorType {
//   response?: {
//     status: number;
//   };
// }

const buildApi = (setLoggedOutState?: () => void, setIsLoading?: (isLoading: boolean) => void) => {
  const processResponse = async (callInstance: any) => {
    try {
      if (setIsLoading) {
        setIsLoading(true);
      }
      const { data } = await callInstance;
      if (data && data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (e: any) {
      if (e.response && e.response.status) {
        if (e.response.status === 401) {
          localStorage.clear();
          if (setLoggedOutState) {
            setLoggedOutState();
          }
          return;
        }
      }
      throw e;
    } finally {
      if (setIsLoading) {
        setIsLoading(false);
      }
    }
  };

  const getAuthHeaders = () => {
    const token = userTokenPersistence.get();
    if (!token) {
      return {};
    }
    return { Authorization: `Token ${token}` };
  };

  const callAxiosMethod = (methodName: Methods, path?: string, data?: any, config?: any) => {
    const axiosConfig = {
      ...config,
      headers: { ...getAuthHeaders(), ...(config?.headers || {}) }
    };
    if (methodName === 'get') {
      return processResponse(axios.get(`${API_URL}${path}`, { ...axiosConfig, params: data }));
    } else if (methodName === 'delete') {
      return processResponse(axios.delete(`${API_URL}${path}`, { ...axiosConfig, data }));
    } else {
      // For other HTTP methods (post, put, etc.)
      return processResponse(axios[methodName](`${API_URL}${path}`, data, { ...axiosConfig }));
    }
  };

  const callGraphQLQuery = (query: string, variables?: any) => {
    return processResponse(
      axios.post(GRAPHQL_API_URL, {
        query: query,
        variables: variables
      })
    );
  };

  const get = (path: string, params?: any, config?: any) =>
    callAxiosMethod('get', path, params, config);
  const post = (path: string, data?: any) => callAxiosMethod('post', path, data);
  // const Delete = (path: string, data?: any) => callAxiosMethod('delete', path, data);
  // const patch = (path: string, data?: any) => callAxiosMethod('patch', path, data);
  // const put = (path: string, ...args: any[]) => callAxiosMethod('put', path, ...args);

  // admin
  const userLogin = (data: LoginDataProps) => post('/login', data);
  const userLogout = () => post('/logout');
  const changePassword = (data: ChangePasswordAPIProps) => post('/change-password', data);
  // appconfig
  const getAppConfigByKey = (key: string) => get(`/app-config/get-app-config/${key}`);

  // nodes
  const getAllNodeTokens = (filter?: string) => {
    const path = `/master-node/list`;
    const params = { filter };
    return get(path, params);
  };
  const createRedeemRequest = (data: createRedeemRequestProps) =>
    post('/master-node/create-redemption-request', data);

  // queries
  const getTokensQuery = async () => {
    const query = `
      query {
        tokens {
          nodes {
            id
            blockHeight
            name
            symbol
            tokenAddress
            nodeAddress
            anchorInvested
            currentSupply
            redeemSupply
            noOfNodeTokens
            subscriptionEndDate
            createdAt
            tokenInvestors{
              totalCount
            }
          }
        }
      }
    `;
    const response = await callGraphQLQuery(query);
    const tokensArray = response?.data?.tokens?.nodes;
    return arrayToDict(tokensArray, 'name');
  };

  const getTokenInvestorsByAddress = async (investorAddress: string) => {
    const query = `
      query($investor: String!) {
        tokenInvestors(filter: { investor: { equalTo: $investor },isRedeemed:{ equalTo: false } }) {
          nodes {
            investor
            amount
            token {
              nodeAddress
              name
              symbol
              tokenAddress
            }
          }
        }
      }
    `;
    const variables = { investor: investorAddress };
    const response = await callGraphQLQuery(query, variables);
    const tokenInvestors = response?.data?.tokenInvestors;
    return tokenInvestors;
  };

  const getLSDFeesAndRewardsByDates = async (startDate: string, endDate: string) => {
    const query = `
      query($startDate: BigFloat!, $endDate: BigFloat!) {
        lSDFeesAndRewards(filter: {
          createdAt: {
            greaterThan: $startDate,
            lessThan: $endDate
          }
        }) {
          nodes {
            id
            devFeesAccrued
            devRewardAccrued
            adminFeesAccrued
            adminRewardAccrued
            totalAmount
            createdAt
          }
        }
      }
    `;
    const variables = { startDate, endDate };
    const response = await callGraphQLQuery(query, variables);
    const lSDFeesAndRewards = response?.data?.lSDFeesAndRewards?.nodes;
    return lSDFeesAndRewards;
  };

  // helpers
  const getRedemptionOpenStatus = (address: string, nodeId?: string) => {
    const path = `/master-node/get-redemption-open-status/${address}`;
    const params = { nodeId };
    return get(path, params);
  };

  return {
    // admin
    userLogin,
    userLogout,
    changePassword,

    // appconfig
    getAppConfigByKey,

    // nodes
    getAllNodeTokens,
    createRedeemRequest,

    // helpers
    getRedemptionOpenStatus,

    // queries
    getTokensQuery,
    getTokenInvestorsByAddress,
    getLSDFeesAndRewardsByDates
  };
};

export default buildApi;
