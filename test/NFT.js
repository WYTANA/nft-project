const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether")
}

const ether = tokens

describe("NFT", () => {
  const NAME = "Travis NFT"
  const SYMBOL = "TLO"
  const COST = ether(10)
  const MAX_SUPPLY = 25
  const BASE_URI = "ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/"

  let nft, accounts, deployer, minter, receiver, exchange

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    minter = accounts[1]
  })

  describe("Deployment", () => {
    // 2 min from now
    const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10)

    beforeEach(async () => {
      const NFT = await ethers.getContractFactory("NFT")
      nft = await NFT.deploy(
        NAME,
        SYMBOL,
        COST,
        MAX_SUPPLY,
        ALLOW_MINTING_ON,
        BASE_URI
      )
    })

    it("has correct name", async () => {
      expect(await nft.name()).to.equal(NAME)
    })

    it("has correct symbol", async () => {
      expect(await nft.symbol()).to.equal(SYMBOL)
    })

    it("returns cost to mint", async () => {
      expect(await nft.cost()).to.equal(COST)
    })

    it("returns maximum supply of NFTs", async () => {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY)
    })

    it("returns allowed minting time", async () => {
      expect(await nft.allowMintingOn()).to.equal(ALLOW_MINTING_ON)
    })

    it("returns the base uri", async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI)
    })

    it("returns the owner", async () => {
      expect(await nft.owner()).to.equal(deployer.address)
    })
  })
})
