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
} from "../functions/approved/data.js";
import { IncomingHttpHeaders } from "http";

dotenv.config();

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS!);
console.log(allowedOrigins); // Array of allowed origins
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

type RequestBody = {
  appName: string;
  icon: string;
  description: string;
  url: string;
  userName: string;
};

type CustomHeaders = IncomingHttpHeaders & {
  email: string;
};

type VerfBdy = {
  name: string;
  icon: string;
  description: string;
  url: string;
  creator: string;
  twitter: string;
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

// app.use();

const requestEntry = (req: Request, res: Response, next: NextFunction) => {
  const { appName, description, url, userName }: RequestBody = req.body;
  const requiredFields = [appName, description, url, userName];
  const { email } = req.headers as CustomHeaders;

  if (requiredFields.some((field) => !field)) {
    return res.status(400).send({ error: "Missing one or more fields" });
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
  const { name, description, url, icon, creator, twitter }: VerfBdy = req.body;
  const requiredFields = [name, description, url, icon, creator, twitter];
  if (requiredFields.some((field) => !field)) {
    return res.status(400).send({ error: "Missing one or more fields" });
  }
  if (!creator.startsWith("@"))
    return res.status(400).send({ error: "Twitter handle must start with @" });

  if (!twitter.startsWith("https://twitter.com/"))
    return res.status(400).send({ error: "Must include twitter base url" });
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
    const { appName, description, url, userName }: RequestBody = req.body;
    const { email } = req.headers as CustomHeaders;

    try {
      const verf = await checkDuplicate(appName, email);

      if (verf) return res.status(409).send({ error: "Duplicate request" });

      const data = await createRequest(
        appName,
        description,
        url,
        userName,
        email
      );

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
    if (data) {
      return res.send(data);
    }
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
    const { name, description, url, icon, creator, twitter }: VerfBdy =
      req.body;

    try {
      const verf = await checkAprvDuplicate(name);

      if (verf) return res.status(409).send({ error: "Duplicate request" });

      const data = await approveRequest(
        name,
        description,
        url,
        icon,
        creator,
        twitter
      );

      if (data) return res.send({ data });
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
    if (data) {
      return res.send(data);
    }
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🟢 [server] Online and listening on port ${port}.`);
});
