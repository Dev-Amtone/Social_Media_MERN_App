import React, { useState, useEffect } from "react";
import { Card, Typography, Divider, makeStyles } from "@material-ui/core";
import { listNewsFeed } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";
import PostList from "./PostList";
import NewPost from "./NewPost";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 900,
    margin: "auto",
    paddingTop: 0,

    marginTop: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.1em",
  },
  media: {
    minHeight: 330,
  },
}));

export default function Newsfeed() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const jwt = isAuthenticated();

  const addPost = (post) => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const removePost = (post) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed(
      { userId: jwt.user._id },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Card className={classes.card} elevation={4}>
      <Typography type="title" className={classes.title}>
        Newsfeed
      </Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList removeUpdate={removePost} posts={posts} />
    </Card>
  );
}
