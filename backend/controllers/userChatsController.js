import UserChats from "../models/userChats.js";

export const createOrUpdateUserChats = async (req, res) => {
  console.log("inside the logs of userchats");

  const userId = req.auth.userId;
  console.log("🚀 ~ createOrUpdateUserChats ~ userId:", userId);

  try {
    const userChats = await UserChats.find({ userId });
    console.log("🚀 ~ createOrUpdateUserChats ~ userChats:", userChats);
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
