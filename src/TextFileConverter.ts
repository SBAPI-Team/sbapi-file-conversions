import { SmileBASICFile, SmileBASICFileType, SmileBASICTextFile } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";

class TextFileConverter implements FileConverter {
    public readonly ReturnedMimeType = "text/plain";

    public async CanConvertFile(file: SmileBASICFile) {
        return (file.Type === SmileBASICFileType.Text);
    }

    public async ConvertFile(file: SmileBASICFile) {
        file.ToActualType();

        let textFile: SmileBASICTextFile;
        if (file instanceof SmileBASICTextFile) {
            textFile = file;
        } else {
            textFile = await file.AsTextFile();
        }

        return Buffer.from(textFile.Content, "utf8");
    }
}

const staticInstance = new TextFileConverter;

export { staticInstance as TextFileConverter };