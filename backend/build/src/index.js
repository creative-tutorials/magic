import express, { urlencoded, json } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { checkDuplicate, createRequest, declineRequest, getRequestsData, } from "../functions/request/request.js";
import { approveRequest, checkAprvDuplicate, fetchApprovedApps, filterAppsByCategory, filteredApps, } from "../functions/approved/data.js";
import { checkCatExist, fetchCategories } from "../functions/categories/cat.js";
dotenv.config();
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
const corsOptions = {
    origin: allowedOrigins,
};
const app = express();
app.use(cors(corsOptions));
app.use(json({ limit: "500kb" }));
app.use(urlencoded({ limit: "500kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "500kb", extended: false }));
const port = process.env.PORT;
if (!port)
    throw new Error("Port not found");
const validateAPIKey = (req, res, next) => {
    const { apikey } = req.headers;
    const ServerKey = process.env.SERVER_KEY;
    if (apikey === ServerKey)
        next();
    else
        res.status(401).send({ error: "Unauthorized" });
};
app.use(validateAPIKey);
const reqLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const resLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
const requestEntry = (req, res, next) => {
    const { name, description, url, userName } = req.body;
    const requiredFields = [name, description, url, userName];
    const { email } = req.headers;
    if (requiredFields.some((field) => !field)) {
        return res.status(400).send({ error: "Missing one or more fields" });
    }
    // if url incudes trailing /
    if (url[url.length - 1] === "/") {
        return res
            .status(400)
            .send({ error: "Url must not include trailing slash" });
    }
    if (!email) {
        return res.status(401).send({ error: "Unauthorized" });
    }
    return next();
};
const validateApprovalEntry = (req, res, next) => {
    const { name, description, url, icon, creator, twitter, category, } = req.body;
    const { recordid } = req.headers;
    const requiredFields = [
        name,
        description,
        url,
        icon,
        creator,
        twitter,
        category,
    ];
    if (requiredFields.some((field) => !field)) {
        return res.status(400).send({ error: "Missing one or more fields" });
    }
    if (!creator.startsWith("@"))
        return res.status(400).send({ error: "Twitter handle must start with @" });
    if (!twitter.startsWith("https://twitter.com/"))
        return res.status(400).send({ error: "Must include twitter base url" });
    if (!recordid) {
        return res.status(401).send({ error: "Unauthorized" });
    }
    return next();
};
const validateName = (req, res, next) => {
    const { name } = req.params;
    if (!name) {
        return res.status(400).send({ error: "Project name is required" });
    }
    return next();
};
app.get("/status", async (_, res) => {
    res.send("OK");
});
app.post("/api/request", reqLimit, requestEntry, async (req, res) => {
    const { name, description, url, userName } = req.body;
    const { email } = req.headers;
    try {
        const verf = await checkDuplicate(name, email);
        if (verf)
            return res.status(409).send({ error: "Duplicate request" });
        const data = await createRequest(name, description, url, userName, email);
        if (data)
            return res.send({ data });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.get("/api/request", resLimit, async (_, res) => {
    try {
        const data = await getRequestsData();
        if (data)
            return res.send(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.post("/api/approve", reqLimit, validateApprovalEntry, async (req, res) => {
    const { name, description, url, icon, creator, twitter, category, } = req.body;
    const { recordid } = req.headers;
    try {
        const isApproval = await checkAprvDuplicate(name);
        if (isApproval)
            return res.status(409).send({ error: "Duplicate request" });
        const data = await approveRequest(recordid, name, description, url, icon, creator, twitter, category);
        if (data) {
            await checkCatExist(category);
            return res.send({ data });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.delete("/api/decline/:id", reqLimit, async (req, res) => {
    const { id } = req.params;
    try {
        const data = await declineRequest(id);
        if (data)
            return res.send({ data });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.get("/api/apps", resLimit, async (_, res) => {
    try {
        const data = await fetchApprovedApps();
        if (data)
            return res.send(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.get("/api/app/:name", validateName, async (req, res) => {
    const { name } = req.params;
    try {
        const data = await filteredApps(name);
        if (data)
            return res.send(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.get("/api/filter/:cat", async (req, res) => {
    const { cat } = req.params;
    try {
        const data = await filterAppsByCategory(cat);
        if (data)
            return res.send(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.get("/api/categories", async (_, res) => {
    try {
        const data = await fetchCategories();
        if (data)
            return res.send(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
});
app.listen(port, () => {
    console.log(`🟢 [server] Online and listening on port ${port}.`);
});
//# sourceMappingURL=index.js.map