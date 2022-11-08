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
    // 2 min from now (milliseconds)
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

  describe("Minting", () => {
    let transaction, result

    describe("Successfully", async () => {
      const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10)
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

        transaction = await nft.connect(minter).mint(1, { value: COST })
        result = await transaction.wait()
      })

      it("returns the minter address", async () => {
        expect(await nft.ownerOf(1)).to.equal(minter.address)
      })

      it("returns quantity of minter's owned tokens", async () => {
        expect(await nft.balanceOf(minter.address)).to.equal(1)
      })

      it("updates total supply", async () => {
        expect(await nft.totalSupply()).to.equal(1)
      })

      it("updates the contract balance", async () => {
        expect(await ethers.provider.getBalance(nft.address)).to.equal(COST)
      })

      it("emits a mint event", async () => {
        await expect(transaction)
          .to.emit(nft, "Mint")
          .withArgs(1, minter.address)
      })
    })

    describe("Fails", async () => {
      it("by rejecting insufficient payment", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10)
        const NFT = await ethers.getContractFactory("NFT")
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        )

        await expect(nft.connect(minter).mint(1, { value: ether(1) })).to.be
          .reverted
      })

      it("by requiring minting of at least one token", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10)
        const NFT = await ethers.getContractFactory("NFT")
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        )

        await expect(nft.connect(minter).mint(0, { value: COST })).to.be
          .reverted
      })

      it("by rejecting minting before allowed time", async () => {
        const ALLOW_MINTING_ON = new Date("November 14, 2030 18:00:00")
          .getTime()
          .toString()
          .slice(0, 10)
        const NFT = await ethers.getContractFactory("NFT")
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        )

        await expect(nft.connect(minter).mint(1, { value: COST })).to.be
          .reverted
      })

      it("by requiring mint not exceed max supply", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10)
        const NFT = await ethers.getContractFactory("NFT")
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        )

        await expect(nft.connect(minter).mint(100, { value: COST })).to.be
          .reverted
      })
    })
  })
})
