const express = require("express");

const app = express();

app.use(express.json());

const courseRoutes = require("./src/routes/courseRoutes");

app.use("/api/courses", courseRoutes);

app.listen(3000);