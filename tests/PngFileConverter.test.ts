import { SmileBASICFile } from "@sbapi-team/smilebasic-fileparser";
import * as fs from "fs";
import * as path from "path";
import { PngFileConverter } from "../lib";

let pngConverter = PngFileConverter;

test("can convert file (SB4)", async () => {
    let file = fs.readFileSync(path.join(__dirname, "example_binaries/09_4D34X333J_GCYB_GR.GRP"));
    let parsedFile = await SmileBASICFile.FromBuffer(file);

    let result = await pngConverter.ConvertFile(parsedFile);
});

test("can convert file (SB3)", async () => {
    let file = fs.readFileSync(path.join(__dirname, "example_binaries/02_BSYSUI.GRP"));
    let parsedFile = await SmileBASICFile.FromBuffer(file);

    let result = await pngConverter.ConvertFile(parsedFile);
});