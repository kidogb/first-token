import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.url,
      accounts:[ process.env.goerli_private_key || '']
    }
  },
  etherscan: {
    apiKey: {
      goerli: process.env.etherscan_api_key || '',
    }
  }
};

export default config;
       