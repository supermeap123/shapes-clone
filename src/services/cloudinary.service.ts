import { v2 as cloudinary } from 'cloudinary';
import { CustomError } from '../middleware/errorHandler';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResponse {
  url: string;
  publicId: string;
}

export class CloudinaryService {
  private static instance: CloudinaryService;

  private constructor() {}

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload a file to Cloudinary
   * @param file The file buffer to upload
   * @param folder The folder to upload to (e.g., 'avatars', 'banners')
   * @returns Promise<UploadResponse>
   */
  public async uploadFile(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadResponse> {
    try {
      // Convert buffer to base64
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(base64File, {
        folder: `shapes/${folder}`,
        resource_type: 'auto',
        transformation: [
          { width: 1000, crop: 'limit' }, // Limit max width while maintaining aspect ratio
          { quality: 'auto:good' }, // Automatic quality optimization
          { fetch_format: 'auto' }, // Automatic format optimization
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new CustomError('Failed to upload file', 500);
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId The public ID of the file to delete
   */
  public async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new CustomError('Failed to delete file', 500);
    }
  }

  /**
   * Upload an avatar image
   * @param file The avatar file to upload
   * @returns Promise<UploadResponse>
   */
  public async uploadAvatar(file: Express.Multer.File): Promise<UploadResponse> {
    return this.uploadFile(file, 'avatars');
  }

  /**
   * Upload a banner image
   * @param file The banner file to upload
   * @returns Promise<UploadResponse>
   */
  public async uploadBanner(file: Express.Multer.File): Promise<UploadResponse> {
    return this.uploadFile(file, 'banners');
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url The Cloudinary URL
   * @returns string The public ID
   */
  public getPublicIdFromUrl(url: string): string {
    const matches = url.match(/shapes\/[^/]+\/([^.]+)/);
    if (!matches) {
      throw new Error('Invalid Cloudinary URL format');
    }
    return matches[1];
  }
}

// Export singleton instance
export const cloudinaryService = CloudinaryService.getInstance();
