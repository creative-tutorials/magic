import dotenv from "dotenv";
dotenv.config();

import { getXataClient } from "../../database/xata.js";

const xata = getXataClient();

async function checkAprvDuplicate(name: string) {
  try {
    const records = await xata.db.approved
      .filter({
        appname: { $contains: name },
      })
      .getFirst();
    if (records) return true;
    else return false;
  } catch (err: any) {
    throw new Error(err);
  }
}

async function approveRequest(
  appName: string,
  description: string,
  url: string,
  icon: string,
  creator: string,
  twitterUrl: string
) {
  try {
    const createdRecord = await xata.db.approved.create({
      appname: appName,
      description,
      url,
      appicon: icon,
      creator,
      twitterUrl,
    });

    if (!createdRecord) throw new Error("Failed to approve request");

    return "Request approved successfully";
  } catch (error: any) {
    throw new Error(error);
  }
}

async function fetchApprovedApps() {
  try {
    const approvedApps = await xata.db.approved
      .select([
        "appname",
        "description",
        "url",
        "appicon",
        "creator",
        "twitterUrl",
      ])
      .getMany();

    if (!approvedApps) throw new Error("No approved apps found");

    return approvedApps;
  } catch (error: any) {
    throw new Error(error);
  }
}

export { checkAprvDuplicate, approveRequest, fetchApprovedApps };
