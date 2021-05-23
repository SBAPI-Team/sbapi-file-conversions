import { SmileBASICFile } from "@sbapi-team/smilebasic-fileparser";
import * as fs from "fs";
import * as path from "path";
import { ZipFileConverter } from "../lib";

let zipConverter = ZipFileConverter;

test("can convert file", async () => {
    let file = fs.readFileSync(path.join(__dirname, "example_binaries/08_45AX333QJ"));
    let parsedFile = await SmileBASICFile.FromBuffer(file);

    let result = await zipConverter.ConvertFile(parsedFile, { nice: true });

    fs.writeFileSync(path.join(__dirname, "../test.zip"), result);
});