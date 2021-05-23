import { SmileBASICFile } from "@sbapi-team/smilebasic-fileparser";
import * as fs from "fs";
import * as path from "path";
import { CodeFileConverter } from "../lib";

let iconConverter = CodeFileConverter;

test("can convert file", async () => {
    let file = fs.readFileSync(path.join(__dirname, "example_binaries/01_1233728E"));
    let parsedFile = await SmileBASICFile.FromBuffer(file);

    let result = await iconConverter.ConvertFile(parsedFile);
    fs.writeFileSync(path.join(__dirname, "../code.html"), result);
});