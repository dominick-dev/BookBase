import React from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const AccountMenu = ({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove token from localStorage, close user menu, and navigate to auth page
    localStorage.removeItem("token");
    handleCloseUserMenu();
    alert("You have been logged out!");
    navigate("/auth", { replace: true });
  };

  const handleProfile = () => {
    // close user menu and navigate to profile page
    handleCloseUserMenu();
    navigate("/profile", { replace: true });
  }

  return (
    <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleProfile}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseUserMenu}>
          <Typography textAlign="center">Account</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseUserMenu}>
          <Typography textAlign="center">Dashboard</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountMenu;
