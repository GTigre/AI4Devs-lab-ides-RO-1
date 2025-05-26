import { Storage } from '@google-cloud/storage';
import { Logger } from '../logging/Logger';

export class FileStorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME || '';
  }

  async uploadFile(file: Express.Multer.File, candidateId: string): Promise<string> {
    try {
      const fileName = `candidates/${candidateId}/${file.originalname}`;
      const fileBuffer = file.buffer;

      await this.storage.bucket(this.bucket).file(fileName).save(fileBuffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const [url] = await this.storage
        .bucket(this.bucket)
        .file(fileName)
        .getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Long expiration for CVs
        });

      Logger.info('File uploaded successfully', { fileName, candidateId });
      return url;
    } catch (error) {
      Logger.error('Error uploading file', { error, candidateId });
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = this.getFileNameFromUrl(fileUrl);
      await this.storage.bucket(this.bucket).file(fileName).delete();
      Logger.info('File deleted successfully', { fileName });
    } catch (error) {
      Logger.error('Error deleting file', { error, fileUrl });
      throw error;
    }
  }

  private getFileNameFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/').slice(3).join('/');
  }
} 