import { File, UploadType } from 'expo-file-system';

import { apiClient } from '../../../shared/api/client';
import type {
  CreatePresignedUrlsRequest,
  CreatePresignedUrlsResponse,
  SelectedRecordImage,
} from '../types/upload.types';

async function createPresignedUrls(body: CreatePresignedUrlsRequest) {
  console.log('[record-upload] create presigned urls request', body);

  const { data } = await apiClient.post<CreatePresignedUrlsResponse>(
    '/api/uploads/presigned-urls',
    body,
  );

  console.log('[record-upload] create presigned urls response', data);

  return data;
}

async function uploadToS3(uploadUrl: string, image: SelectedRecordImage) {
  console.log('[record-upload] upload to s3 start', {
    fileName: image.fileName,
    contentType: image.contentType,
    uri: image.uri,
  });

  const file = new File(image.uri);
  const result = await file.upload(uploadUrl, {
    httpMethod: 'PUT',
    uploadType: UploadType.BINARY_CONTENT,
    headers: {
      'Content-Type': image.contentType,
    },
  });

  console.log('[record-upload] upload to s3 response', {
    fileName: image.fileName,
    status: result.status,
    body: result.body,
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`S3 이미지 업로드에 실패했습니다. status=${result.status}`);
  }

  console.log('[record-upload] upload to s3 success', {
    fileName: image.fileName,
  });
}

async function uploadRecordImages(images: SelectedRecordImage[]) {
  if (images.length === 0) {
    console.log('[record-upload] skip image upload: no images');
    return [];
  }

  console.log('[record-upload] upload record images start', {
    count: images.length,
    images: images.map((image) => ({
      fileName: image.fileName,
      contentType: image.contentType,
      uri: image.uri,
    })),
  });

  const { uploads } = await createPresignedUrls({
    files: images.map((image) => ({
      fileName: image.fileName,
      contentType: image.contentType,
    })),
  });

  await Promise.all(
    uploads.map((upload, index) => uploadToS3(upload.uploadUrl, images[index])),
  );

  console.log('[record-upload] upload record images success', {
    objectKeys: uploads.map((upload) => upload.objectKey),
  });

  return uploads.map((upload) => upload.objectKey);
}

export const uploadApi = {
  createPresignedUrls,
  uploadToS3,
  uploadRecordImages,
};
