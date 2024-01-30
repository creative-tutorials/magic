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
  id: string,
  appName: string,
  description: string,
  url: string,
  icon: string,
  creator: string,
  twtUrl: string,
  cat: string
) {
  try {
    const createdRecord = await xata.db.approved.create({
      appname: appName,
      description,
      url,
      appicon: icon,
      creator,
      twitterUrl: twtUrl,
      category: cat,
    });

    if (!createdRecord) throw new Error("Failed to approve request");

    return "Request approved successfully";
  } catch (error: any) {
    throw new Error(error);
  } finally {
    await xata.db.requests.delete(id);
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

    if (!approvedApps || approvedApps.length === 0)
      throw new Error("No approved apps found");

    return approvedApps;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function filteredApps(name: string) {
  try {
    const filtered = await xata.db.approved
      .filter({
        appname: { $iContains: name },
      })
      .getFirst();

    if (!filtered) throw new Error("No record found");

    return filtered;
  } catch (err: any) {
    throw new Error(err);
  }
}

async function filterAppsByCategory(cat: string) {
  try {
    const filtered = await xata.db.approved
      .filter({
        category: cat,
      })
      .getMany();

    if (!filtered) throw new Error("No record found");

    return filtered;
  } catch (err: any) {
    throw new Error(err);
  }
}

export {
  checkAprvDuplicate,
  approveRequest,
  fetchApprovedApps,
  filteredApps,
  filterAppsByCategory,
};
