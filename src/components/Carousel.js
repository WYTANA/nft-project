import Carousel from "react-bootstrap/Carousel"

const reactCarousel = ({ walletOfOwner }) => {
  return (
    <Carousel fade variant="dark">
      {walletOfOwner.map((wallet, index) => (
        <Carousel.Item key={index} interval={1000}>
          <img
            className="my-4 text-center rounded mx-auto d-block"
            src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${wallet}.png`}
            alt="Feaux Punx"
          />
          <Carousel.Caption>
            {/* <p>The next Punx is the best!</p> */}
            {/* <h5 className=" text-center text-dark">Account: {account}</h5> */}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default reactCarousel
