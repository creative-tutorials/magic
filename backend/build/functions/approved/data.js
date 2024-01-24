import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";
const xata = getXataClient();
async function checkAprvDuplicate(name) {
    try {
        const records = await xata.db.approved
            .filter({
            appname: { $contains: name },
        })
            .getFirst();
        if (records)
            return true;
        else
            return false;
    }
    catch (err) {
        throw new Error(err);
    }
}
async function approveRequest(id, appName, description, url, icon, creator, twitterUrl) {
    try {
        const createdRecord = await xata.db.approved.create({
            appname: appName,
            description,
            url,
            appicon: icon,
            creator,
            twitterUrl,
        });
        if (!createdRecord)
            throw new Error("Failed to approve request");
        return "Request approved successfully";
    }
    catch (error) {
        throw new Error(error);
    }
    finally {
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
    }
    catch (error) {
        throw new Error(error);
    }
}
export { checkAprvDuplicate, approveRequest, fetchApprovedApps };
//# sourceMappingURL=data.js.map