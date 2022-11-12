import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import Countdown from "react-countdown"
import { ethers } from "ethers"

import preview from "../preview.png"

// Components
import Navigation from "./Navigation"
import Data from "./Data"
import Loading from "./Loading"
import Carousel from "./Carousel"
import Mint from "./Mint"

// ABIs: Import contract ABIs here
import NFT_ABI from "../abis/NFT.json"

// Config: Import network config here
import config from "../config.json"

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

  const [revealTime, setRevealTime] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)
  const [walletOfOwner, setWalletOfOwner] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const { chainId } = await provider.getNetwork()

    // Initiate the contract
    const nft = new ethers.Contract(
      config[chainId].nft.address,
      NFT_ABI,
      provider
    )
    setNFT(nft)

    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // // Fetch account balance
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatUnits(balance, 18)
    setBalance(balance)

    // Fetch countdown
    const allowMintingOn = await nft.allowMintingOn()
    setRevealTime(allowMintingOn.toString() + "000")

    // Fetch maxSupply
    setMaxSupply(await nft.maxSupply())

    // Fetch totalSupply
    setTotalSupply(await nft.totalSupply())

    // Fetch cost
    setCost(await nft.cost())

    // Fetch account balance
    setBalance(await nft.balanceOf(account))

    // Fetch owner wallet
    setWalletOfOwner(await nft.walletOfOwner(account))

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return (
    <Container>
      <Navigation account={account} />

      <h1 className="my-4 text-center">
        Trade Hunx & Punx for Goerli Test Ether
      </h1>
      <br />
      <h4 className="my-4 text-center">Deal of the Decade!</h4>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col className="my-4">
              {balance > 0 ? (
                <Carousel walletOfOwner={walletOfOwner} />
              ) : (
                <img
                  src={preview}
                  alt="punx"
                  className="my-4 text-center rounded mx-auto d-block"
                  data-bs-toggle="tooltip"
                  title="Hunx & Punx preview!"
                />
              )}
            </Col>
            <Col className="border rounded bg-info text-center d-flex flex-column justify-content-center align-items-center m-5">
              {revealTime - Date.now() > 0 ? (
                <p className="text-center p-4">
                  <Countdown
                    date={parseInt(revealTime)}
                    className="display-5 mb-4"
                  />
                </p>
              ) : (
                <>
                  <h3 className="text-center alert alert-success w-50 p-2 mt-3">
                    MINTING IS LIVE!
                  </h3>
                  {/* <p className="text-center p-4">
                    <Countdown
                      date={parseInt(revealTime)}
                      className="display-5"
                    />
                  </p> */}
                </>
              )}

              <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />
              <Mint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
                maxSupply={maxSupply}
                totalSupply={totalSupply}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App
