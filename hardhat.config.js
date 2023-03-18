require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: 'goerli',
  networks:{
    goerli: {
      url: process.env.INFURA_GOERLI,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
