import { useState } from "react"
// import { ethers } from "ethers"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"

const Mint = ({ provider, nft, cost, setIsLoading }) => {
  const [amount, setAmount] = useState("0")
  const [isWaiting, setIsWaiting] = useState(false)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()
      const value = (amount * cost).toString()
      const transaction = await nft
        .connect(signer)
        .mint(amount, { value: value })
      await transaction.wait()
    } catch (error) {
      window.alert("User rejected or transaction reverted!")
    }
    setIsLoading(true)
  }

  return (
    <>
      <Form
        onSubmit={mintHandler}
        style={{ maxWidth: "450px", margin: "50px auto" }}
      >
        {isWaiting ? (
          <Spinner
            animation="border"
            style={{ display: "block", margin: "0 auto" }}
          />
        ) : (
          <Form.Group>
            <Form.Control
              className="my-2"
              type="number"
              placeholder="Add Punx to your gang!"
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button variant="warning" type="submit" style={{ width: "100%" }}>
              Mint
            </Button>
          </Form.Group>
        )}
      </Form>
    </>
  )
}

export default Mint
