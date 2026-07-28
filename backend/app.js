const express = require("express");

const app = express();

app.use(express.json());

const courseRoutes = require("./src/routes/courseRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/reports", reportRoutes);


app.listen(3000);