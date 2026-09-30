import {
    createMessage,
    deleteMessage,
    findAllMessages,
    findMessageById,
    updateMessageStatus,
} from "../repository/message.repository.js";

export const getAllMessages = async () => {
    return findAllMessages();
};

export const getMessageById = async (id: string) => {
    const message = await findMessageById(id);

    if (!message) {
        throw new Error("MESSAGE_NOT_FOUND");
    }

    return message;
};

export const createContactMessage = async (data: {
    name: string;
    email: string;
    message: string;
}) => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const message = data.message.trim();

    if (!name) {
        throw new Error("NAME_REQUIRED");
    }

    if (!email) {
        throw new Error("EMAIL_REQUIRED");
    }

    if (!email.includes("@")) {
        throw new Error("INVALID_EMAIL");
    }

    if (!message) {
        throw new Error("MESSAGE_REQUIRED");
    }

    return createMessage({
        name,
        email,
        message,
    });
};

export const markMessageAsRead = async (id: string) => {
    const message = await findMessageById(id);

    if (!message) {
        throw new Error("MESSAGE_NOT_FOUND");
    }

    return updateMessageStatus(id, "READ");
};

export const removeMessage = async (id: string) => {
    const message = await findMessageById(id);

    if (!message) {
        throw new Error("MESSAGE_NOT_FOUND");
    }

    await deleteMessage(id);
};