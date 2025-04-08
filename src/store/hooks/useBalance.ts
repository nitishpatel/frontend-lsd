import useWebStore from '../useWebStore';
import { useQuery } from 'react-query';

const useBalance = () => {
  try {
    // Get the fetchBalance function from the store
    const fetchBalance = useWebStore((state) => state.pollBalance);

    // Get the current balance from the store
    const { balance } = useWebStore();

    // Setup react-query to fetch the balance periodically
    const query = useQuery('balance', fetchBalance, {
      refetchInterval: 5000,
      enabled: !!fetchBalance
    });

    // Return the queried balance or the balance from the store
    return query.data || balance;
  } catch (error) {
    console.log('Error in useBalance', error);
  }
};

export default useBalance;
