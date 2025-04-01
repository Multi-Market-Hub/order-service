// src/config/multerS3Config.ts
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./awsConfig";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME || "your-bucket-name",
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

export default upload;
