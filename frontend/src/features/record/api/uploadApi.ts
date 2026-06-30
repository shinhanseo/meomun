import { File, UploadType } from 'expo-file-system';

import { apiClient } from '../../../shared/api/client';
import type {
  CreatePresignedUrlsRequest,
  CreatePresignedUrlsResponse,
  SelectedRecordImage,
} from '../types/upload.types';

async function createPresignedUrls(body: CreatePresignedUrlsRequest) {

  const { data } = await apiClient.post<CreatePresignedUrlsResponse>(
    '/api/uploads/presigned-urls',
    body,
  );

  return data;
}

async function uploadToS3(uploadUrl: string, image: SelectedRecordImage) {

  const file = new File(image.uri);
  const result = await file.upload(uploadUrl, {
    httpMethod: 'PUT',
    uploadType: UploadType.BINARY_CONTENT,
    headers: {
      'Content-Type': image.contentType,
    },
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`S3 이미지 업로드에 실패했습니다. status=${result.status}`);
  }
}

async function uploadRecordImages(images: SelectedRecordImage[]) {
  if (images.length === 0) {
    return [];
  }

  const { uploads } = await createPresignedUrls({
    files: images.map((image) => ({
      fileName: image.fileName,
      contentType: image.contentType,
    })),
  });

  await Promise.all(
    uploads.map((upload, index) => uploadToS3(upload.uploadUrl, images[index])),
  );

  return uploads.map((upload) => upload.objectKey);
}

export const uploadApi = {
  createPresignedUrls,
  uploadToS3,
  uploadRecordImages,
};
