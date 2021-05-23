
declare module "ndarray-unpack" {
    import { NdArray } from "ndarray";
    function unpack(array: NdArray): Array<number> | Array<Array<number>> | Array<Array<Array<number>>> | Array<Array<Array<Array<number>>>>;
    export = unpack;
}
