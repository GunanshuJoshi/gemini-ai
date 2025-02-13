import UserChats from "../models/userChats.js";

export const createOrUpdateUserChats = async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId });
    if (!userChats || !userChats[0].chats) {
      console.log("🚀 No chats found for user:", userId);
      return res.status(200).json([]);
    }
    res.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log("🚀 ~ router.get ~ error:", error);
    return res.status(500).send("Error fetching the user chats!!");
  }
};
