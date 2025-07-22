import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  const bucket = process.env.AWS_BUCKET_NAME!;
  const prefix = "metadata/anonymous/";

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const listResult = await s3.send(listCommand);
    const memos = [];

    for (const item of listResult.Contents || []) {
      if (!item.Key) continue;

      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: item.Key,
      });

      const response = await s3.send(getCommand);
      const body = await response.Body?.transformToString();

      if (body) {
        try {
          const metadata = JSON.parse(body);
          memos.push({
            id: item.Key.split("/").pop()?.replace(".json", ""),
            ...metadata,
          });
        } catch (e) {
          console.error(`Error parsing ${item.Key}:`, e);
        }
      }
    }

    return NextResponse.json(memos);
  } catch (error) {
    console.error("Error listing memos:", error);
    return NextResponse.json(
      { error: "Failed to fetch memos" },
      { status: 500 },
    );
  }
}
