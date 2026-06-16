import { randomUUID } from 'crypto';

import { AppError } from '../../common/errors/app-error.js';
import { S3UploadProvider } from './provider/s3-upload.provider.js';

import type {
  CreatePresignedUrlsRequest,
  CreatePresignedUrlsResponse,
  UploadFileRequest,
} from './uploads.types.js';

const MAX_UPLOAD_COUNT = 3;

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const CONTENT_TYPE_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export class UploadsService {
  constructor(
    private readonly s3UploadProvider = new S3UploadProvider(),
  ) { }

  async createPresignedUrls(
    userId: string,
    request: CreatePresignedUrlsRequest,
  ): Promise<CreatePresignedUrlsResponse> {
    this.validateFiles(request.files);

    const uploads = await Promise.all(
      request.files.map(async (file) => {
        const objectKey = this.createObjectKey(userId, file);

        return {
          objectKey,
          uploadUrl: await this.s3UploadProvider.createUploadUrl({
            objectKey,
            contentType: file.contentType,
          }),
        };
      }),
    );

    return { uploads };
  }

  private validateFiles(files: UploadFileRequest[]): void {
    if (!Array.isArray(files)) {
      throw new AppError(400, 'files는 배열이어야 합니다.');
    }

    if (files.length < 1) {
      throw new AppError(400, '업로드할 파일이 필요합니다.');
    }

    if (files.length > MAX_UPLOAD_COUNT) {
      throw new AppError(400, '사진은 최대 3장까지 업로드할 수 있습니다.');
    }

    files.forEach((file) => {
      if (!file.fileName?.trim()) {
        throw new AppError(400, '파일 이름이 필요합니다.');
      }

      if (!ALLOWED_CONTENT_TYPES.has(file.contentType)) {
        throw new AppError(400, '지원하지 않는 이미지 형식입니다.');
      }
    });
  }

  private createObjectKey(userId: string, file: UploadFileRequest): string {
    const extension = CONTENT_TYPE_EXTENSION[file.contentType];

    return `records/${userId}/${randomUUID()}.${extension}`;
  }
}