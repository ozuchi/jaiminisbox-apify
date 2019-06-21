/// <reference types="node" />
import { CloudscraperOptions } from '../interfaces';
export declare class RequestHelper {
    static getRaw(uri: string, options?: CloudscraperOptions): Promise<string>;
    static getJson(uri: string, options?: CloudscraperOptions): Promise<object>;
    static getBuffer(uri: string, options?: CloudscraperOptions): Promise<Buffer>;
}
