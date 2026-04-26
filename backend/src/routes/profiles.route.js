import express from "express";
import {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfiles,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.route("/profiles").post(createProfile).get(getProfiles);

router
  .route("/profiles/:profile_name")
  .put(updateProfile)
  .delete(deleteProfile);

export default router;
