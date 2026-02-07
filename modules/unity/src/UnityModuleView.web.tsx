import * as React from 'react';

import { UnityModuleViewProps } from './UnityModule.types';

export default function UnityModuleView(props: UnityModuleViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
