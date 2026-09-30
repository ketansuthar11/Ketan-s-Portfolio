import express from "express";
import cors from "cors";
import testRoutes from './routes/test.routes.js';
import profileRoutes from './routes/profile.route.js';
import roleRoutes from './routes/role.route.js';
import profileImageRoutes from "./routes/profile-image.route.js";
import resumeRoutes from "./routes/resume.route.js";
import socialLinkRoutes from "./routes/social-link.routes.js";
import educationRoutes from "./routes/education.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import projectRoutes from "./routes/project.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import messageRoutes from "./routes/message.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import viewRoutes from "./routes/view.routes.js";
import publicResumeRoutes from "./routes/public-resume.routes.js";
import authRoutes from "./routes/auth.routes.js"; 

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testRoutes);
app.use('/api/admin/profile', profileRoutes);
app.use('/api/admin/profile/roles', roleRoutes);
app.use("/api/admin/profile/images", profileImageRoutes);
app.use("/api/admin/profile/resumes", resumeRoutes);
app.use("/api/admin/profile/social-links", socialLinkRoutes);
app.use("/api/admin/education", educationRoutes);
app.use("/api/admin/skills", skillRoutes);
app.use("/api/admin/experience", experienceRoutes);
app.use("/api/admin/projects", projectRoutes);
app.use("/api/admin/sections", sectionRoutes);
app.use("/api/admin/messages",messageRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/portfolio",   portfolioRoutes);
app.use("/api/views",viewRoutes);
app.use("/api/resume",publicResumeRoutes);
app.use( "/api/auth", authRoutes );

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Portfolio API is running",
    });
});

export default app;