import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

// ✅ Create or Update Chat
export const listChats = async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();
    console.log("✅ Chat saved:", savedChat);

    const userChats = await UserChats.find({ userId: userId });

    if (!userChats.length) {
      console.log("🔹 Creating new UserChats entry...");
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
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

    res.status(201).json({ chatId: savedChat._id });
  } catch (error) {
    console.error("❌ Error creating chat:", error);
    return res.status(500).json({ error: "Error creating chat!" });
  }
};

// ✅ Fetch Chat by ID
export const getChatsById = async (req, res) => {
  const userId = req.auth.userId;
  const id = req.params.id;
  console.log(`🔎 Fetching chat with ID: ${id} for User: ${userId}`);

  try {
    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!" });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("❌ Error fetching chat:", error);
    return res.status(500).json({ error: "Error fetching chat!" });
  }
};

// ✅ Update Chat by ID
export const updateChatsByID = async (req, res) => {
  const userId = req.auth.userId;

  const id = req.params.id;
  const { question, answer, img } = req.body;

  console.log(`🔄 Updating chat ID: ${id} for User: ${userId}`);

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
          history: { $each: newItems },
        },
      }
    );
    res.status(200).send(updateData);
  } catch (error) {
    console.error("❌ Error updating chat:", error);
    return res.status(500).json({ error: "Error updating chat!" });
  }
};
