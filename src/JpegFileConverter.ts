import { SmileBASICFile, SmileBASICFileType, SmileBASICJpegFile } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";

class JpegFileConverter implements FileConverter {
    public readonly ShortName = "jpeg";
    public readonly ReturnedMimeType = "image/jpeg";

    public async CanConvertFile(file: SmileBASICFile) {
        return (file.Type === SmileBASICFileType.Jpeg);
    }

    public async ConvertFile(file: SmileBASICFile) {
        file.ToActualType();

        let jpegFile: SmileBASICJpegFile;
        if (file instanceof SmileBASICJpegFile) {
            jpegFile = file;
        } else {
            jpegFile = await file.AsJpegFile();
        }

        return jpegFile.Content;
    }
}

const staticInstance = new JpegFileConverter;

export { staticInstance as JpegFileConverter };