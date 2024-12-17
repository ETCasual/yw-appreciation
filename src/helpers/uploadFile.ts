/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { env } from "@/env";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
export const uploadFile = async (file: File) => {
  // S3 Bucket Name
  const S3_BUCKET = env.NEXT_PUBLIC_AWS_S3_BUCKET;

  // S3 Region
  const REGION = env.NEXT_PUBLIC_AWS_REGION;

  // S3 Credentials
  AWS.config.update({
    accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  // Files Parameters
  const params = {
    Bucket: S3_BUCKET,
    Key: `thanksgiving-${uuidv4()}.${file?.name.split(".")[1]}`,
    Body: file,
  };

  // Uploading file to s3

  const upload = s3
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      // File uploading progress
      return console.log(evt.loaded);
    })
    .promise();

  await upload
    .then(() => {
      console.log("File uploaded successfully to S3.");
    })
    .catch((err) => {
      console.error(err);
      alert("Server Error");
    });
  return params.Key || "";
};

export const sendFetch = async (to: string, message: string, image: string) => {
  const formBody = JSON.stringify({ to, message, image });
  console.log(formBody);
  return await fetch("/api/submitCard", {
    method: "POST",
    body: formBody,
  });
};
