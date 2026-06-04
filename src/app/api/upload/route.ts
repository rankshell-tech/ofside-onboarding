// VENUE PARTNER — disabled (S3 presigned uploads for venue onboarding assets)
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: "Venue partner file upload is disabled." },
    { status: 503 },
  );
}

/*
// src/app/api/upload/route.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  ... see git history for full implementation ...
}
*/
