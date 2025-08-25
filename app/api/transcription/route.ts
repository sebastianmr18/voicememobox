import {
  S3Client,
  ListObjectsV2Command,
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
  const userId = searchParams.get("userId") ?? "anonymous";
  const filename = searchParams.get("filename");
  const bucket = process.env.AWS_BUCKET_NAME!;

  if (!filename)
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });

  const key = `transcriptions/${userId}/${filename}.json`;

  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = await res.Body?.transformToString();
    const json = JSON.parse(body!);

    const transcript = json.results?.transcripts?.[0]?.transcript || null;

    return NextResponse.json({ transcript });
  } catch (error) {
    return NextResponse.json({ transcript: null });
  }
}
