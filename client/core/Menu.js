import React from "react";
import { withRouter } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  List,
  makeStyles,
  ListItem,
  Container,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import { isAuthenticated, clearJWT } from "../auth/auth-helper";

const useStyles = makeStyles({
  navDisplayFlex: {
    display: `flex`,

    flexDirection: `row-reverse`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
});
//const classes = useStyles(); // Add this

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#ff4081" };
  else return { color: "#ffffff" };
};

const Menu = withRouter(({ history, classes = useStyles() }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MERN Socials
      </Typography>{" "}
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      <Link to="/users" style={{ color: "black", textDecoration: "none" }}>
        <Button style={isActive(history, "/users")}>Users</Button>
      </Link>
      <Container
        className={classes.navDisplayFlex}
        maxWidth="sm"
        disableGutters={true}
      >
        <div></div>
      </Container>
      {isAuthenticated() ? (
        <span>
          <Link
            to={"/user/" + isAuthenticated().user._id}
            style={{ color: "black", textDecoration: "none" }}
          >
            <Button
              style={isActive(history, "/user/" + isAuthenticated().user._id)}
            >
              My Profile
            </Button>
          </Link>

          <Button
            color="inherit"
            position="end"
            onClick={() => {
              clearJWT(() => history.push("/"));
            }}
          >
            Sign out
          </Button>
        </span>
      ) : (
        <span>
          <Link to="/signup" style={{ color: "black", textDecoration: "none" }}>
            <Button style={isActive(history, "/signup")}> Sign Up </Button>
          </Link>
          <Link to="/signin" style={{ color: "black", textDecoration: "none" }}>
            <Button style={isActive(history, "/signin")}> Sign In </Button>
          </Link>
        </span>
      )}
    </Toolbar>
  </AppBar>
));

export default Menu;
