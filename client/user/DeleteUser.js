import React, { useState } from "react";
import { isAuthenticated, clearJWT } from "../auth/auth-helper";
import { remove } from "./api-user";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export default function DeleteUser(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const clickButton = () => {
    setOpen(true);
  };
  const handleRequestClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    const jwt = isAuthenticated();
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        clearJWT(() => console.log("deleted"));
        setRedirect(true);
      }
    });
  };
  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        {" "}
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleRequestClose}>
        {" "}
        <DialogTitle>{"Delete Account"}</DialogTitle>{" "}
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            {" "}
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
DeleteUser.prototype = {
  userId: PropTypes.string.isRequired,
};
