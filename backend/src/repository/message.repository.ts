import prisma from "../config/prisma.js";
import type { MessageStatus } from "@prisma/client";

export const findAllMessages = async () => {
    return prisma.contactMessage.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findMessageById = async (id: string) => {
    return prisma.contactMessage.findUnique({
        where: { id },
    });
};

export const createMessage = async (data: {
    name: string;
    email: string;
    message: string;
}) => {
    return prisma.contactMessage.create({
        data,
    });
};

export const updateMessageStatus = async (
    id: string,
    status: MessageStatus
) => {
    return prisma.contactMessage.update({
        where: { id },
        data: { status },
    });
};

export const deleteMessage = async (id: string) => {
    return prisma.contactMessage.delete({
        where: { id },
    });
};