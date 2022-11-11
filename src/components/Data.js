import { ethers } from "ethers"

const Data = ({ maxSupply, totalSupply, cost, balance }) => {
  return (
    <div>
      <p className="text-center h4 pb-2">
        <strong>Available to mint:</strong> {maxSupply - totalSupply}
      </p>
      <p className="text-center h4 pb-2">
        <strong>Cost to mint:</strong> {ethers.utils.formatUnits(cost, "ether")}{" "}
        ETH
      </p>
      <p className="text-center h4">
        <strong>Your number of Punx:</strong> {balance.toString()}
      </p>
    </div>
  )
}

export default Data
