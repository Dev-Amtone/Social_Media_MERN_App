import express from "express";
import postCtrl from "../controllers/post.controller";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";

const postRouter = express.Router();

postRouter.param("userId", userController.userByID);
postRouter.param("postId", postCtrl.postByID);

postRouter
  .route("/api/posts/feed/:userId")
  .get(authController.requireSignin, postCtrl.listNewsFeed);

postRouter
  .route("/api/posts/by/:userId")
  .get(authController.requireSignin, postCtrl.listByUser);

postRouter
  .route("/api/posts/new/:userId")
  .post(authController.requireSignin, postCtrl.create);

postRouter.route("/api/posts/photo/:postId").get(postCtrl.photo);

postRouter
  .route("/api/posts/:postId")
  .delete(authController.requireSignin, postCtrl.isPoster, postCtrl.remove);

postRouter
  .route("/api/posts/like")
  .put(authController.requireSignin, postCtrl.like);

postRouter
  .route("/api/posts/unlike")
  .put(authController.requireSignin, postCtrl.unlike);

postRouter
  .route("/api/posts/comment")
  .put(authController.requireSignin, postCtrl.comment);

postRouter
  .route("/api/posts/uncomment")
  .put(authController.requireSignin, postCtrl.uncomment);

export default postRouter;
