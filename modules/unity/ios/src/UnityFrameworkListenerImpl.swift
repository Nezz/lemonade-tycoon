import UnityFramework

class UnityFrameworkListenerImpl: NSObject, UnityFrameworkListener {
  weak var module: UnityModule?

  init(module: UnityModule) {
    self.module = module
    super.init()
  }

  func unityDidUnload(_: Notification!) {
    UnityModule.unityFramework?.unregisterFrameworkListener(self)
    UnityModule.unityFramework = nil

    // Notify the module that Unity was unloaded
    module?.handleUnityUnloaded()
  }
}
