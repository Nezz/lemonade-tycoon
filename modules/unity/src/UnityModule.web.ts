import { UnityModuleEvents } from "@/modules/unity/src/UnityModule.types";
import { NativeModule, registerWebModule } from "expo";

class UnityModule extends NativeModule<UnityModuleEvents> {
  postMessage(gameObject: string, methodName: string, message: string): void {}

  unloadUnity(): void {
    this.emit("onUnityUnloaded");
  }

  pauseUnity(pause: boolean): void {}

  windowFocusChanged(hasFocus: boolean): void {}
}

export default registerWebModule(UnityModule, "UnityModule");
