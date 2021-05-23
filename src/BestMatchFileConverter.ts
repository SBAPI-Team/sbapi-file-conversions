import { CsvFileConverter } from "./CsvFileConverter";
import { JsonFileConverter } from "./JsonFileConverter";
import { IconFileConverter } from "./IconFileConverter";
import { PngFileConverter } from "./PngFileConverter";
import { TextFileConverter } from "./TextFileConverter";
import { ZipFileConverter } from "./ZipFileConverter";
import { SmileBASICDataFile, SmileBASICFile, SmileBASICFileType, SmileBASICFileVersion } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";

class BestMatchFileConverter {
    public async ConvertFile(file: SmileBASICFile): Promise<[ content: Buffer, mimeType: string ]> {
        let actualFile: SmileBASICFile = await file.ToActualType();
        let converter: FileConverter;

        switch (actualFile.Type) {
            case SmileBASICFileType.Text:
                converter = TextFileConverter;
                break;
            case SmileBASICFileType.Data:
                let dataFile = actualFile as SmileBASICDataFile;
                if (
                    (dataFile.Header.Version === SmileBASICFileVersion.SB4 && dataFile.Header.FileType === 0x02) // GRP file type in SB4
                    || (dataFile.Header.Version === SmileBASICFileVersion.SB3 && dataFile.Header.FileIcon === 0x02) // GRP icon in SB3
                ) {
                    converter = PngFileConverter;
                } else if (dataFile.Content.shape.length === 2) {
                    converter = CsvFileConverter;
                } else {
                    converter = JsonFileConverter;
                }
                break;
            case SmileBASICFileType.Project3:
            case SmileBASICFileType.Project4:
                converter = ZipFileConverter;
                break;
            case SmileBASICFileType.Meta:
                converter = IconFileConverter;
                break;
            default:
                return [ await file.ToBuffer(), "application/x-octet-stream" ];
        }

        return [ await converter.ConvertFile(actualFile), converter.ReturnedMimeType ];
    }
}

const staticInstance = new BestMatchFileConverter;

export { staticInstance as BestMatchFileConverter };