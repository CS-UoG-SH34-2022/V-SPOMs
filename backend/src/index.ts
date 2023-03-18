import * as simspoms from "./backend";

if (global.__js_sdk_entrypoint) {
    throw new Error("Multiple sim-spoms entrypoints detected!");
}
global.__js_sdk_entrypoint = true;

export default simspoms;
