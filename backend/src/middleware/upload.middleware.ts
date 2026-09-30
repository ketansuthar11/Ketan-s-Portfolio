import multer from "multer";

const storage = multer.memoryStorage();

export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error("ONLY_JPEG_PNG_WEBP_ALLOWED")
            );
        }

        cb(null, true);
    },
});

export const uploadResume = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("ONLY_PDF_ALLOWED"));
        }

        cb(null, true);
    },
});