import type {
    Request,
    Response,
} from "express";

import {
    loginAdmin,
} from "../services/auth.service.js";

export const loginController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "EMAIL_AND_PASSWORD_REQUIRED",
            });
        }

        const token = loginAdmin(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            data: {
                token,
            },
        });
    } catch (error) {
        console.error(
            "Admin login error:",
            error
        );

        if (
            error instanceof Error &&
            error.message ===
                "INVALID_CREDENTIALS"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "INVALID_CREDENTIALS",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "LOGIN_FAILED",
        });
    }
};

export const logoutController = async (
    _req: Request,
    res: Response
) => {
    return res.status(200).json({
        success: true,
        message: "LOGGED_OUT",
    });
};

export const meController = async (
    _req: Request,
    res: Response
) => {
    return res.status(200).json({
        success: true,
        data: {
            authenticated: true,
            role: "ADMIN",
        },
    });
};