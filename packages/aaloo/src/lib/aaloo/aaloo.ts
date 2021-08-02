import _merge from 'lodash.merge';

import { IAalooAdapter } from '../../types/adapter';
import { IAalooMixin } from '../../types/mixin';
import { AalooConfig, ClassMethod, IAaloo } from '../../types/service';

import { ServiceProxyHandler } from './proxy';

export class Aaloo implements IAaloo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: ClassMethod | any;

  protected static _instance = null;
  protected _config: AalooConfig;
  protected _mixins: IAalooMixin[];
  protected _adapter: IAalooAdapter;

  private constructor(config) {
    this._config = config;
    this._mixins = [];

    return new Proxy(
      this,
      (this.constructor as typeof Aaloo).serviceProxyHandler
    );
  }

  /**
   * Creates a new instance.
   * @param config The request config
   * @returns a new instance
   */
  static new(config: AalooConfig = {}) {
    const instance = new this(config);
    return instance;
  }

  /**
   * regex used to identify if the invoked function property should be
   * intercepted as a config property setter by the instance proxy.
   *
   * #### Example
   *
   * Consider this example,
   *
   * ```javascript
   * Aaloo.configSetterRegex // = /^with([\w]+)$/
   *
   * Aaloo.new({ foo: 1 }).withFoo(2)
   * ```
   *
   * `withFoo` will be intercepted as a config property setter function
   * by the [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply)
   * trap of the instance proxy and it's first argument will be used as the
   * new value for this config property.
   *
   * If a config property does not exist at the time of instantiation,
   * then it's setter function will raise an exception.
   *
   * Consider this example,
   *
   * ```javascript
   * Aaloo.new({ foo: 1 }).withBaz(2);
   * ```
   *
   * This snippet will throw an error because baz was not
   * specified inside `new` function.
   */
  static get configSetterRegex() {
    return /^with([\w]+)$/;
  }

  static get serviceProxyHandler() {
    return new ServiceProxyHandler({
      configSetterRegex: this.configSetterRegex,
    });
  }

  /**
   * Get a singleton instance.
   * @param config The request config
   * @returns the singleton instance
   */
  static singleton(config?: AalooConfig) {
    if (this._instance !== null) {
      return this._instance;
    } else {
      this._instance = this.new(config);
      return this._instance;
    }
  }

  get mixins(): IAalooMixin[] {
    return this._mixins;
  }

  private get mixinConfigs(): AalooConfig[] {
    return this.mixins.map((mixin) => mixin.config);
  }

  /**
   * The request config
   */
  get config(): AalooConfig {
    const finalConfig = _merge(this._config, ...this.mixinConfigs);

    return new Proxy<AalooConfig>(finalConfig, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set() {
        return true;
      },
      deleteProperty() {
        return true;
      },
    });
  }

  addMixin(...mixins: IAalooMixin[]) {
    this._mixins.push(...mixins);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAdapter(adapter: any) {
    this._adapter = new adapter(this);
    return this;
  }

  request<T = unknown>(configOverrides: AalooConfig = {}) {
    const config = this._adapter.transformConfig(
      _merge(this.config, configOverrides)
    );
    return this._adapter.request<T>(config);
  }
}
