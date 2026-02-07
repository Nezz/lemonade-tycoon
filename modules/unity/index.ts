// Reexport the native module. On web, it will be resolved to UnityModule.web.ts
// and on native platforms to UnityModule.ts
export * from "./src/UnityModule.types";
export { default } from "./src/UnityModule";
export { default as UnityView } from "./src/UnityView";
