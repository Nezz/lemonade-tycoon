import ExpoModulesCore
import UnityFramework

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class UnityView: ExpoView {
  private var unityView: UIView?

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    initializeUnity()
  }

  private func initializeUnity() {
    let bundlePath: String = Bundle.main.bundlePath + "/Frameworks/UnityFramework.framework"
    let bundle = Bundle(path: bundlePath)
    if bundle?.isLoaded == false {
        bundle?.load()
    }

    let ufw = bundle?.principalClass?.getInstance()
    if ufw?.appController() == nil {
        let machineHeader = #dsohandle.assumingMemoryBound(to: MachHeader.self)
        ufw!.setExecuteHeader(machineHeader)
    }

    if let ufw = ufw {
      UnityModule.unityFramework = ufw
      ufw.setDataBundleId("com.unity3d.framework")
      ufw.runEmbedded(withArgc: CommandLine.argc, argv: CommandLine.unsafeArgv, appLaunchOpts: nil)

      let appController = ufw.appController()!
      appController.rootView.removeFromSuperview()
      appController.window.windowScene = nil
      appController.window.addSubview(appController.rootView)
      appController.window.makeKeyAndVisible()
      appController.window.rootViewController!.view.setNeedsLayout()
      
      self.addSubview(appController.rootView)
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    if let rootView = UnityModule.unityFramework?.appController()?.rootView {
      rootView.frame = self.bounds
    }
  }
}
