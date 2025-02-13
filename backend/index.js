import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { requireAuth } from "@clerk/express";
import { uploadFile } from "./controllers/uploadController.js";
import {
  getChatsById,
  listChats,
  updateChatsByID,
} from "./controllers/chatControllers.js";
import { createOrUpdateUserChats } from "./controllers/userChatsController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

const router = express.Router();

app.use("/api", router);

router.get("/test", requireAuth(), (req, res) => {
  res.send("Success!!");
});

router.get("/upload", uploadFile);

router.post("/chats", requireAuth(), listChats);

router.get("/userchats", requireAuth(), createOrUpdateUserChats);

router.get("/chats/:id", requireAuth(), getChatsById);

router.put("/chats/:id", requireAuth(), updateChatsByID);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthorized!");
});

router.use(express.static(path.join(__dirname, "../client")));
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    await connect();
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();
