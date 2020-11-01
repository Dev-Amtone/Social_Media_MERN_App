import React, { useEffect } from "react";
import { isAuthenticated } from "../auth/auth-helper";
import { useState } from "react";

import { Redirect } from "react-router";
import { update, read } from "./api-user";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Icon,
  CardActions,
  Button,
  Divider,
  makeStyles,
} from "@material-ui/core";

import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(5),
  },

  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
}));

export default function EditProfile({ match }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    error: "",
    redirectToProfile: false,
  });
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = isAuthenticated();
    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setValues({
          name: data.name,
          email: data.email,
          password: "",
          error: "",
          redirectToProfile: false,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  const clickSubmit = () => {
    const jwt = isAuthenticated();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          error: data.error,
          userId: data._id,
          redirectToProfile: true,
        });
      }
    });
  };
  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.userId} />;
  }

  return (
    <div>
      <Card className={classes.card}>
        {" "}
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            {" "}
            Edit Profile{" "}
          </Typography>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
          />
          <br />
          <TextField
            id="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
          />
          <br />
          <TextField
            id="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange("password")}
            margin="normal"
          />{" "}
          <br />
          {values.error && (
            <Typography component="p" color="error">
              {" "}
              <Icon color="error" className={classes.error}>
                error
              </Icon>{" "}
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>{" "}
        </CardActions>
      </Card>
    </div>
  );
}
