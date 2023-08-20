import murmurhash from "murmurhash";

export const hashObject = (object: any) => murmurhash.v3(JSON.stringify(object));