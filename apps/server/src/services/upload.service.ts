import { Storage } from "@google-cloud/storage";
import { env } from "@casty-app/env/server";
import { v4 as uuidv4 } from "uuid";

export class UploadService {
    private storage: Storage | null = null;
    private bucketName: string | undefined;

    constructor() {
        if (env.GCS_PROJECT_ID && env.GCS_CLIENT_EMAIL && env.GCS_PRIVATE_KEY) {
            this.storage = new Storage({
                projectId: env.GCS_PROJECT_ID,
                credentials: {
                    client_email: env.GCS_CLIENT_EMAIL,
                    private_key: env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                },
            });
            this.bucketName = env.GCS_BUCKET;
        }
    }

    async uploadFile(file: File | Blob, folder: string = "uploads") {
        if (!this.storage || !this.bucketName) {
            // Fallback for local development if GCS not configured
            console.warn("GCS not configured. Using mock upload.");
            return `https://storage.googleapis.com/mock-bucket/${folder}/${uuidv4()}`;
        }

        const bucket = this.storage.bucket(this.bucketName);
        const fileName = `${folder}/${uuidv4()}`;
        const fileRef = bucket.file(fileName);

        const buffer = Buffer.from(await file.arrayBuffer());

        await fileRef.save(buffer, {
            contentType: (file as any).type || "application/octet-stream",
        });

        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }
}

export const uploadService = new UploadService();
