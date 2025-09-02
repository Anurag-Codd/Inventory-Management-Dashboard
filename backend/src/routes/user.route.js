import express from "express"
import { createNewInvoice } from "../controllers/user.controller.js"

const router = express.Router()
router.post("/create-invoice",createNewInvoice)

export default router