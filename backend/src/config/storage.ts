import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!endpoint) {
    throw new Error("AWS_ENDPOINT_URL_S3 is not configured");
}

if (!region) {
    throw new Error("AWS_REGION is not configured");
}

if (!accessKeyId) {
    throw new Error("AWS_ACCESS_KEY_ID is not configured");
}

if (!secretAccessKey) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not configured");
}

const s3Client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export default s3Client;