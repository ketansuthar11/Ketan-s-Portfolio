import type {
    Request,
    Response,
} from "express";

import {
    generatePortfolioAIResponse,
} from "../services/ai.service.js";

export const portfolioAIChatController =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                message,
                conversation,
            } = req.body;

            if (
                typeof message !==
                "string"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Message is required",
                });
            }

            if (
                conversation !==
                    undefined &&
                !Array.isArray(
                    conversation
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Conversation must be an array",
                });
            }

            const answer =
                await generatePortfolioAIResponse(
                    message,
                    conversation || []
                );

            return res.status(200).json({
                success: true,

                data: {
                    answer,
                },
            });
        } catch (error) {
            console.error(
                "Portfolio AI controller error:",
                error
            );

            if (
                error instanceof Error &&
                error.message ===
                    "MESSAGE_REQUIRED"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Message is required",
                });
            }

            if (
                error instanceof Error &&
                error.message ===
                    "GROQ_API_KEY is not configured"
            ) {
                return res.status(500).json({
                    success: false,
                    message:
                        "AI service is not configured",
                });
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to generate AI response",
            });
        }
    };