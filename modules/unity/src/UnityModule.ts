import { NativeModule, requireOptionalNativeModule } from "expo";

import { UnityModuleEvents } from "@/modules/unity/src/UnityModule.types";

declare class UnityModule extends NativeModule<UnityModuleEvents> {
  postMessage(gameObject: string, methodName: string, message: string): void;
  unloadUnity(): void;
  pauseUnity(pause: boolean): void;
  windowFocusChanged(hasFocus: boolean): void;
}

export default requireOptionalNativeModule<UnityModule>("UnityModule");
