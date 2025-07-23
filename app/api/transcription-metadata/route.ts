import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse, NextRequest } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const bucket = process.env.AWS_BUCKET_NAME!;

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  const key = `transcriptions/${filename}.json`;

  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = await res.Body?.transformToString();
    const metadata = JSON.parse(body || "{}");

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error fetching transcription metadata from S3:", error);
    return NextResponse.json(
      { error: "Failed to retrieve transcription metadata" },
      { status: 500 },
    );
  }
}