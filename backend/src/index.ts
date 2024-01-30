import express, { Express, urlencoded, json } from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import {
  checkDuplicate,
  createRequest,
  declineRequest,
  getRequestsData,
} from "../functions/request/request.js";
import {
  approveRequest,
  checkAprvDuplicate,
  fetchApprovedApps,
  filterAppsByCategory,
  filteredApps,
} from "../functions/approved/data.js";
import { IncomingHttpHeaders } from "http";
import { checkCatExist, fetchCategories } from "../functions/categories/cat.js";

dotenv.config();

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS!);
const corsOptions = {
  origin: allowedOrigins,
};

const app: Express = express();

app.use(cors(corsOptions));
app.use(json({ limit: "500kb" }));
app.use(urlencoded({ limit: "500kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "500kb", extended: false }));
const port = process.env.PORT;

if (!port) throw new Error("Port not found");

type appDetails = {
  name: string; // The name of the project
  icon: string; // The og image for the project
  description: string; // The description of the project
  url: string; // The url to the project
  userName: string; // The name of the user who submitted the request
};

type CustomHeaders = IncomingHttpHeaders & {
  email: string;
  recordid: string;
};

type projectInfo = {
  name: string; // The name of the project
  icon: string; // The og image for the project
  description: string; // The description of the project
  url: string; // The url to the project
  creator: string; // The creator of the project
  twitter: string; // The twitter handle of the project creator
  category: string; // The category of the project
};

const validateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const { apikey } = req.headers;
  const ServerKey = process.env.SERVER_KEY;
  if (apikey === ServerKey) next();
  else res.status(401).send({ error: "Unauthorized" });
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

const requestEntry = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, url, userName }: appDetails = req.body;
  const requiredFields = [name, description, url, userName];
  const { email } = req.headers as CustomHeaders;

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

const validateApprovalEntry = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    description,
    url,
    icon,
    creator,
    twitter,
    category,
  }: projectInfo = req.body;
  const { recordid } = req.headers as CustomHeaders;
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

const validateName = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).send({ error: "Project name is required" });
  }
  return next();
};

app.get("/status", async (_, res: Response) => {
  res.send("OK");
});

app.post(
  "/api/request",
  reqLimit,
  requestEntry,
  async (req: Request, res: Response) => {
    const { name, description, url, userName }: appDetails = req.body;
    const { email } = req.headers as CustomHeaders;

    try {
      const verf = await checkDuplicate(name, email);

      if (verf) return res.status(409).send({ error: "Duplicate request" });

      const data = await createRequest(name, description, url, userName, email);

      if (data) return res.send({ data });
    } catch (err: any) {
      console.log(err);
      return res.status(500).send({ error: err.message });
    }
  }
);

app.get("/api/request", resLimit, async (_, res: Response) => {
  try {
    const data = await getRequestsData();
    if (data) return res.send(data);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
});

app.post(
  "/api/approve",
  reqLimit,
  validateApprovalEntry,
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      url,
      icon,
      creator,
      twitter,
      category,
    }: projectInfo = req.body;

    const { recordid } = req.headers as CustomHeaders;

    try {
      const isApproval = await checkAprvDuplicate(name);

      if (isApproval)
        return res.status(409).send({ error: "Duplicate request" });

      const data = await approveRequest(
        recordid,
        name,
        description,
        url,
        icon,
        creator,
        twitter,
        category
      );

      if (data) {
        await checkCatExist(category);
        return res.send({ data });
      }
    } catch (err: any) {
      console.log(err);
      return res.status(500).send({ error: err.message });
    }
  }
);

app.delete(
  "/api/decline/:id",
  reqLimit,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await declineRequest(id);
      if (data) return res.send({ data });
    } catch (err: any) {
      console.log(err);
      return res.status(500).send({ error: err.message });
    }
  }
);

app.get("/api/apps", resLimit, async (_, res: Response) => {
  try {
    const data = await fetchApprovedApps();
    if (data) return res.send(data);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
});

app.get("/api/app/:name", validateName, async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const data = await filteredApps(name);
    if (data) return res.send(data);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
});

app.get("/api/filter/:cat", async (req: Request, res: Response) => {
  const { cat } = req.params;

  try {
    const data = await filterAppsByCategory(cat);

    if (data) return res.send(data);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
});

app.get("/api/categories", async (_, res: Response) => {
  try {
    const data = await fetchCategories();
    if (data) return res.send(data);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🟢 [server] Online and listening on port ${port}.`);
});
