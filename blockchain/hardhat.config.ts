import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337 // Standard for local networks
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    }
  }
};

export default config;
