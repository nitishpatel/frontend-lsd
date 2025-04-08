import './App.css';
import { Web3OnboardProvider } from '@web3-onboard/react';
import web3Onboard from './helpers/web3-onboard.ts';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material';
import theme from './theme.tsx';
import Router from './routes.tsx';
const queryClient = new QueryClient();
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <ThemeProvider theme={theme}>
            <Router />
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                error: {
                  style: {
                    background: '#ff5252',
                    color: '#fff'
                  },
                  iconTheme: {
                    primary: '#713200',
                    secondary: '#FFFAEE'
                  }
                },
                success: {
                  style: {
                    background: '#4CAF50',
                    color: '#fff'
                  },
                  iconTheme: {
                    primary: '#f1f2f6',
                    secondary: '#2f3542'
                  }
                }
              }}
            />
          </ThemeProvider>
        </Web3OnboardProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
