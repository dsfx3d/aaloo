import { IAalooMixin } from '../../../types/mixin';
import { AalooConfig } from '../../../types/service';
import { AalooError } from '../exceptions';

export class AalooMixin implements IAalooMixin {
  get config(): AalooConfig {
    throw new AalooError('must implement "config" accessor');
  }
}
