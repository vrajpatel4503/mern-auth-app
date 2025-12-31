import express from "express";
import upload from "../multer/multer.js";
import { userFieldValidationMiddleware } from "../middleware/user.validation.js";
import {
  deleteUserAccountController,
  updateAvatarController,
  updateEmailController,
  updatePhoneNumberController,
  updateUserPassword,
  userDetailsController,
  userLastLoginController,
  userLoginController,
  userLogoutController,
  userRegistrationController,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// ---- Router :-  user registration -----
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  userFieldValidationMiddleware,
  userRegistrationController
);

// ---- Router :-  user login -----
router.post("/login", userLoginController);

// ---- Router :-  user Logout -----
router.get("/logout", verifyUser, userLogoutController);

// ---- Router :-  user get details -----
router.get("/user/details", verifyUser, userDetailsController);

// ---- Router :-  update email -----
router.patch("/update/email", verifyUser, updateEmailController);

// ---- Router :-  update email -----
router.patch("/update/phoneNumber", verifyUser, updatePhoneNumberController);

// ---- Router :-  delete user account -----
router.delete("/delete/account", verifyUser, deleteUserAccountController);

// ---- Router :-  update user avatar -----
router.put(
  "/update/avatar",
  verifyUser,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateAvatarController
);

// ---- Router :-  update user password -----
router.patch("/update/password", verifyUser, updateUserPassword);

// ---- Router :-  user last login checker -----
router.post("/last/login", userLastLoginController);

export default router;
