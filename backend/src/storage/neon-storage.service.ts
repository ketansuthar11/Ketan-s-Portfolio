import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

import s3Client from "../config/storage.js";

const bucket = process.env.AWS_S3_BUCKET;

if (!bucket) {
    throw new Error(
        "AWS_S3_BUCKET is not configured"
    );
}

export const neonStorageService = {
    async upload(
        key: string,
        body: Buffer,
        contentType: string
    ): Promise<void> {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            })
        );
    },

    async delete(
        key: string
    ): Promise<void> {
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            })
        );
    },

    async getSignedUrl(
        key: string,
        expiresIn = 3600
    ): Promise<string> {
        return getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            }),
            {
                expiresIn,
            }
        );
    },
};