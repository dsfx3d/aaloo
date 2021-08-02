import { IAalooMixin } from './mixin';

export type AalooConfig = {
  [key: string]: unknown;
};

export interface ClassMethod {
  <T>(): T;
  <T>(value: unknown): T;
}

export interface IAaloo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: ClassMethod | any;
  mixins: IAalooMixin[];
}
