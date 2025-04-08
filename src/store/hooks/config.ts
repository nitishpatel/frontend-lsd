import { createConfig, http } from '@wagmi/core';
import { xdc, xdcTestnet } from '@wagmi/core/chains';
import { metaMask } from '@wagmi/connectors';

export const config = createConfig({
  chains: [xdc, xdcTestnet],
  connectors: [metaMask()],
  transports: {
    [xdc.id]: http(),
    [xdcTestnet.id]: http()
  }
});
