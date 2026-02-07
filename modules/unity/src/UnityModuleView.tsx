import { requireNativeView } from 'expo';
import * as React from 'react';

import { UnityModuleViewProps } from './UnityModule.types';

const NativeView: React.ComponentType<UnityModuleViewProps> =
  requireNativeView('UnityModule');

export default function UnityModuleView(props: UnityModuleViewProps) {
  return <NativeView {...props} />;
}
