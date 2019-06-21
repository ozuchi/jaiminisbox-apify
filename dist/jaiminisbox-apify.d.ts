import { CloudscraperOptions, Manga, Chapter, MangaSummary } from './interfaces';
export interface JaiminisboxApifyOptions {
    baseUrl?: string;
    requestOptions?: CloudscraperOptions;
}
export declare class JaiminisboxApify {
    private options;
    constructor(options?: JaiminisboxApifyOptions);
    static readonly VERSION: string;
    getManga(mangaId: string): Promise<Manga>;
    getChapter(chapterId: number, mangaId: string): Promise<Chapter>;
    search(query: string): Promise<MangaSummary[]>;
    private validateOptionalParameters;
}
