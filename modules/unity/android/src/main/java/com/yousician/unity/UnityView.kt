package com.yousician.unity

import android.content.Context
import android.view.ViewGroup
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import com.unity3d.player.UnityPlayer

class UnityView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private var unityPlayer: UnityPlayer? = null
  private var keepPlayerMounted = false
  private var fullScreen = true
  private var isPlayerPaused = false

  init {
    initializeUnityPlayer()
  }

  private fun initializeUnityPlayer() {
    try {
      unityPlayer = UnityPlayer(context).apply {
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )

        // Request full screen if enabled
        if (fullScreen) {
          requestFocus()
        }
      }

      unityPlayer?.let { player ->
        addView(player)
      }
    } catch (e: Exception) {
      // Handle Unity player initialization error
    }
  }

  fun setKeepPlayerMounted(keepMounted: Boolean) {
    this.keepPlayerMounted = keepMounted
  }

  fun setFullScreen(fullScreen: Boolean) {
    this.fullScreen = fullScreen
    unityPlayer?.let { player ->
      if (fullScreen) {
        player.requestFocus()
      }
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    if (isPlayerPaused && !keepPlayerMounted) {
      unityPlayer?.resume()
      isPlayerPaused = false
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    if (!keepPlayerMounted) {
      unityPlayer?.pause()
      isPlayerPaused = true
    }
  }

  override fun onWindowFocusChanged(hasWindowFocus: Boolean) {
    super.onWindowFocusChanged(hasWindowFocus)
    unityPlayer?.windowFocusChanged(hasWindowFocus)

    if (keepPlayerMounted) {
      if (hasWindowFocus && isPlayerPaused) {
        unityPlayer?.resume()
        isPlayerPaused = false
      } else if (!hasWindowFocus && !isPlayerPaused) {
        unityPlayer?.pause()
        isPlayerPaused = true
      }
    }
  }
}
