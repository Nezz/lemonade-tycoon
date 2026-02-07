import { requireNativeView } from "expo";
import * as React from "react";

import { UnityViewProps } from "@/modules/unity/src/UnityModule.types";

const NativeView: React.ComponentType<UnityViewProps> =
  requireNativeView("UnityModule");

export default function UnityView(props: UnityViewProps) {
  return <NativeView {...props} />;
}
