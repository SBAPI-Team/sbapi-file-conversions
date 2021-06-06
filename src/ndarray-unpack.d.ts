
declare module "ndarray-unpack" {
    import { NdArray } from "ndarray";
    function unpack<T extends string | number>(array: NdArray<T>): Array<T> | Array<Array<T>> | Array<Array<Array<T>>> | Array<Array<Array<Array<T>>>>;
    export = unpack;
}
