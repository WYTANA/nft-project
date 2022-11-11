const hre = require("hardhat")

async function main() {
  const NAME = "Hunx & Punx"
  const SYMBOL = "FAKE"
  const COST = hre.ethers.utils.parseUnits("10", "ether")
  const MAX_SUPPLY = 25
  const NFT_MINT_DATE = (Date.now() + 120000).toString().slice(0, 10)
  const IPFS_METADATA_URI =
    "ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/"

  // Deploy NFT
  const NFT = await hre.ethers.getContractFactory("NFT")
  let nft = await NFT.deploy(
    NAME,
    SYMBOL,
    COST,
    MAX_SUPPLY,
    NFT_MINT_DATE,
    IPFS_METADATA_URI
  )

  await nft.deployed()
  console.log(`NFT deployed to: ${nft.address}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
