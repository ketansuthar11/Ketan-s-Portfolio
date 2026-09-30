import type { Request, Response } from "express";

import {
    createContactMessage,
    getAllMessages,
    getMessageById,
    markMessageAsRead,
    removeMessage,
} from "../services/message.service.js";


export const getAllMessagesController = async (
    _req: Request,
    res: Response
) => {
    const messages = await getAllMessages();

    return res.status(200).json({
        success: true,
        data: messages,
    });
};

export const getMessageByIdController = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;

    if(typeof id !=="string") throw new Error("Id must be a string");

    const message = await getMessageById(id);

    return res.status(200).json({
        success: true,
        data: message,
    });
};

export const createContactMessageController = async (
    req: Request,
    res: Response
) => {
    const { name, email, message } = req.body;

    const result = await createContactMessage({
        name,
        email,
        message,
    });

    return res.status(201).json({
        success: true,
        data: result,
    });
};

export const markMessageReadController = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id;

    if(typeof id !=="string") throw new Error("Id must be a string");

    const message = await markMessageAsRead(id);

    return res.status(200).json({
        success: true,
        data: message,
    });
};

export const deleteMessageController = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;

    if(typeof id !=="string") throw new Error("Id must be a string");

    await removeMessage(id);

    return res.status(200).json({
        success: true,
        message: "MESSAGE_DELETED",
    });
};