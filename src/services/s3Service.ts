import { GetObjectCommand } from "@aws-sdk/client-s3"; // AWS SDK v3 S3 command
import { s3 } from "../config/awsConfig"; // Adjusted path if needed
import logger from "../utils/logger"; // Import Winston logger

const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  try {
    const obj = file as Express.MulterS3.File;
    const s3Path = obj.location;

    logger.info(`File uploaded successfully: ${s3Path}`);
    return s3Path;
  } catch (error: any) {
    logger.error(`File upload failed: ${error.message}`);
    throw new Error("File upload failed: " + error.message);
  }
};

// Example function to get file from S3
const getFile = async (bucketName: string, fileName: string) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  const command = new GetObjectCommand(params);

  try {
    const result = await s3.send(command); // Send the GetObject command to AWS S3
    logger.info(`File retrieved successfully from S3: ${fileName}`);
    return result;
  } catch (error: any) {
    logger.error(`Error getting file from S3: ${error.message}`);
    throw new Error("Error getting file from S3: " + error.message);
  }
};

export { uploadFile, getFile };
