import { SmileBASICDataFile, SmileBASICFile, SmileBASICFileType } from "@sbapi-team/smilebasic-fileparser";
import { CodeFileConverter } from "./CodeFileConverter";
import { CsvFileConverter } from "./CsvFileConverter";
import { FileConverter } from "./FileConverter";
import { IconFileConverter } from "./IconFileConverter";
import { JpegFileConverter } from "./JpegFileConverter";
import { JsonFileConverter } from "./JsonFileConverter";
import { PngFileConverter } from "./PngFileConverter";
import { TextFileConverter } from "./TextFileConverter";
import { ZipFileConverter } from "./ZipFileConverter";

async function GetSupportedFileConverters(file: SmileBASICFile): Promise<FileConverter[]> {
    let parsedFile = await file.ToActualType();

    if (parsedFile.Type === SmileBASICFileType.Text) {
        return [ CodeFileConverter, TextFileConverter ];
    } else if (parsedFile.Type === SmileBASICFileType.Project3 || parsedFile.Type === SmileBASICFileType.Project4) {
        return [ ZipFileConverter ];
    } else if (parsedFile.Type === SmileBASICFileType.Meta) {
        return [ IconFileConverter ];
    } else if (parsedFile.Type === SmileBASICFileType.Data) {
        let d = parsedFile as SmileBASICDataFile;
        if (await PngFileConverter.CanConvertFile(parsedFile)) {
            return [ PngFileConverter, CsvFileConverter, JsonFileConverter ];
        } else if (await CsvFileConverter.CanConvertFile(parsedFile)) {
            return [ CsvFileConverter, JsonFileConverter ];
        } else {
            return [ JsonFileConverter ];
        }
    } else if (parsedFile.Type === SmileBASICFileType.Jpeg) {
        return [ JpegFileConverter ];
    } else {
        return [];
    }
}

export { GetSupportedFileConverters };