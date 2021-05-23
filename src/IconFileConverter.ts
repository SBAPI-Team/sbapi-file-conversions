import { SmileBASICFile, SmileBASICFileType, SmileBASICMetaFile } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";
import { encode as encodePng } from "node-libpng";


class IconFileConverter implements FileConverter {
    public readonly ReturnedMimeType = "image/png";

    public async CanConvertFile(file: SmileBASICFile) {
        return (file.Type == SmileBASICFileType.Meta);
    }

    public async ConvertFile(file: SmileBASICFile, options?: any) {
        let metaFile: SmileBASICMetaFile;
        if (file instanceof SmileBASICMetaFile) {
            metaFile = file;
        } else {
            metaFile = await file.AsMetaFile();
        }

        let contentData = metaFile.Content.IconContent;
        let imageDataBuffer = Buffer.allocUnsafe(contentData.length);
        let iconWidth = Math.sqrt(metaFile.Content.IconContent.length / 4);
        /*        console.log(contentData.length, imageDataBuffer.length);
        
                for (let i = 0; i < contentData.length; i += 4) {
                    let pixel = contentData.readInt32LE(i);
                    let b = (pixel >> 16) & 255;
                    let r = (pixel & 255);
        
                    pixel = (pixel & 0xFF00FF00) | (r << 16) | b;
                    console.log(pixel);
        
                    imageDataBuffer.writeInt32LE(pixel, i);
                }*/
        contentData.copy(imageDataBuffer);
        imageDataBuffer.swapColors();

        const encodedBuffer = await encodePng(imageDataBuffer, {
            width: iconWidth,
            height: iconWidth,
            compressionLevel: 5
        });

        return encodedBuffer;
    }
}

const staticInstance = new IconFileConverter;

export { staticInstance as IconFileConverter };