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
    const {
        email,
        password,
    } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        throw new Error(
            "EMAIL_AND_PASSWORD_REQUIRED"
        );
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
    req: Request,
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