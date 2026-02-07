import { NativeModule, requireNativeModule } from 'expo';

import { UnityModuleEvents } from './UnityModule.types';

declare class UnityModule extends NativeModule<UnityModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<UnityModule>('UnityModule');
