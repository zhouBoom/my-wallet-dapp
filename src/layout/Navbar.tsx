// 导航栏组件
import { AppBar, Toolbar, Typography, Button, Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import WalletConnector from "../components/WalletConnector";

const StyledAppBar = styled(AppBar)(({ theme }) => {
  console.log(theme);
  return {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1,
  };
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Web3 App
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/transactions">
            Transactions
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <WalletConnector />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
