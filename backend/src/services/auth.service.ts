import jwt from "jsonwebtoken";

const adminEmail =
    process.env.ADMIN_EMAIL;

const adminPassword =
    process.env.ADMIN_PASSWORD;

const jwtSecret =
    process.env.JWT_SECRET;

if (!adminEmail) {
    throw new Error(
        "ADMIN_EMAIL is not configured"
    );
}

if (!adminPassword) {
    throw new Error(
        "ADMIN_PASSWORD is not configured"
    );
}

if (!jwtSecret) {
    throw new Error(
        "JWT_SECRET is not configured"
    );
}

export const loginAdmin = (
    email: string,
    password: string
) => {
    if (
        email !== adminEmail ||
        password !== adminPassword
    ) {
        throw new Error(
            "INVALID_CREDENTIALS"
        );
    }

    return jwt.sign(
        {
            email,
            role: "ADMIN",
        },
        jwtSecret,
        {
            expiresIn: "1d",
        }
    );
};

export const verifyToken = (
    token: string
) => {
    return jwt.verify(
        token,
        jwtSecret
    );
};