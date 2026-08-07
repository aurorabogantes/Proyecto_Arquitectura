require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const authRoutes           = require("./src/routes/authRoutes");
const courseRoutes        = require("./src/routes/courseRoutes");
const progressRoutes      = require("./src/routes/progressRoutes");
const reportRoutes        = require("./src/routes/reportRoutes");
const gamificationRoutes  = require("./src/routes/gamificationRoutes");
const mediaRoutes         = require("./src/routes/mediaRoutes");
const userRoutes          = require("./src/routes/userRoutes");
const aiRoutes            = require("./src/routes/aiRoutes");

app.use("/api/auth",          authRoutes);
app.use("/api/courses",       courseRoutes);
app.use("/api/progress",      progressRoutes);
app.use("/api/reports",       reportRoutes);
app.use("/api/gamification",  gamificationRoutes);
app.use("/api/media",         mediaRoutes);
app.use("/api/user",          userRoutes);
app.use("/api/ai",            aiRoutes);

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
