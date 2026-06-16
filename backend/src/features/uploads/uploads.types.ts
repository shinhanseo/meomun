export interface CreatePresignedUrlsRequest {
  files: UploadFileRequest[];
}

export interface UploadFileRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUpload {
  objectKey: string;
  uploadUrl: string;
}

export interface CreatePresignedUrlsResponse {
  uploads: PresignedUpload[];
}