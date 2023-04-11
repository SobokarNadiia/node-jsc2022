import { extname } from "node:path";

import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { v4 } from "uuid";

import { configs } from "../configs";

class S3Service {
  constructor(
    private client = new S3Client({
      region: configs.AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KET,
      },
    })
  ) {}

  public async uploadPhoto(
    file: UploadedFile,
    itemType: string,
    itemId: string
  ): Promise<string> {
    const filePath = this.buildPath(file.name, itemType, itemId);

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_BUCKET_NAME,
        Key: filePath,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: configs.AWS_S3_BUCKET_ACL,
      })
    );
    return filePath;
  }
  public async deletePhoto(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_S3_BUCKET_NAME,
        Key: filePath,
      })
    );
  }

  private buildPath(
    fileName: string,
    itemType: string,
    itemId: string
  ): string {
    return `${itemType}/${itemId}/${v4()}${extname(fileName)}`;
  }
}

export const s3Service = new S3Service();
