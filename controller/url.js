import { generateHash } from "6bithash";

async function handleGeneratenewShortURL(req, res) {

    const shortID = generateHash(req.params.dbid);

}