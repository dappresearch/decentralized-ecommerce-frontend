import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import metamaskSDK from "@web3-onboard/metamask";
import walletConnectModule from '@web3-onboard/walletconnect';

const injected = injectedModule();

// initialize the module with options
const metamaskSDKWallet = metamaskSDK({options: {
  extensionOnly: false,
  dappMetadata: {
    name: 'ApsoStore'
  }
}});

const wallets = [
  injected,
  metamaskSDKWallet
];

// Web3 onboard requires to pass chain by default.
// Passing random chain, which will not be used.
const  chains = [
  {
    id: 2192,
    token: 'SNAXETH',
    label: 'SNAX Chain',
    rpcUrl: 'https://mainnet.snaxchain.io'
  }
];

const appMetadata = {
  name: 'apsoStore',
  icon: '<svg>My App Icon</svg>',
  description: 'decentralize shop.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
  ]
};

const onboard = Onboard({
  wallets,
  chains,
  appMetadata,
  accountCenter: {
    desktop: {
      enabled: false    
    },
    mobile: {
      enabled: false    
    }
  }
});

export default onboard;
