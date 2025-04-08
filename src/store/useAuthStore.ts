import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import buildApi from './useApiStore';
import { userNamePersistence, userTokenPersistence } from '../persistence';
import toast from 'react-hot-toast';
import { User } from '../types';
import { throwErrorMessage } from '../helpers/errors';

interface useAuthStoreProps {
  user: User | undefined;
  isLoggedIn: boolean;
  isReady: boolean;
  isAuthorized: boolean;
  login: (user: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  token: string | undefined;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  anchorID?: string;
}

// Create the Zustand store with devtools and persist middleware
const useAuthStore = create<useAuthStoreProps>()(
  devtools(
    persist(
      (set) => {
        /**
         * Set the state to logged out by clearing user and token data.
         */
        const setLoggedOutState = () => {
          set({ user: undefined, isLoggedIn: false, token: undefined });
          userTokenPersistence.set(''); // Clear token persistence on logout
        };

        /**
         * Set the loading state.
         * @param isLoading - Boolean indicating whether loading is in progress.
         */
        const setIsLoading = (isLoading: boolean) => {
          set({ isLoading });
        };

        // Initialize API functions with necessary state handlers
        const { userLogin, userLogout } = buildApi(setLoggedOutState, setIsLoading);

        return {
          // Initial state
          user: undefined,
          isLoggedIn: false,
          token: undefined,
          isLoading: false,
          isReady: false,
          isAuthorized: false,
          anchorID: undefined,
          setIsLoading: (isLoading: boolean) => set({ isLoading }),

          /**
           * Handle user login.
           * @param email - User email.
           * @param password - User password.
           */
          login: async ({ email, password }) => {
            try {
              const userData = await userLogin({ email, password });

              if (userData) {
                set({
                  user: userData.user,
                  isLoggedIn: true,
                  token: userData.token,
                  anchorID: userData?.anchor
                });
                userTokenPersistence.set(userData.token);
                userNamePersistence.set(userData.user.email);
                toast.success('Logged in successfully');
                return userData;
              }
            } catch (error) {
              console.error('Login failed:', error);
              throwErrorMessage(error);
              set({ isLoggedIn: false });
            }
          },

          /**
           * Handle user logout.
           */
          logout: async () => {
            try {
              const res = await userLogout();
              if (res.success === true) {
                setLoggedOutState();
              }
            } catch (error) {
              console.error('Already logged out');
            }
            set({ user: undefined, isLoggedIn: false, token: undefined });
          }
        };
      },
      {
        name: 'auth-storage' // Name for persisted storage
      }
    )
  )
);

export default useAuthStore;
