import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { NextResponse, NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function streamToString(stream: Readable | null): Promise<string> {
  if (!stream) return "";

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function baseName(key: string): string {
  return (
    key
      .split("/")
      .pop()
      ?.replace(/(\.json|\.summary\.json)$/, "") ?? ""
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const bucket = process.env.AWS_BUCKET_NAME!;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const transcriptionPrefix = `transcriptions/${userId}/`;
  const audioPrefix = `audio-uploads/${userId}/`;
  const metadataPrefix = `metadata/${userId}/`;

  try {
    const [transcriptionList, audioList, metadataList] = await Promise.all([
      s3.send(
        new ListObjectsCommand({ Bucket: bucket, Prefix: transcriptionPrefix }),
      ),
      s3.send(new ListObjectsCommand({ Bucket: bucket, Prefix: audioPrefix })),
      s3.send(
        new ListObjectsCommand({ Bucket: bucket, Prefix: metadataPrefix }),
      ),
    ]);

    const audioMap = new Map(
      (audioList.Contents ?? []).map((item) => [
        baseName(item.Key!),
        item.Key!,
      ]),
    );

    const metadataMap = new Map(
      (metadataList.Contents ?? []).map((item) => [
        baseName(item.Key!),
        item.Key!,
      ]),
    );

    const results = await Promise.all(
      (transcriptionList.Contents ?? [])
        .filter((item) => item.Key?.endsWith(".json"))
        .map(async (item) => {
          const transcriptionKey = item.Key!;
          const name = baseName(transcriptionKey);

          const audioKey = audioMap.get(`${name}.mp3`);
          const metadataKey = metadataMap.get(name);

          const [transcription, audio, metadata] = await Promise.all([
            s3
              .send(
                new GetObjectCommand({ Bucket: bucket, Key: transcriptionKey }),
              )
              .then((res) => streamToString(res.Body as any)),

            s3
              .send(new GetObjectCommand({ Bucket: bucket, Key: audioKey }))
              .then((res) => streamToString(res.Body as any)),

            s3
              .send(new GetObjectCommand({ Bucket: bucket, Key: metadataKey }))
              .then((res) => streamToString(res.Body as any)),
          ]);

          const transcriptionJson = JSON.parse(transcription);
          const metadataJson = JSON.parse(metadata);

          return {
            id: name,
            filename: `${name}.mp3`,
            transcription:
              transcriptionJson.results?.transcripts?.[0]?.transcript ?? "",
            duration:
              transcriptionJson.results?.transcripts?.[0]?.duration ?? 0,
            audioUrl: audio,
            createdAt: item.LastModified?.toISOString() ?? null,
            metadata: {
              size: metadataJson.results?.metadata?.size ?? 0,
              format: metadataJson.originalExtension ?? "",
            },
          };
        }),
    );

    return NextResponse.json({ memos: results });
  } catch (error) {
    console.error("S3 list error:", error);
    return NextResponse.json(
      { error: "Error listing transcriptions" },
      { status: 500 },
    );
  }
}

/*import {
  S3Client,  
  GetObjectCommand,
  ListObjectsCommand
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
  const bucket = process.env.AWS_BUCKET_NAME!;

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const prefix = `transcriptions/${userId}/`;

  try {
    const res = await s3.send(
      new ListObjectsCommand({ Bucket: bucket, Prefix: prefix }),
    );
    console.log(res);
        const files = res.Contents?.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
    })) ?? [];

    return NextResponse.json({ files });
  } catch (error) {
        console.error("S3 list error:", error);
    return NextResponse.json(
      { error: "Error listing transcriptions" },
      { status: 500 }
    );
  }
}
*/
