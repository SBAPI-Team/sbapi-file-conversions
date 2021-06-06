import { SmileBASICFile, SmileBASICFileType, SmileBASICTextFile } from "@sbapi-team/smilebasic-fileparser";
import { BUILD_CODE_HTML } from "./Constants";
import { FileConverter } from "./FileConverter";


class CodeFileConverter implements FileConverter {
    public readonly ShortName = "code";
    public readonly ReturnedMimeType = "text/html";

    public async CanConvertFile(file: SmileBASICFile) {
        return file.Type === SmileBASICFileType.Text;
    }

    public async ConvertFile(file: SmileBASICFile): Promise<Buffer> {
        let textFile: SmileBASICTextFile;

        if (file instanceof SmileBASICTextFile) {
            textFile = file;
        } else {
            textFile = await file.AsTextFile();
        }

        const html = BUILD_CODE_HTML(textFile.Content, textFile.Header.Version);

        return Buffer.from(html, "utf8");
    }
}

const staticInstance = new CodeFileConverter();

export { staticInstance as CodeFileConverter };