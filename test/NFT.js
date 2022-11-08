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

      it("returns token's uri", async () => {
        // console.log(`${BASE_URI}1.json`)
        expect(await nft.tokenURI(1)).to.equal(`${BASE_URI}1.json`)
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

      it("by rejecting uris for invalid tokens", async () => {
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
        nft.connect(minter).mint(1, { value: COST })

        await expect(nft.tokenURI("2")).to.be.reverted
      })
    })
  })

  describe("Displaying NFTs", () => {
    let transaction, result

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

      // Mint 3 nfts
      transaction = await nft.connect(minter).mint(3, { value: ether(30) })
      result = await transaction.wait()
    })

    it("returns all NFTs per owner", async () => {
      let tokenIds = await nft.walletOfOwner(minter.address)
      // console.log("owner wallet", tokenIds.toString())
      expect(tokenIds.length).to.equal(3)
      expect(tokenIds[0].toString()).to.equal("1")
      expect(tokenIds[1].toString()).to.equal("2")
      expect(tokenIds[2].toString()).to.equal("3")
    })
  })

  describe("Withdraw", () => {
    describe("Successfully", async () => {
      let transaction, result, balanceBefore

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

        balanceBefore = await ethers.provider.getBalance(deployer.address)

        transaction = await nft.connect(deployer).withdraw()
        result = await transaction.wait()
      })

      it("deducts contract balance", async () => {
        expect(await ethers.provider.getBalance(nft.address)).to.equal(0)
      })

      it("sends funds to the owner", async () => {
        expect(
          await ethers.provider.getBalance(deployer.address)
        ).to.be.greaterThan(balanceBefore)
      })

      it("emits a withdraw event", async () => {
        expect(transaction)
          .to.emit(nft, "Withdraw")
          .withArgs(COST, deployer.address)
      })
    })

    describe("Fails", async () => {
      it("by rejecting non-owner withdrawal", async () => {
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
        nft.connect(minter).mint(1, { value: COST })

        await expect(nft.connect(minter).withdraw()).to.be.reverted
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
    })
  })
})
