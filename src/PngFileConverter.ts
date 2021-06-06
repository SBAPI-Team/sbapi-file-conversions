import { SmileBASICDataFile, SmileBASICFile, SmileBASICFileType } from "@sbapi-team/smilebasic-fileparser";
import { FileConverter } from "./FileConverter";
import { encode as encodePng } from "node-libpng";

const RGBA5551_RGB_RATIO = (255 / (0b11111));

class PngFileConverter implements FileConverter {
    public readonly ShortName = "png";
    public readonly ReturnedMimeType = "image/png";

    public async CanConvertFile(file: SmileBASICFile) {
        if (file.Type !== SmileBASICFileType.Data) {
            return false;
        }

        let dataFile: SmileBASICDataFile;
        if (file instanceof SmileBASICDataFile) {
            dataFile = file;
        } else {
            dataFile = await file.AsDataFile();
        }

        return (dataFile.Content.shape.length === 2 && dataFile.Content.dtype !== "float64");
    }

    public async ConvertFile(file: SmileBASICFile) {
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
        let contentData = (dataFile.Content.data as Int32Array | Uint16Array);
        let pixelCount = content.shape.reduce((acc, dimension) => acc * dimension);
        let imageDataBuffer = Buffer.allocUnsafe(pixelCount * 4);

        switch (content.dtype) {
            case "uint16":
                // RGBA5551
                let d = contentData as Uint16Array;
                for (let i = 0; i < d.length; i++) {
                    let sourcePixel = d[ i ];
                    let r = Math.floor(((sourcePixel >> 11) & 31) * RGBA5551_RGB_RATIO);
                    let g = Math.floor(((sourcePixel >> 6) & 31) * RGBA5551_RGB_RATIO);
                    let b = Math.floor(((sourcePixel >> 1) & 31) * RGBA5551_RGB_RATIO);
                    let a = Math.floor(((sourcePixel) & 1) * 255);

                    let finalPixel = (a << 24 | b << 16 | g << 8 | r << 0);
                    imageDataBuffer.writeInt32LE(finalPixel, i * 4);
                }
                break;
            case "int32":
                // RGBA8888
                Buffer
                    .from(contentData.buffer)
                    .copy(imageDataBuffer);
                imageDataBuffer.swapColors();
                break;
        }

        const encodedBuffer = await encodePng(imageDataBuffer, {
            width: content.shape[ 0 ],
            height: content.shape[ 1 ],
            compressionLevel: 5
        });

        return encodedBuffer;
    }
}

const staticInstance = new PngFileConverter;

export { staticInstance as PngFileConverter };