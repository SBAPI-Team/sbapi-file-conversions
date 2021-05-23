import { SmileBASICDataFile, SmileBASICFile, SmileBASICFileType } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";

class CsvFileConverter implements FileConverter {
    public readonly ReturnedMimeType = "text/csv";

    async CanConvertFile(file: SmileBASICFile) {
        if (file.Type !== SmileBASICFileType.Data) {
            return false;
        }

        let dataFile: SmileBASICDataFile;
        if (file instanceof SmileBASICDataFile) {
            dataFile = file;
        } else {
            dataFile = await file.AsDataFile();
        }

        return (dataFile.Content.shape.length === 2);
    }

    async ConvertFile(file: SmileBASICFile) {
        let dataFile: SmileBASICDataFile;
        if (file instanceof SmileBASICDataFile) {
            dataFile = file;
        } else {
            dataFile = await file.AsDataFile();
        }

        if (dataFile.Content.shape.length !== 2) {
            throw new Error(`Data file must be 2 dimensional, is actually ${dataFile.Content.shape.length}.`);
        }

        let content = dataFile.Content;
        let output = "";
        for (let i = 0; i < content.shape[ 1 ]; i++) {
            let line: number[] = [];
            for (let j = 0; j < content.shape[ 0 ]; j++) {
                line.push(content.get(j, i));
            }
            output += `${line.join(",")}\n`;
        }

        return Buffer.from(output, "ascii");
    }
}

const staticInstance = new CsvFileConverter;

export { staticInstance as CsvFileConverter };