import { SmileBASICDataFile, SmileBASICFile, SmileBASICFileType } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";
import unpack from "ndarray-unpack";

class JsonFileConverter implements FileConverter {
    public readonly ShortName = "json";
    public readonly ReturnedMimeType = "application/json";

    async CanConvertFile(file: SmileBASICFile) {
        return file.Type === SmileBASICFileType.Data;
    }

    async ConvertFile(file: SmileBASICFile, args: any = {}) {
        let prettyJson = !!args[ "prettyJson" ] || false;

        let dataFile: SmileBASICDataFile;
        if (file instanceof SmileBASICDataFile) {
            dataFile = file;
        } else {
            dataFile = await file.AsDataFile();
        }

        let array = unpack(dataFile.Content);
        let result: string;
        if (prettyJson) {
            result = JSON.stringify(array, null, "  ");
        } else {
            result = JSON.stringify(array);
        }

        return Buffer.from(result, "ascii");
    }
}

const staticInstance = new JsonFileConverter;

export { staticInstance as JsonFileConverter };