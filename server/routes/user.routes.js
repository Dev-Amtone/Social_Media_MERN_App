import express from "express";
import userCtrl from "../controllers/user.controller";
import authController from "../controllers/auth.controller";

const userRouter = express.Router();

userRouter.param("userId", userCtrl.userByID);

userRouter
  .route("/api/users/:userId")
  .get(authController.requireSignin, userCtrl.read)
  .put(
    authController.requireSignin,
    authController.hasAuthorization,
    userCtrl.update
  )
  .delete(
    authController.requireSignin,
    authController.hasAuthorization,
    userCtrl.remove
  );
userRouter
  .route("/api/users/photo/:userId")
  .get(userCtrl.photo, userCtrl.defaultPhoto);

userRouter.route("/api/users/defaultphoto").get(userCtrl.defaultPhoto);

userRouter
  .route("/api/users/follow/jojo")
  .put(
    authController.requireSignin,
    userCtrl.addFollowing,
    userCtrl.addFollower
  );
userRouter
  .route("/api/users/unfollow/jojo")
  .put(
    authController.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
  );

userRouter
  .route("/api/users/findpeople/:userId")
  .get(authController.requireSignin, userCtrl.findPeople);

userRouter.route("/api/users").post(userCtrl.create).get(userCtrl.list);

export default userRouter;
