import axios from 'axios';

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
  const response = await fetch(image.uri);
  const blob = await response.blob();

  await axios.put(uploadUrl, blob, {
    headers: {
      'Content-Type': image.contentType,
    },
  });
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
