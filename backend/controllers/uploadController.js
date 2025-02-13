import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_API_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});
export const uploadFile = async (req, res, next) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).send(result);
  } catch (error) {
    next(
      new AppError("Error generating upload authentication parameters", 500)
    );
  }
};
