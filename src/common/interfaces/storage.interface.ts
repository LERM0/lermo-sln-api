export interface IStorageService {
  uploadFile(bufferFile: Buffer, targetURI: string, acl?: string): Promise<ResUploadFile>;
  getUrl?(URI: string): string;
  getLocationPath?(key: string): string;
  createBucket(): Promise<void>
  setBucketPolicy(): Promise<void>
  getPresignedUrl(objectName: string, expiryInSeconds: number): Promise<string>
  uploadImage(
    buffer: Buffer,
    filePath: string,
  ): Promise<string>
}

export enum UploadKey {
  AVATAR = 'user-avatar',
  BANNER = 'user-banner',
  VIDEO_THUMBNAIL = 'video-thumbnail',
  VIDEO_SOURCE = 'video-source',
  POST_IMAGE = 'post-image',
  CLASSROOM_COVER = 'classroom-cover'
}

export interface ResUploadFile {
  Key: string;
  Location: string;
}