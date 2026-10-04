import jwt from "jsonwebtoken";

const getAdminEmail = (): string => {
    const value = process.env.ADMIN_EMAIL;

    if (!value) {
        throw new Error(
            "ADMIN_EMAIL is not configured"
        );
    }

    return value;
};

const getAdminPassword = (): string => {
    const value = process.env.ADMIN_PASSWORD;

    if (!value) {
        throw new Error(
            "ADMIN_PASSWORD is not configured"
        );
    }

    return value;
};

const getJwtSecret = (): string => {
    const value = process.env.JWT_SECRET;

    if (!value) {
        throw new Error(
            "JWT_SECRET is not configured"
        );
    }

    return value;
};

export const loginAdmin = (
    email: string,
    password: string
) => {
    const adminEmail = getAdminEmail();
    const adminPassword = getAdminPassword();
    const jwtSecret = getJwtSecret();

    if (
        email.trim() !== adminEmail.trim() ||
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
    const jwtSecret = getJwtSecret();

    return jwt.verify(
        token,
        jwtSecret
    );
};