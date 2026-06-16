import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AppError } from '../../../common/errors/app-error.js';

interface CreateUploadUrlOptions {
  objectKey: string;
  contentType: string;
}

export class S3UploadProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly uploadUrlExpiresIn: number;
  private readonly downloadUrlExpiresIn: number;

  constructor() {
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!region) {
      throw new AppError(500, 'AWS_REGION이 설정되어 있지 않습니다.');
    }

    if (!bucketName) {
      throw new AppError(500, 'AWS_S3_BUCKET_NAME이 설정되어 있지 않습니다.');
    }

    this.s3Client = new S3Client({ region });
    this.bucketName = bucketName;
    this.uploadUrlExpiresIn = Number(
      process.env.AWS_S3_UPLOAD_URL_EXPIRES_IN_SECONDS ?? 300,
    );
    this.downloadUrlExpiresIn = Number(
      process.env.AWS_S3_DOWNLOAD_URL_EXPIRES_IN_SECONDS ?? 1800,
    );
  }

  async createUploadUrl({
    objectKey,
    contentType,
  }: CreateUploadUrlOptions): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.uploadUrlExpiresIn,
    });
  }

  async createDownloadUrl(objectKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.downloadUrlExpiresIn,
    });
  }
}
