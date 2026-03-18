import {tailorSignup,tailorLogin} from "../../controllers/Auth/tailorController.js"
import express from "express"

const router = express.Router();

router.post("/login",tailorLogin)
router.post("/signup",tailorSignup)

export default router;