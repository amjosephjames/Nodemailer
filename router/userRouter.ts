import express from "express";

const router = express.Router();
import { createUser, getUsers } from "../controller/userController";

router.route("/").get(getUsers).post(createUser);

export default router;
