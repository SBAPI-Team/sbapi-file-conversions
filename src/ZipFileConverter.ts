import { SmileBASIC3ProjectFile, SmileBASIC4ProjectFile, SmileBASICFile, SmileBASICFileType, SmileBASICFileVersion } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";
import JsZip from "jszip";
import { BestMatchFileConverter } from "./BestMatchFileConverter";
import mime from "mime-types";

class ZipFileConverter implements FileConverter {
    public readonly ShortName = "zip";
    public readonly ReturnedMimeType = "application/zip";

    public async CanConvertFile(file: SmileBASICFile) {
        return (file.Type === SmileBASICFileType.Project3 || file.Type == SmileBASICFileType.Project4);
    }

    public async ConvertFile(file: SmileBASICFile, args?: any): Promise<Buffer> {
        let projectFile: SmileBASIC3ProjectFile | SmileBASIC4ProjectFile;

        if (file instanceof SmileBASIC3ProjectFile || file instanceof SmileBASIC4ProjectFile) {
            projectFile = file;
        } else {
            projectFile = await file.ToActualType() as SmileBASIC3ProjectFile | SmileBASIC4ProjectFile;
            if (!(projectFile instanceof SmileBASIC3ProjectFile || projectFile instanceof SmileBASIC4ProjectFile)) {
                throw new Error("File is not a project.");
            }
        }

        const nice = args?.nice ?? false;
        const zip = new JsZip();

        if (nice) {
            const files = projectFile.Content.Files;
            for (let [ filename, subfile ] of files) {
                const [ buffer, mimeType ] = await BestMatchFileConverter.ConvertFile(subfile);
                let fixedFilename: string;
                if (filename === "META" && subfile.Type === SmileBASICFileType.Meta) {
                    fixedFilename = "META_ICON.png";
                } else {
                    fixedFilename = `${filename.substr(1)}.${mime.extension(mimeType) || "bin"}`;
                }
                zip.file(fixedFilename, buffer, {
                    date: subfile.Header.LastModified,
                    comment: `original file: ${filename}`
                });
            }
            if (projectFile instanceof SmileBASIC4ProjectFile) {
                zip.file("META.md", `${projectFile.Content.MetaContent.ProjectName}\n===\n\n\`\`\`\n${projectFile.Content.MetaContent.ProjectDescription}\n\`\`\``, {
                    date: projectFile.Header.LastModified
                });
            }

            return await zip.generateAsync({
                platform: "UNIX",
                compression: "DEFLATE",
                compressionOptions: { level: 5 },
                type: "nodebuffer",
                comment: `${SmileBASICFileVersion[ file.Header.Version ]} project.`
            });
        } else {
            const files = projectFile.Content.RawFiles;
            for (let [ filename, subfile ] of files) {
                zip.file(filename, subfile, {});
            }
            return await zip.generateAsync({
                platform: "UNIX",
                compression: "STORE",
                type: "nodebuffer"
            });
        }
    }
}

const staticInstance = new ZipFileConverter;

export { staticInstance as ZipFileConverter };