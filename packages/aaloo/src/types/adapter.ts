import { AalooConfig } from './service';

export interface IAalooAdapter {
  transformConfig(config: AalooConfig): AalooConfig;
  request(config: AalooConfig): unknown;
}
