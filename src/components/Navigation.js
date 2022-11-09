import Navbar from "react-bootstrap/Navbar"

import logo from "../logo.png"

const Navigation = ({ account }) => {
  return (
    <Navbar bg="light" className="my-3 px-5 rounded">
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3 rounded-circle"
      />
      <Navbar.Brand href="#">Feaux Punx</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>{account}</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
