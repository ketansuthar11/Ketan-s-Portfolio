
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity, Award, BadgeCheck, BriefcaseBusiness, Code2,
    GraduationCap, Image, Link2, LoaderCircle, Pencil,
    Plus, RefreshCw, Search, Trash2, UserRound,
    FolderKanban, FileText, PanelsTopLeft, MessageSquare,
    Eye, EyeOff, X, Save,
} from "lucide-react";
import {
    adminFetch,
    type AdminMessage,
} from "@/lib/api/admin";

type RecordItem = Record<string, unknown> & { id?: string };

type Field = {
    name: string;
    label: string;
    type?: "text" | "textarea" | "number" | "date" | "url" | "email" | "select" | "checkbox" | "json";
    options?: string[];
    required?: boolean;
};

type Section = {
    id: string;
    label: string;
    endpoint: string;
    icon: typeof UserRound;
    fields: Field[];
    singleton?: boolean;
};

const sections: Section[] = [
    {
        id: "profile", label: "Profile", endpoint: "/api/admin/profile", icon: UserRound,
        singleton: true,
        fields: [
            { name: "name", label: "Full name", required: true },
            { name: "bio", label: "Bio", type: "textarea" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone" },
            { name: "location", label: "Location" },
        ],
    },
    {
        id: "roles", label: "Roles", endpoint: "/api/admin/profile/roles", icon: BriefcaseBusiness,
        fields: [
            { name: "role", label: "Role title", required: true },
            { name: "isDefault", label: "Default role", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "education", label: "Education", endpoint: "/api/admin/education", icon: GraduationCap,
        fields: [
            { name: "level", label: "Education level", type: "select", options: ["TENTH", "TWELFTH", "DIPLOMA", "BACHELOR", "MASTER", "PHD"], required: true },
            { name: "institutionType", label: "Institution type", type: "select", options: ["SCHOOL", "COLLEGE", "UNIVERSITY", "INSTITUTE"], required: true },
            { name: "institutionName", label: "Institution name", required: true },
            { name: "field", label: "Field / Degree" },
            { name: "boardOrUniversity", label: "Board / University" },
            { name: "startDate", label: "Start date", type: "date" },
            { name: "endDate", label: "End date", type: "date" },
            { name: "scoreType", label: "Score type", type: "select", options: ["CGPA", "PERCENTAGE"] },
            { name: "score", label: "Score", type: "number" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "skills", label: "Skills", endpoint: "/api/admin/skills", icon: Code2,
        fields: [
            { name: "category", label: "Category", required: true },
            { name: "name", label: "Skill name", required: true },
            { name: "icon", label: "Icon" },
            { name: "level", label: "Level (0–100)", type: "number" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "experience", label: "Experience", endpoint: "/api/admin/experience", icon: BriefcaseBusiness,
        fields: [
            { name: "company", label: "Company", required: true },
            { name: "role", label: "Job title", required: true },
            { name: "location", label: "Location" },
            { name: "startDate", label: "Start date", type: "date", required: true },
            { name: "endDate", label: "End date", type: "date" },
            { name: "isCurrent", label: "Currently working here", type: "checkbox" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "responsibilities", label: "Responsibilities (JSON array)", type: "json" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "projects", label: "Projects", endpoint: "/api/admin/projects", icon: FolderKanban,
        fields: [
            { name: "title", label: "Project title", required: true },
            { name: "slug", label: "URL slug", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "startDate", label: "Start date", type: "date" },
            { name: "endDate", label: "End date", type: "date" },
            { name: "githubUrl", label: "GitHub URL", type: "url" },
            { name: "liveUrl", label: "Live URL", type: "url" },
            { name: "imageUrl", label: "Image URL", type: "url" },
            { name: "technologies", label: "Technologies (JSON array)", type: "json" },
            { name: "features", label: "Features (JSON array)", type: "json" },
            { name: "isFeatured", label: "Featured project", type: "checkbox" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "achievements", label: "Achievements", endpoint: "/api/admin/achievements", icon: Award,
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "date", label: "Date", type: "date" },
            { name: "url", label: "Reference URL", type: "url" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "certifications", label: "Certifications", endpoint: "/api/admin/certifications", icon: BadgeCheck,
        fields: [
            { name: "name", label: "Certification name", required: true },
            { name: "issuer", label: "Issuer" },
            { name: "issueDate", label: "Issue date", type: "date" },
            { name: "credentialId", label: "Credential ID" },
            { name: "credentialUrl", label: "Credential URL", type: "url" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "social-links", label: "Social Links", endpoint: "/api/admin/profile/social-links", icon: Link2,
        fields: [
            { name: "platform", label: "Platform", required: true },
            { name: "url", label: "URL", type: "url", required: true },
            { name: "icon", label: "Icon" },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
    {
        id: "sections", label: "Portfolio Sections", endpoint: "/api/admin/sections", icon: PanelsTopLeft,
        fields: [
            { name: "name", label: "Section name", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "type", label: "Section type", type: "select", options: ["HOME", "SKILLS", "PROJECTS", "EXPERIENCE", "EDUCATION", "ACHIEVEMENTS", "CERTIFICATIONS", "CONTACT", "CUSTOM"], required: true },
            { name: "isVisible", label: "Visible on portfolio", type: "checkbox" },
            { name: "order", label: "Display order", type: "number" },
        ],
    },
];

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong.";
}

function normalizeRows(data: unknown): RecordItem[] {
    if (Array.isArray(data)) return data as RecordItem[];
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        for (const key of ["items", "records", "results"]) {
            if (Array.isArray(obj[key])) return obj[key] as RecordItem[];
        }
        if ("id" in obj) return [obj as RecordItem];
    }
    return [];
}

function formatValue(value: unknown) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

function inputValue(value: unknown, type?: Field["type"]) {
    if (value === null || value === undefined) return "";
    if (type === "date" && value) {
        const date = new Date(String(value));
        if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
    }
    if (type === "json" || (typeof value === "object" && value !== null)) {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
}

function buildPayload(form: Record<string, string | boolean>, fields: Field[]) {
    const payload: Record<string, unknown> = {};

    for (const field of fields) {
        const value = form[field.name];

        if (field.type === "checkbox") {
            payload[field.name] = Boolean(value);
            continue;
        }

        if (value === "" || value === undefined) {
            payload[field.name] = null;
            continue;
        }

        if (field.type === "number") {
            payload[field.name] = Number(value);
        } else if (field.type === "json") {
            try {
                payload[field.name] = JSON.parse(String(value));
            } catch {
                throw new Error(`${field.label} must contain valid JSON.`);
            }
        } else if (field.type === "date") {
            payload[field.name] = new Date(String(value)).toISOString();
        } else {
            payload[field.name] = value;
        }
    }

    return payload;
}

export default function ManagePortfolioPage() {
    const router = useRouter();
    const [active, setActive] = useState("profile");
    const [rows, setRows] = useState<RecordItem[]>([]);
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [editing, setEditing] = useState<RecordItem | null>(null);
    const [form, setForm] = useState<Record<string, string | boolean>>({});

    const selected = sections.find((section) => section.id === active)!;
    const isMessages = active === "messages";

    const loadSection = useCallback(async () => {
        setLoading(true);
        setError("");
        setNotice("");
        setEditing(null);
        setForm({});

        try {
            if (active === "messages") {
                const data = await adminFetch<AdminMessage[]>("/api/admin/messages");
                setMessages(normalizeRows(data) as AdminMessage[]);
            } else {
                let endpoint = selected.endpoint;

                if (active === "social-links") {
                    const profile = await adminFetch<Record<string, unknown>>(
                        "/api/admin/profile"
                    );

                    if (!profile.id) {
                        throw new Error("Profile ID not found.");
                    }

                    endpoint += `?profileId=${encodeURIComponent(String(profile.id))}`;
                }

                const data = await adminFetch<unknown>(endpoint);
                setRows(normalizeRows(data));
            }
        } catch (err) {
            setError(errorMessage(err));
            if (err instanceof Error && err.message === "UNAUTHORIZED") {
                sessionStorage.removeItem("admin_token");
                router.replace("/admin/login");
            }
        } finally {
            setLoading(false);
        }
    }, [active, router, selected.endpoint]);

    useEffect(() => {
        void loadSection();
    }, [loadSection]);

    function startAdd() {
        const initial: Record<string, string | boolean> = {};
        for (const field of selected.fields) {
            initial[field.name] = field.type === "checkbox"
                ? field.name === "isVisible"
                : field.type === "json" ? "[]" : "";
        }
        setEditing({});
        setForm(initial);
        setError("");
        setNotice("");
    }

    function startEdit(row: RecordItem) {
        const initial: Record<string, string | boolean> = {};
        for (const field of selected.fields) {
            const value = row[field.name];
            initial[field.name] = field.type === "checkbox"
                ? Boolean(value)
                : inputValue(value, field.type);
        }
        setEditing(row);
        setForm(initial);
        setError("");
        setNotice("");
    }

    async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const payload = buildPayload(form, selected.fields);
            if (active === "social-links" && !editing?.id) {
                const profile = await adminFetch<Record<string, unknown>>(
                    "/api/admin/profile"
                );

                if (!profile.id) {
                    throw new Error("Profile ID not found.");
                }

                payload.profileId = profile.id;
            }
            const isUpdate = Boolean(editing?.id);
            const endpoint = isUpdate
                ? `${selected.endpoint}/${editing!.id}`
                : selected.endpoint;

            await adminFetch<unknown>(endpoint, {
                method: isUpdate ? "PUT" : "POST",
                body: JSON.stringify(payload),
            });

            setEditing(null);
            setNotice(isUpdate ? "Changes saved successfully." : "Record created successfully.");
            await loadSection();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function deleteRecord(row: RecordItem) {
        if (!row.id || !window.confirm("Delete this record permanently?")) return;
        setError("");
        setNotice("");

        try {
            await adminFetch(`${selected.endpoint}/${row.id}`, { method: "DELETE" });
            setNotice("Record deleted successfully.");
            await loadSection();
        } catch (err) {
            setError(errorMessage(err));
        }
    }

    async function markRead(message: AdminMessage) {
        if (message.status === "READ") return;
        try {
            await adminFetch(`/api/admin/messages/${message.id}/read`, { method: "PATCH" });
            await loadSection();
            setNotice("Message marked as read.");
        } catch (err) {
            setError(errorMessage(err));
        }
    }

    const visibleRows = rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
    );

    const visibleMessages = messages.filter((message) =>
        `${message.name} ${message.email} ${message.message}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#050505] px-4 py-7 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C7FF00]">
                            <Activity size={15} /> Portfolio Control Center
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Manage <span className="text-[#C7FF00]">Portfolio.</span>
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-white/50">
                            Manage your content, update records and control what visitors see.
                        </p>
                    </div>
                    <button
                        onClick={() => void loadSection()}
                        disabled={loading}
                        className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-white/70 transition hover:border-[#C7FF00]/40 hover:text-[#C7FF00] disabled:opacity-50"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                <div className="mb-7 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-3 sm:p-4">
                    <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        Select a section
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
                        {[...sections, {
                            id: "messages", label: "Messages", endpoint: "/api/admin/messages",
                            icon: MessageSquare, fields: [],
                        }].map((section) => {
                            const Icon = section.icon;
                            const isActive = active === section.id;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActive(section.id);
                                        setSearch("");
                                    }}
                                    className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${isActive
                                        ? "border-[#C7FF00]/50 bg-[#C7FF00]/10 text-[#C7FF00]"
                                        : "border-white/[0.07] bg-[#0b0b0b] text-white/55 hover:border-white/20 hover:text-white"
                                        }`}
                                >
                                    <Icon size={15} />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.07] p-4 text-sm text-red-300">
                        <span>{error}</span>
                        <button onClick={() => setError("")} aria-label="Dismiss error">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {notice && (
                    <div className="mb-5 rounded-xl border border-[#C7FF00]/20 bg-[#C7FF00]/[0.06] p-4 text-sm text-[#C7FF00]">
                        {notice}
                    </div>
                )}

                <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02]">
                    <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:px-6">
                        <div>
                            <h2 className="text-xl font-semibold">{selected?.label ?? "Messages"}</h2>
                            <p className="mt-1 text-xs text-white/40">
                                {isMessages ? "Review incoming portfolio enquiries." : "Create, update and remove portfolio records."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <label className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 sm:w-64">
                                <Search size={15} className="shrink-0 text-white/35" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search records..."
                                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/25"
                                />
                            </label>
                            {!isMessages && (
                                <button
                                    onClick={startAdd}
                                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#C7FF00] px-4 text-sm font-semibold text-black transition hover:bg-[#d6ff4a]"
                                >
                                    <Plus size={16} /> Add New
                                </button>
                            )}
                        </div>
                    </div>

                    {editing !== null && !isMessages && (
                        <form onSubmit={saveRecord} className="border-b border-white/[0.08] bg-black/30 p-5 sm:p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">{editing.id ? "Edit record" : "Create new record"}</h3>
                                    <p className="mt-1 text-xs text-white/40">Fill in the fields and save your changes.</p>
                                </div>
                                <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {selected.fields.map((field) => (
                                    <label
                                        key={field.name}
                                        className={`flex flex-col gap-2 text-xs font-medium text-white/60 ${field.type === "textarea" || field.type === "json" ? "sm:col-span-2 lg:col-span-3" : ""
                                            } ${field.type === "checkbox" ? "flex-row items-center rounded-lg border border-white/10 bg-white/[0.02] p-3" : ""}`}
                                    >
                                        {field.type === "checkbox" ? (
                                            <>
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(form[field.name])}
                                                    onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })}
                                                    className="h-4 w-4 accent-[#C7FF00]"
                                                />
                                                {field.label}
                                            </>
                                        ) : field.type === "select" ? (
                                            <>
                                                {field.label}
                                                <select
                                                    required={field.required}
                                                    value={String(form[field.name] ?? "")}
                                                    onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                                                    className="h-11 rounded-lg border border-white/10 bg-[#101010] px-3 text-sm text-white outline-none focus:border-[#C7FF00]/50"
                                                >
                                                    <option value="">Select {field.label.toLowerCase()}</option>
                                                    {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                {field.label}
                                                {field.type === "textarea" || field.type === "json" ? (
                                                    <textarea
                                                        required={field.required}
                                                        value={String(form[field.name] ?? "")}
                                                        onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                                                        rows={field.type === "json" ? 5 : 3}
                                                        placeholder={field.type === "json" ? '["Example"]' : `Enter ${field.label.toLowerCase()}`}
                                                        className="rounded-lg border border-white/10 bg-[#101010] p-3 text-sm text-white outline-none focus:border-[#C7FF00]/50"
                                                    />
                                                ) : (
                                                    <input
                                                        required={field.required}
                                                        type={field.type ?? "text"}
                                                        value={String(form[field.name] ?? "")}
                                                        onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                                        className="h-11 rounded-lg border border-white/10 bg-[#101010] px-3 text-sm text-white outline-none focus:border-[#C7FF00]/50"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </label>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap justify-end gap-2">
                                <button type="button" onClick={() => setEditing(null)} className="h-10 rounded-lg border border-white/10 px-4 text-sm text-white/65 hover:bg-white/5">
                                    Cancel
                                </button>
                                <button disabled={saving} className="flex h-10 items-center gap-2 rounded-lg bg-[#C7FF00] px-5 text-sm font-semibold text-black disabled:opacity-50">
                                    {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="p-4 sm:p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-16 text-sm text-white/45">
                                <LoaderCircle size={18} className="animate-spin text-[#C7FF00]" />
                                Loading {selected.label.toLowerCase()}...
                            </div>
                        ) : isMessages ? (
                            visibleMessages.length === 0 ? (
                                <EmptyState label="No messages found" />
                            ) : (
                                <div className="space-y-3">
                                    {visibleMessages.map((message) => (
                                        <article key={message.id} className="rounded-xl border border-white/[0.08] bg-black/25 p-4 sm:p-5">
                                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold">{message.name}</h3>
                                                    <p className="mt-1 break-all text-xs text-white/45">{message.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${message.status === "UNREAD" ? "bg-[#C7FF00]/10 text-[#C7FF00]" : "bg-white/[0.06] text-white/50"}`}>
                                                        {message.status}
                                                    </span>
                                                    {message.status === "UNREAD" && (
                                                        <button onClick={() => void markRead(message)} className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-[#C7FF00]/30 hover:text-[#C7FF00]" title="Mark as read">
                                                            <Eye size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/70">{message.message}</p>
                                            <p className="mt-3 text-[11px] text-white/30">{new Date(message.createdAt).toLocaleString("en-IN")}</p>
                                        </article>
                                    ))}
                                </div>
                            )
                        ) : visibleRows.length === 0 ? (
                            <EmptyState label={search ? "No matching records" : "No records found"} />
                        ) : (
                            <div className="grid gap-3 lg:grid-cols-2">
                                {visibleRows.map((row, index) => {
                                    const title = formatValue(
                                        row.title ?? row.name ?? row.institutionName ?? row.company ?? row.role ?? row.platform ?? row.category ?? row.slug
                                    );
                                    const subtitle = formatValue(
                                        row.description ?? row.field ?? row.email ?? row.url ?? row.issuer ?? row.level
                                    );

                                    return (
                                        <article key={row.id ?? index} className="group rounded-xl border border-white/[0.08] bg-black/25 p-4 transition hover:border-white/15 sm:p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="break-words font-semibold text-white">{title}</h3>
                                                    <p className="mt-1 break-words text-xs leading-5 text-white/45">{subtitle}</p>
                                                </div>
                                                <div className="flex shrink-0 gap-1">
                                                    <button onClick={() => startEdit(row)} className="rounded-lg border border-white/10 p-2 text-white/55 transition hover:border-[#C7FF00]/30 hover:text-[#C7FF00]" title="Edit record">
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button onClick={() => void deleteRecord(row)} disabled={!row.id} className="rounded-lg border border-white/10 p-2 text-white/45 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-30" title="Delete record">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                                {typeof row.isVisible === "boolean" && (
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] ${row.isVisible ? "bg-[#C7FF00]/10 text-[#C7FF00]" : "bg-white/[0.06] text-white/45"}`}>
                                                        {row.isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                                                        {row.isVisible ? "Visible" : "Hidden"}
                                                    </span>
                                                )}
                                                {row.isFeatured === true && <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] text-purple-300">Featured</span>}
                                                {row.order !== undefined && <span className="text-[10px] text-white/30">Order: {formatValue(row.order)}</span>}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <footer className="mt-6 flex flex-col justify-between gap-2 border-t border-white/[0.08] pt-5 text-xs text-white/30 sm:flex-row">
                    <span>KK. / Portfolio Management</span>
                    <span>Changes are sent to your configured backend API.</span>
                </footer>
            </div>
        </main>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
                <FolderKanban size={21} className="text-white/35" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white/75">{label}</h3>
            <p className="mt-1 text-xs text-white/35">Records will appear here when available.</p>
        </div>
    );
}
