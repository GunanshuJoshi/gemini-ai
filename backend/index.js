import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { requireAuth } from "@clerk/express";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_API_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});
const port = process.env.PORT || 3000;

const connect = async () => {
  try {
    const mongodb = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("🚀 ~ connected to mongoDB");
  } catch (error) {
    console.log("🚀 ~ connect ~ error:", error);
  }
};

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
// app.use(cors());

app.use(express.json());

app.get("/api/test", requireAuth(), (req, res) => {
  const userId = req.auth.userId;
  console.log("🚀 ~ app.get ~ userId:", userId);
  res.send("Success!!");
});

app.get("/api/upload", (req, res) => {
  console.log("here in the call");
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  console.log("🚀 ~ app.post ~ userId:", userId);
  const { text } = req.body;
  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    console.log("🚀 ~ app.post ~ newChat:", newChat);
    const savedChat = await newChat.save();
    console.log("🚀 ~ app.post ~ savedChat:", savedChat);
    const userChat = await UserChats.find({ userId: userId });
    console.log("🚀 ~ app.post ~ userChat:", userChat);

    if (!userChat.length) {
      console.log("here inside the chats ");
      const newUserChat = new UserChats({
        userId: userId,
        chats: {
          _id: savedChat._id,
          title: text.substring(0, 40),
        },
      });
      console.log("🚀 ~ app.post ~ newUserChat:", newUserChat);

      const res = await newUserChat.save();
      console.log("🚀 ~ app.post ~ res:", res);
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    console.log("🚀 ~ app.post ~ (newChat._id:", newChat._id);
    res.status(201).send(newChat._id);
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);
    res.status(500).send("Error creating a chat!");
  }
  console.log("🚀 ~ app.post ~ text:", text);
});

app.get("/api/userchats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId });
    if (userChats.length <= 0) {
      return res.status(200).send([]);
    }
    res.status(200).send(userChats[0].chats || []);
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error);
    res.status(500).send("Error fetching user chats!");
  }
});

app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const id = req.params.id;
  console.log("🚀 ~ app.get ~ id:", id);
  console.log("🚀 ~ app.get ~ userId:", userId);

  try {
    const chatsData = await Chat.findOne({ _id: id, userId });
    console.log("🚀 ~ app.get ~ chatsData:", chatsData);
    res.status(200).send(chatsData || []);
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const id = req.params.id;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];
  try {
    const updateData = await Chat.updateOne(
      { _id: id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    console.log("🚀 ~ app.get ~ updateData:", updateData);
    res.status(200).send(updateData);
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error);
    res.status(500).send("Error updating chat!");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthorized!");
});

app.use(express.static(path.join(__dirname, "../client")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.listen(port, () => {
  connect();
  console.log(`Listening to port ${port}`);
});
