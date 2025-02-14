import UserChats from "../models/userChats.js";

export const createOrUpdateUserChats = async (req, res) => {
  try {
    console.log("inside the logs of userchats");
    const userId = req.auth.userId;
    console.log("🚀 ~ createOrUpdateUserChats ~ userId:", userId);

    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
};
