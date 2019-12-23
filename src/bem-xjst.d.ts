/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "bem-xjst" {
    export interface BemhtmlTemplate {
        apply: (bemjson: any) => string;
    }

    export interface BemhtmlEngine {
        compile: () => BemhtmlTemplate;
    }

    export const bemhtml: BemhtmlEngine;
}
