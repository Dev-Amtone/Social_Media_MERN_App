import express from "express";
import userCtrl from "../controllers/user.controller";
import authController from "../controllers/auth.controller";

const userRouter = express.Router();
userRouter.route("/api/users").post(userCtrl.create).get(userCtrl.list);
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
userRouter.param("userId", userCtrl.userByID);

export default userRouter;
