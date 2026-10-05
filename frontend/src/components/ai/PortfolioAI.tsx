"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Bot,
    Send,
    X,
    Sparkles,
    User,
    Loader2,
    RotateCcw,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const INITIAL_MESSAGE: Message = {
    role: "assistant",
    content:
        "Hey! 👋 I'm Ketan's AI Assistant. Ask me about his projects, skills, experience, or tech stack.",
};

export default function PortfolioAI() {
    const [isOpen, setIsOpen] =
        useState(false);

    const [input, setInput] =
        useState("");

    const [messages, setMessages] =
        useState<Message[]>([
            INITIAL_MESSAGE,
        ]);

    const [isLoading, setIsLoading] =
        useState(false);

    const messagesEndRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const inputRef =
        useRef<HTMLInputElement | null>(
            null
        );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(
            {
                behavior: "smooth",
            }
        );
    }, [messages, isLoading]);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 150);

        return () => clearTimeout(timer);
    }, [isOpen]);

    const sendMessage = async () => {
        const message = input.trim();

        if (!message || isLoading) {
            return;
        }

        const userMessage: Message = {
            role: "user",
            content: message,
        };

        const updatedMessages = [
            ...messages,
            userMessage,
        ];

        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const conversation =
                updatedMessages
                    .slice(-10)
                    .map((item) => ({
                        role: item.role,
                        content: item.content,
                    }));

            const response =
                await fetch(
                    `${API_URL}/api/ai/chat`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            message,
                            conversation,
                        }),
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Failed to get AI response"
                );
            }

            const assistantMessage: Message =
                {
                    role: "assistant",
                    content:
                        result.data.answer,
                };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);
        } catch (error) {
            console.error(
                "AI chat error:",
                error
            );

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content:
                        "Hmm, I couldn't get that right now. Give it another try.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            INITIAL_MESSAGE,
        ]);
        setInput("");
    };

    const suggestedQuestions = [
        "Show me Ketan's projects",
        "What technologies does Ketan know?",
        "Tell me about Ketan",
    ];

    return (
        <>
            {/* Floating AI Button */}

            {!isOpen && (
                <button
                    type="button"
                    onClick={() =>
                        setIsOpen(true)
                    }
                    aria-label="Open Ketan's AI Assistant"
                    className="
                        fixed
                        bottom-5
                        right-5
                        z-[9999]
                        flex
                        items-center
                        gap-2.5
                        rounded-full
                        border
                        border-[#C7FF00]/70
                        bg-black
                        px-3
                        py-2.5
                        text-white
                        shadow-[0_8px_35px_rgba(0,0,0,0.35)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#C7FF00]
                        hover:shadow-[0_10px_40px_rgba(199,255,0,0.18)]
                    "
                >
                    <span
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-[#C7FF00]
                            text-black
                        "
                    >
                        <Sparkles
                            size={16}
                        />
                    </span>

                    <span
                        className="
                            hidden
                            pr-1
                            text-xs
                            font-semibold
                            sm:block
                        "
                    >
                        Ketan&apos;s AI
                    </span>
                </button>
            )}

            {/* AI Chat */}

            {isOpen && (
                <div
                    className="
                        fixed
                        bottom-5
                        right-5
                        z-[9999]
                        flex
                        h-[560px]
                        w-[380px]
                        max-w-[calc(100vw-24px)]
                        flex-col
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-neutral-800
                        bg-black
                        text-white
                        shadow-[0_20px_70px_rgba(0,0,0,0.55)]
                    "
                >
                    {/* Header */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-between
                            border-b
                            border-neutral-800
                            bg-neutral-950
                            px-4
                            py-3.5
                        "
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#C7FF00]
                                    text-black
                                "
                            >
                                <Bot
                                    size={18}
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3
                                        className="
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Ketan&apos;s AI
                                        Assistant
                                    </h3>

                                    <span
                                        className="
                                            shrink-0
                                            rounded-full
                                            bg-[#C7FF00]/10
                                            px-1.5
                                            py-0.5
                                            text-[9px]
                                            font-semibold
                                            text-[#C7FF00]
                                        "
                                    >
                                        AI
                                    </span>
                                </div>

                                <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                                    Your guide to Ketan&apos;s work
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                            <button
                                type="button"
                                onClick={clearChat}
                                aria-label="Clear chat"
                                title="Clear chat"
                                className="
                                    rounded-lg
                                    p-2
                                    text-neutral-500
                                    transition
                                    hover:bg-neutral-900
                                    hover:text-white
                                "
                            >
                                <RotateCcw
                                    size={15}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsOpen(false)
                                }
                                aria-label="Close AI Assistant"
                                className="
                                    rounded-lg
                                    p-2
                                    text-neutral-500
                                    transition
                                    hover:bg-neutral-900
                                    hover:text-white
                                "
                            >
                                <X
                                    size={17}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Suggested Questions */}

                    {messages.length === 1 && (
                        <div
                            className="
                                shrink-0
                                border-b
                                border-neutral-900
                                px-4
                                py-3
                            "
                        >
                            <p
                                className="
                                    mb-2
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-neutral-600
                                "
                            >
                                You can ask
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {suggestedQuestions.map(
                                    (
                                        question
                                    ) => (
                                        <button
                                            key={
                                                question
                                            }
                                            type="button"
                                            onClick={() => {
                                                setInput(
                                                    question
                                                );

                                                setTimeout(
                                                    () => {
                                                        inputRef.current?.focus();
                                                    },
                                                    0
                                                );
                                            }}
                                            className="
                                                max-w-full
                                                rounded-full
                                                border
                                                border-neutral-800
                                                bg-neutral-950
                                                px-2.5
                                                py-1.5
                                                text-left
                                                text-[11px]
                                                leading-4
                                                text-neutral-400
                                                transition
                                                hover:border-[#C7FF00]/40
                                                hover:text-[#C7FF00]
                                            "
                                        >
                                            {
                                                question
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Messages */}

                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-x-hidden
                            overflow-y-auto
                            px-3.5
                            py-4
                        "
                    >
                        <div className="min-w-0 space-y-4">
                            {messages.map(
                                (
                                    message,
                                    index
                                ) => (
                                    <div
                                        key={`${message.role}-${index}`}
                                        className={`
                                            flex
                                            min-w-0
                                            ${
                                                message.role ===
                                                "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                flex
                                                min-w-0
                                                max-w-[92%]
                                                gap-2
                                                ${
                                                    message.role ===
                                                    "user"
                                                        ? "flex-row-reverse"
                                                        : ""
                                                }
                                            `}
                                        >
                                            {/* Avatar */}

                                            <div
                                                className={`
                                                    mt-0.5
                                                    flex
                                                    h-7
                                                    w-7
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    ${
                                                        message.role ===
                                                        "user"
                                                            ? "bg-neutral-800 text-neutral-300"
                                                            : "bg-[#C7FF00] text-black"
                                                    }
                                                `}
                                            >
                                                {message.role ===
                                                "user" ? (
                                                    <User
                                                        size={
                                                            13
                                                        }
                                                    />
                                                ) : (
                                                    <Bot
                                                        size={
                                                            13
                                                        }
                                                    />
                                                )}
                                            </div>

                                            {/* Message */}

                                            <div
                                                className={`
                                                    min-w-0
                                                    max-w-full
                                                    overflow-hidden
                                                    rounded-2xl
                                                    px-3.5
                                                    py-2.5
                                                    text-[13px]
                                                    leading-5
                                                    ${
                                                        message.role ===
                                                        "user"
                                                            ? "rounded-tr-md bg-[#C7FF00] text-black"
                                                            : "rounded-tl-md border border-neutral-800 bg-neutral-950 text-neutral-300"
                                                    }
                                                `}
                                            >
                                                <div
                                                    className="
                                                        max-w-full
                                                        whitespace-pre-wrap
                                                        break-words
                                                        [overflow-wrap:anywhere]
                                                    "
                                                >
                                                    {
                                                        message.content
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Loading */}

                            {isLoading && (
                                <div className="flex min-w-0 justify-start">
                                    <div className="flex min-w-0 gap-2">
                                        <div
                                            className="
                                                mt-0.5
                                                flex
                                                h-7
                                                w-7
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-[#C7FF00]
                                                text-black
                                            "
                                        >
                                            <Bot
                                                size={13}
                                            />
                                        </div>

                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                max-w-[90%]
                                                items-center
                                                gap-2
                                                rounded-2xl
                                                rounded-tl-md
                                                border
                                                border-neutral-800
                                                bg-neutral-950
                                                px-3.5
                                                py-2.5
                                                text-[12px]
                                                text-neutral-500
                                            "
                                        >
                                            <Loader2
                                                size={14}
                                                className="shrink-0 animate-spin text-[#C7FF00]"
                                            />

                                            <span className="whitespace-nowrap">
                                                Looking through
                                                Ketan&apos;s work...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div
                                ref={
                                    messagesEndRef
                                }
                            />
                        </div>
                    </div>

                    {/* Input */}

                    <div
                        className="
                            shrink-0
                            border-t
                            border-neutral-800
                            bg-neutral-950
                            p-3
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                border-neutral-800
                                bg-black
                                p-1.5
                                transition
                                focus-within:border-[#C7FF00]/50
                            "
                        >
                            <input
                                ref={
                                    inputRef
                                }
                                type="text"
                                value={
                                    input
                                }
                                onChange={(
                                    event
                                ) =>
                                    setInput(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                disabled={
                                    isLoading
                                }
                                placeholder="Ask about Ketan..."
                                className="
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    px-2.5
                                    py-2
                                    text-[13px]
                                    text-white
                                    outline-none
                                    placeholder:text-neutral-600
                                "
                            />

                            <button
                                type="button"
                                onClick={
                                    sendMessage
                                }
                                disabled={
                                    !input.trim() ||
                                    isLoading
                                }
                                aria-label="Send message"
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#C7FF00]
                                    text-black
                                    transition
                                    hover:scale-105
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                    disabled:hover:scale-100
                                "
                            >
                                <Send
                                    size={14}
                                />
                            </button>
                        </div>

                        <p
                            className="
                                mt-1.5
                                text-center
                                text-[9px]
                                text-neutral-700
                            "
                        >
                            Ketan&apos;s AI Assistant
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}