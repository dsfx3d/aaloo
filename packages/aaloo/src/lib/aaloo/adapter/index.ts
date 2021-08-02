/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAalooAdapter } from '../../../types/adapter';
import { AalooConfig } from '../../../types/service';

import { AalooAdapterError } from './exceptions';

export class AalooAdapter implements IAalooAdapter {
  constructor(private service) {}

  transformConfig(config: AalooConfig): AalooConfig {
    const className = (this.constructor as typeof AalooAdapter).name;
    throw new AalooAdapterError(
      `property ${className}.config is not implemented.`
    );
  }

  request(_config: AalooConfig) {
    const className = (this.constructor as typeof AalooAdapter).name;
    throw new AalooAdapterError(
      `method ${className}.request is not implemented.`
    );
  }
}
