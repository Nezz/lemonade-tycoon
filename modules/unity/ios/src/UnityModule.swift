import ExpoModulesCore
import UnityFramework

public class UnityModule: Module, NativeCallsProtocol {
  public static var unityFramework: UnityFramework?
  private var frameworkListener: UnityFrameworkListenerImpl?

  public func definition() -> ModuleDefinition {
    Name("UnityModule")

    // Defines event names that the module can send to JavaScript.
    Events("onUnityMessage", "onUnityUnloaded")

    OnCreate {
      FrameworkLibAPI.registerAPIforNativeCalls(self)
    }

    // Post message to Unity GameObject
    Function("postMessage") { (gameObject: String, methodName: String, message: String) in
      UnityModule.unityFramework?.sendMessageToGO(withName: gameObject, functionName: methodName, message: message)
    }

    // Unload Unity
    Function("unloadUnity") {
      if let ufw = UnityModule.unityFramework {
        ufw.register(self.getFrameworkListener())
        ufw.unloadApplication()
      } else {
        sendEvent("onUnityUnloaded");
        return;
      }
    }

    // Pause/Resume Unity
    Function("pauseUnity") { (pause: Bool) in
      if pause {
        UnityModule.unityFramework?.pause(true)
      } else {
        UnityModule.unityFramework?.pause(false)
      }
    }

    // Enables the module to be used as a native view
    View(UnityView.self) {
    }
  }

  public func sendMessage(toMobileApp message: String) {
    // Send the Unity message directly as an event to React Native
    sendEvent("onUnityMessage", ["message": message])
  }

  // Handle Unity unloaded event
  func handleUnityUnloaded() {
    sendEvent("onUnityUnloaded")
  }

  // Get the framework listener instance
  func getFrameworkListener() -> UnityFrameworkListenerImpl {
    if frameworkListener == nil {
      frameworkListener = UnityFrameworkListenerImpl(module: self)
    }
    return frameworkListener!
  }
}
