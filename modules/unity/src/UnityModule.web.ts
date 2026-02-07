import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './UnityModule.types';

type UnityModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class UnityModule extends NativeModule<UnityModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(UnityModule, 'UnityModule');
