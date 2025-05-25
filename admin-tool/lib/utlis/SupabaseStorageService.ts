'server only';
import { supabaseClient } from '../supabaseClient';

class SupabaseService {
  private static instance: SupabaseService;
  private supabase;
  private imageBucket = process.env.SUPABASE_IMAGE_BUCKET;
  private invoiceBucket = process.env.SUPABASE_INVOICE_BUCKET;
  private productImageBucket = process.env.SUPABASE_PRODUCT_IMAGE_BUCKET;
  private companyImageBucket = process.env.SUPABASE_COMPANY_IMAGE_BUCKET;

  constructor() {
    this.supabase = supabaseClient;
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  /**
   * Uploads a file to the Supabase storage imageBucket.
   * @param {File} file - The file to upload.
   * @returns {Promise<string>} - The public URL of the uploaded file.
   */
  async uploadFile(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = file.name.split('.').shift();

      const filePath = `${this.productImageBucket}/${fileName}.${fileExt}`; // Unique filename
      console.log('filePath', filePath);

      // Upload the file
      const { data, error } = await this.supabase.storage
        .from(this.imageBucket!)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Upload error:', error.message);
        return null;
      }

      // Get the public URL
      return data.path;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  }

  /**
   *
   * @param file
   * @returns
   */
  async uploadCompanyImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = file.name.split('.').shift();

      const filePath = `${this.companyImageBucket}/${fileName}.${fileExt}`; // Unique filename
      console.log('filePath', filePath);

      // Upload the file
      const { data, error } = await this.supabase.storage
        .from(this.imageBucket!)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Upload error:', error.message);
        return null;
      }

      // Get the public URL
      return data.path;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  }

  /**
   * Retrieves the public URL of an uploaded file.
   * @param {string} path - The file path inside the imageBucket.
   * @returns {string} - The public URL.
   */
  async getSingedUrlSupabase(path: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.imageBucket!)
        .createSignedUrl(path, 315000000);
      if (error) {
        console.error('Error getting signed URL:', error.message);
        return null;
      }
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  }

  async getInvoiceUrl(path: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.invoiceBucket!)
        .createSignedUrl(path, 315000000);
      if (error) {
        console.error('Error getting signed URL:', error.message);
        return null;
      }
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  }
}

export const supabaseService = SupabaseService.getInstance();
