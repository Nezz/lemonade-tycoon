package com.yousician.unity

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.unity3d.player.UnityPlayer

class UnityModule : Module() {
  companion object {
    private var moduleInstance: UnityModule? = null

    @JvmStatic
    fun sendMessageToMobileApp(message: String) {
      // This method will be called from Unity to send messages to React Native
      moduleInstance?.sendEvent("onUnityMessage", mapOf("message" to message))
    }
  }

  override fun definition() = ModuleDefinition {
    Name("UnityModule")

    // Store module instance for static access
    OnCreate {
      moduleInstance = this@UnityModule
    }

    OnDestroy {
      moduleInstance = null
    }

    // Defines event names that the module can send to JavaScript.
    Events("onUnityMessage", "onUnityUnloaded")

    // Post message to Unity GameObject
    Function("postMessage") { gameObject: String, methodName: String, message: String ->
      UnityPlayer.UnitySendMessage(gameObject, methodName, message)
    }

    // Unload Unity
    Function("unloadUnity") {
      UnityPlayer.quit()
      sendEvent("onUnityUnloaded")
    }

    // Pause/Resume Unity
    Function("pauseUnity") { pause: Boolean ->
      if (pause) {
        UnityPlayer.pause()
      } else {
        UnityPlayer.resume()
      }
    }

    // Simulate window focus change (Android specific)
    Function("windowFocusChanged") { hasFocus: Boolean ->
      UnityPlayer.windowFocusChanged(hasFocus)
    }

    // Enables the module to be used as a native view
    View(UnityView::class) {
      // Prop for keeping player mounted
      Prop("androidKeepPlayerMounted") { view: UnityView, keepMounted: Boolean ->
        view.setKeepPlayerMounted(keepMounted)
      }

      // Prop for full screen mode
      Prop("fullScreen") { view: UnityView, fullScreen: Boolean ->
        view.setFullScreen(fullScreen)
      }
    }
  }
}
