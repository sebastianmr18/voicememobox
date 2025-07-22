// app/api/transcription-metadata/route.ts
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse, NextRequest } from "next/server";

// Asegúrate de que tus variables de entorno estén configuradas
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

  // Asume que los metadatos están en un archivo .json con el mismo nombre del audio
  // Por ejemplo, si el audio es "audio-123.mp3", el JSON es "transcription-audio-123.json"
  // O como en tu ejemplo: "job-bcbb9d54-5844-40ab-b6e1-872ea80b93bb.json"
  // Ajusta esta lógica según cómo nombres tus archivos JSON de metadatos en S3
  const key = `transcriptions/${filename}.json`; // Ajusta esta ruta si es diferente

  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = await res.Body?.transformToString();
    const metadata = JSON.parse(body || "{}"); // Parsear el JSON

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error fetching transcription metadata from S3:", error);
    return NextResponse.json(
      { error: "Failed to retrieve transcription metadata" },
      { status: 500 },
    );
  }
}