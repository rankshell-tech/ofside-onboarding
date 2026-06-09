export type SupportAttachment = {
  url: string;
  fileKey: string;
  fileName: string;
  fileType: string;
};

const SUPPORT_ATTACHMENT_URL_PATH = "/api/support/attachment-url";
const MAX_SUPPORT_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const mimeTypeMap: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const getMimeType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
  return mimeTypeMap[extension] || "application/octet-stream";
};

export const MAX_SUPPORT_ATTACHMENT_COUNT = MAX_SUPPORT_ATTACHMENTS;

export const uploadSupportAttachment = async (
  file: File
): Promise<SupportAttachment> => {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error("Attachment must be 5 MB or smaller.");
  }

  const fileName = file.name || `attachment-${Date.now()}`;
  const fileType = file.type || getMimeType(fileName);

  const presignedResponse = await fetch(SUPPORT_ATTACHMENT_URL_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, fileType }),
  });

  const presignedData = await presignedResponse.json().catch(() => ({}));
  if (!presignedResponse.ok || !presignedData?.success || !presignedData?.data) {
    throw new Error(presignedData?.message || "Failed to get upload URL.");
  }

  const { uploadUrl, publicUrl, fileKey } = presignedData.data;
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": fileType },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload attachment.");
  }

  return { url: publicUrl, fileKey, fileName, fileType };
};
