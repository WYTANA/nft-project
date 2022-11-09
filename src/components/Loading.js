import Spinner from "react-bootstrap/Spinner"

const Loading = () => {
  return (
    <div className="text-center my-5">
      <Spinner animation="grow" />
      <p className="my-2">Please connect Goerli account ...</p>
    </div>
  )
}

export default Loading
