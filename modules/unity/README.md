# Unity Expo Module

An Expo module for integrating Unity games and applications into React Native apps, based on the [react-native-unity](https://github.com/azesmway/react-native-unity) plugin.

## Installation

This module is already included in your Expo project. To use it in your app:

```typescript
import UnityModule, { UnityView } from '@/modules/unity';
```

## Usage

### Basic Implementation

```typescript
import React, { useEffect } from 'react';
import { View } from 'react-native';
import UnityModule, { UnityView, UnityMessage } from '@/modules/unity';

const UnityScreen = () => {
  useEffect(() => {
    // Send a message to Unity after component mounts
    UnityModule.postMessage('GameObject', 'FunctionName', 'Hello from React Native!');
  }, []);

  UnityModule?.addListener('onUnityMessage', (payload: string) => {
    console.log('Message from Unity:', payload);
  });

  return (
    <View style={{ flex: 1 }}>
      <UnityView
        style={{ flex: 1 }}
        androidKeepPlayerMounted={false}
        fullScreen={true}
      />
    </View>
  );
};

export default UnityScreen;
```

## Props

- `style`: ViewStyle - Styles for the UnityView component (recommended: `{ flex: 1 }`)
- `androidKeepPlayerMounted?: boolean` - (Android only) Keep Unity player mounted when view loses focus
- `fullScreen?: boolean` - (Android only) Request full screen mode (default: true)

## Methods

Call these methods on `UnityModule`:

- `postMessage(gameObject: string, methodName: string, message: string)` - Send message to Unity GameObject
- `unloadUnity()` - Unload the Unity application
- `pauseUnity(pause: boolean)` - Pause or resume Unity
- `windowFocusChanged(hasFocus: boolean)` - (Android only) Simulate window focus change

## Unity Project Setup

### 1. Copy Unity Scripts

Copy the Unity configuration files to your Unity project root:

```
unity/
├── NativeCallProxy.h     # iOS native call interface
├── NativeCallProxy.mm    # iOS native call implementation
└── NativeInterop.cs      # Unity C# bridge scripts
```

### 2. Unity C# Integration

Use the provided `NativeInterop` class to send messages from Unity to React Native:

```csharp
using UnityEngine;

public class MyUnityScript : MonoBehaviour
{
    public void SendMessageToReactNative()
    {
        NativeInterop.SendMessageToMobileApp("Hello from Unity!");
    }

    // This method can be called from React Native
    public void ReceiveMessageFromReactNative(string message)
    {
        Debug.Log("Received from React Native: " + message);
    }
}
```

### 3. iOS Setup

1. Build your Unity project for iOS
2. In Xcode, select the Data folder and set "Target Membership" to "UnityFramework"
3. Select `NativeCallProxy.h` in `Unity-iPhone/Libraries/Plugins/iOS` and change UnityFramework's target membership from Project to Public
4. Build the UnityFramework.framework
5. Copy the framework to your React Native project

### 4. Android Setup

1. Build your Unity project for Android
2. The Unity classes will be automatically available through the Android module

## Platform Support

- ✅ **iOS**: Full Unity integration with UnityFramework
- ✅ **Android**: Full Unity integration with UnityPlayer
- ⚠️ **Web**: Placeholder implementation (Unity not supported on web)

## Troubleshooting

### iOS Issues

- Ensure UnityFramework.framework is properly linked
- Verify NativeCallProxy files are included in the Unity project
- Check that target membership is set correctly in Xcode

### Android Issues

- Verify Unity classes are available in the build
- Check that Unity player is properly initialized
- Ensure proper lifecycle management for pause/resume

### General

- Unity messages are asynchronous - use callbacks to handle responses
- Always check if Unity is loaded before sending messages
- Use try-catch blocks when calling Unity methods
