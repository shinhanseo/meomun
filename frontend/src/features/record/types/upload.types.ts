export interface UploadFileRequest {
  fileName: string;
  contentType: string;
}

export interface CreatePresignedUrlsRequest {
  files: UploadFileRequest[];
}

export interface PresignedUpload {
  objectKey: string;
  uploadUrl: string;
}

export interface CreatePresignedUrlsResponse {
  uploads: PresignedUpload[];
}

export interface SelectedRecordImage {
  uri: string;
  fileName: string;
  contentType: string;
}