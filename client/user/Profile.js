import React from "react";
import { isAuthenticated } from "../auth/auth-helper";
import { useState, useEffect } from "react";

import { Redirect } from "react-router";
import { read } from "./api-user";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";
import ProfileTabs from "./ProfileTabs";
import { Link } from "react-router-dom";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import FollowGrid from "./FollowGrid";
import { listByUser } from "../post/api-post";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: "1em",
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
}));

export default function Profile({ match }) {
  const classes = useStyles();

  const [user, setUser] = useState({ following: [], followers: [] });
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [photoUrl, setUrl] = useState("");
  const [following, setFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  const jwt = isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
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
        setFollowing(checkFollow(data));
        setUser(data);
        console.log(data);
        setUrl(`/api/users/photo/${data._id}?${new Date().getTime()}`);
        loadPosts(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      user._id
    ).then((data) => {
      if (data.error) {
        setUser({ ...user, error: data.error });
        console.log("error now");
      } else {
        console.log(data);
        setUser(data);
        setFollowing(!following);
      }
    });
  };

  const loadPosts = (user) => {
    listByUser(
      {
        userId: user._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setPosts(data);
      }
    });
  };
  const removePost = (post) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        {" "}
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />{" "}
          {isAuthenticated().user && isAuthenticated().user._id == user._id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  {" "}
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          ) : (
            <ListItemSecondaryAction>
              <FollowProfileButton
                following={following}
                onButtonClick={clickFollowButton}
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />

        <ListItem>
          <ListItemText
            primary={user.about}
            secondary={"Joined: " + new Date(user.created).toDateString()}
          />
        </ListItem>

        <Divider />
      </List>
      <ProfileTabs user={user} posts={posts} removePostUpdate={removePost} />
    </Paper>
  );
}
