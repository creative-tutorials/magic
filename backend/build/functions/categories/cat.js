import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";
import { faker } from "@faker-js/faker";
const xata = getXataClient();
async function generateCategoryID() {
    const id = faker.string.alpha(15);
    return id;
}
async function checkCatExist(cat) {
    try {
        const records = await xata.db.categories
            .filter({
            name: { $iContains: cat },
        })
            .getFirst();
        if (records)
            return await updateCategory(records.id, cat);
        return await createCategory(cat);
    }
    catch (err) {
        throw new Error(err); // throw error if something goes wrong
    }
}
async function createCategory(cat) {
    try {
        const record = await xata.db.categories.create({
            gID: await generateCategoryID(),
            name: cat,
        });
        if (!record)
            throw new Error("Failed to create category");
        return "Category created successfully";
    }
    catch (err) {
        throw new Error(err);
    }
}
async function updateCategory(id, name) {
    try {
        const record = await xata.db.categories.update(id, {
            name: name,
        });
        if (!record)
            throw new Error("Failed to update category");
        return;
    }
    catch (err) {
        throw new Error(err);
    }
}
async function fetchCategories() {
    try {
        const categories = await xata.db.categories
            .select(["gID", "name"])
            .getMany();
        if (!categories)
            throw new Error("Failed to fetch categories");
        return categories;
    }
    catch (err) {
        throw new Error(err);
    }
}
export { checkCatExist, createCategory, fetchCategories };
//# sourceMappingURL=cat.js.map