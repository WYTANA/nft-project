require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
const privateKeys = process.env.GOERLI_PRIVATE_KEY || ""

module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {},
    goerli: {
      url: `https://intensive-still-model.ethereum-goerli.discover.quiknode.pro/${process.env.QUICKNODE_PRIVATE_KEY}/`,
      accounts: privateKeys.split(","),
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
}
