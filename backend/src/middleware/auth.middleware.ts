import type {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    verifyToken,
} from "../services/auth.service.js";

export const authMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authorization =
        req.headers.authorization;

    if (!authorization) {
        throw new Error(
            "UNAUTHORIZED"
        );
    }

    const [type, token] =
        authorization.split(" ");

    if (
        type !== "Bearer" ||
        !token
    ) {
        throw new Error(
            "UNAUTHORIZED"
        );
    }

    verifyToken(token);

    next();
};