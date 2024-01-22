import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";
const xata = getXataClient();
/**
 * Asynchronously creates a request in the database.
 *
 * @param {string} name - The name of the request.
 * @param {string} description - The description of the request.
 * @param {string} url - The URL associated with the request.
 * @param {string} userName - The username of the requester.
 * @param {string} email - The email of the requester.
 * @return {Promise<string>} A message indicating the success of the request submission.
 */
async function createRequest(name, description, url, userName, email) {
    try {
        const record = await xata.db.requests.create({
            appname: name,
            description: description,
            url: url,
            username: userName,
            email: email,
        });
        if (!record)
            throw new Error("Failed to submit request");
        return "Request submitted successfully";
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
}
/**
 * Asynchronously checks for duplicate records based on name and email.
 *
 * @param {string} name - The name to check for duplicates.
 * @param {string} email - The email to check for duplicates.
 * @return {Promise<boolean>} Whether a duplicate record exists or not.
 */
async function checkDuplicate(name, email) {
    try {
        const record = await xata.db.requests
            .filter({ appname: name, email: { $any: [email] } })
            .getFirst();
        if (record)
            return true;
        else
            return false;
    }
    catch (err) {
        throw new Error(err);
    }
}
/**
 * Asynchronously retrieves data for requests.
 *
 * @return {Promise<RecordArray<SelectedPick<RequestsRecord, ("appname" | "description" | "url" | "email" | "username")[]>>>} The retrieved requests data
 */
async function getRequestsData() {
    try {
        const requests = await xata.db.requests
            .select(["appname", "description", "url", "email", "username"])
            .getMany();
        if (!requests)
            throw new Error("No record found");
        return requests;
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}
/**
 * Asynchronously declines a request by its ID.
 *
 * @param {string} id - The ID of the request to decline
 * @return {Promise<string>} A message indicating the result of declining the request
 */
async function declineRequest(id) {
    try {
        const request = await xata.db.requests.delete(id);
        if (!request)
            throw new Error("Failed to decline request");
        return "Request declined successfully";
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}
export { createRequest, checkDuplicate, getRequestsData, declineRequest }; // Export the functions to be imported into one file
//# sourceMappingURL=request.js.map