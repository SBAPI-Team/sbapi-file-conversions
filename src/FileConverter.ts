import { SmileBASICFile } from "@sbapi-team/smilebasic-fileparser";

interface FileConverter {
    ShortName: string;
    ReturnedMimeType: string;
    CanConvertFile(file: SmileBASICFile): Promise<boolean>;
    ConvertFile(file: SmileBASICFile, args?: any): Promise<Buffer>;
}

export { FileConverter };