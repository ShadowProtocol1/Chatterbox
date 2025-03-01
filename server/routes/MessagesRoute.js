import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getMessages, } from '../controllers/MessagesController.js';
import multer from "multer"

const messagesRoutes = Router();

const multer = multer({ dest: "uploads/files" })
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/send-message", verifyToken, multer.single("file"), sendMessage);

export default messagesRoutes;