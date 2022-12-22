import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const AuthButtons = () => {
  const history = useHistory()
  const username = localStorage.getItem("username")
  let renderElements
  if (username != null) {
    renderElements = (<Stack direction="row" alignItems="center" spacing={2}>
    <Avatar alt={username} src="../../public/avatar.pngw" />
    <span>
      {username}
    </span>
    <Button variant="text" onClick={() => {
      localStorage.clear()
      window.location.reload()
    }}>LOGOUT</Button>
  </Stack>)
  } else {
    renderElements = (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button variant="text" onClick={() => history.push("/login")} >LOGIN</Button>
        <Button variant="contained" onClick={() => history.push("/register")}>REGISTER</Button>
      </Stack>
    )
  }
  return renderElements
}

const Header = ({ children, hasHiddenAuthButtons }) => {
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children && children}
      {hasHiddenAuthButtons ?  
      <Link to="/">
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          Back to explore
        </Button>
      </Link> : 
      <AuthButtons /> }
    </Box>
  );
};

export default Header;
