# Decom-frontend(apsostore.com)

Experimental decentralize e-commerce
* website: https://apsostore.com

* smart-contract: https://github.com/dappresearch/decentralized-ecommerce-smartcontract
  Main core logic that needs to be deployed over preferred network.

* front-end:https://github.com/dappresearch/decentralized-ecommerce-frontend
  It is the main landing page for the website, where user interaction happens.

* admin:https://github.com/dappresearch/decentralized-ecommerce-admin
  This is for the owner/seller to manage orders and administration settings.

### Initial Setup
You need to deploy the smart contract first. Visit the link below and follow the instructions:

Smart contract: https://github.com/dappresearch/decentralized-ecommerce-smartcontract

Create a .env file in the root directory and structure the variables according to the .example.env file.

For example, if the smart contract has been deployed on the Sepolia network, the contract address and Price V3 address will be logged in the console. Copy these addresses and store them in the .env file as shown in the .example.env file:

VITE_SEPOLIA_CONTRACT_ADDRESS="Sepolia deployment address"
VITE_SEPOLIA_PRICE_V3_ADDRESS="Sepolia price feed deployment address"

If you intend to use walletconnect, vist https://cloud.reown.com/sign-in

get a project id and store inside .env file.

VITE_PROJECTID="Wallet connect project id"

### Package installation

```bash
npm install

```

### Building

To create a production version of your app:

```bash
npm run build
```

### Local host deployment

```bash
npm run dev

```

### Cloud flare deployment

Configure wrangler:

```bash
wrangler login

```

Deployment:

```bash

npm run deploy
```



