// Reexport the native module. On web, it will be resolved to UnityModule.web.ts
// and on native platforms to UnityModule.ts
export { default } from './src/UnityModule';
export { default as UnityModuleView } from './src/UnityModuleView';
export * from  './src/UnityModule.types';
