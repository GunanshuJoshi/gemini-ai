import UserChats from "../models/userChats.js";

export const createOrUpdateUserChats = async (req, res, requireAuth) => {
  try {
    console.log("inside the logs of userchats");
    await requireAuth();
    const userId = req.auth.userId;
    console.log("🚀 ~ createOrUpdateUserChats ~ userId:", userId);

    const userChats = await UserChats.find({ userId });
    console.log("🚀 ~ createOrUpdateUserChats ~ userChats:", userChats);
    res.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log("🚀 ~ router.get ~ error:", error);
    return res.status(500).send("Error fetching the user chats!!");
  }
};
