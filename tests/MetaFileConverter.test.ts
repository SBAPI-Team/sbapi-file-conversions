import { SmileBASICFile } from "@sbapi-team/smilebasic-fileparser";
import * as fs from "fs";
import * as path from "path";
import { IconFileConverter } from "../lib";

let iconConverter = IconFileConverter;

test("can convert file", async () => {
    let file = fs.readFileSync(path.join(__dirname, "example_binaries/4AB3E2K4V_META"));
    let parsedFile = await SmileBASICFile.FromBuffer(file);

    let result = await iconConverter.ConvertFile(parsedFile);
});