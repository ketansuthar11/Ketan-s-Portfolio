import "dotenv/config";

console.log("BUCKET:", process.env.AWS_S3_BUCKET);

import { neonStorageService } from "./storage/neon-storage.service.js";

const test = async () => {
    try {
        const content = Buffer.from("Hello from my portfolio backend!");

        // await neonStorageService.upload(
        //     "test/hello.txt",
        //     content,
        //     "text/plain"
        // );

        console.log("✅ File uploaded successfully");

        await neonStorageService.delete("test/hello.txt");

        console.log("✅ File deleted successfully");
    } catch (error) {
        console.error("❌ Storage test failed:", error);
    }
};

test();