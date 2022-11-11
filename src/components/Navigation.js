import Navbar from "react-bootstrap/Navbar"

import logo from "../logo.png"
import fox from "../fox.png"

const Navigation = ({ account }) => {
  return (
    <Navbar bg="light" className="my-3 px-5 rounded">
      <img
        alt="punx"
        src={logo}
        width="45"
        height="45"
        className="d-inline-block align-top mx-3 rounded-circle"
      />
      <Navbar.Brand href="#">Hunx & Punx</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {!account ? (
            <span>Connect to Metamask!</span>
          ) : (
            <img
              src={fox}
              alt="fox"
              width="40"
              height="40"
              data-bs-toggle="tooltip"
              title={account}
            />
          )}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
