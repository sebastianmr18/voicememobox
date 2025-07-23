import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_BUCKET_NAME!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get("fileType");
  const userId = searchParams.get("userId") ?? "anonymous";

  const fileName = `audio-uploads/${userId}/${Date.now()}-${uuidv4()}.mp3`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    ContentType: fileType || "audio/mpeg",
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 mins

  return NextResponse.json({ url: signedUrl, key: fileName });
}
