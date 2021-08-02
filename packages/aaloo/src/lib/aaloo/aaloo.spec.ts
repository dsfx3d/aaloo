import test from 'ava';

import { AalooConfig } from '../../types/service';

import { Aaloo } from './aaloo';
import { AalooAdapter } from './adapter';

test('aaloo: method "singleton" always returns the same instance', (t) => {
  const a = Aaloo.singleton();
  const b = Aaloo.singleton();
  t.truthy(a === b);
});

test('aaloo: property "config" is immutable', (t) => {
  const config = { foo: 'bar' };
  const service = Aaloo.new(config);
  t.like(config, service.config);

  // cannot update
  service.config.foo = 'baz';
  t.not(service.config.foo, 'baz');
  t.is(service.config.foo, config.foo);

  // cannot add
  service.config.foo2 = 'bar';
  t.is(service.config.foo2, undefined);

  // cannot delete
  delete service.config.foo;
  t.is(service.config.foo, 'bar');
});

// test('aaloo: config setter method raises exception if config property was not defined at the time of instantiation', (t) => {
//   try {
//     Aaloo.new({}).withFoo();
//   } catch (thrown) {
//     t.truthy(thrown instanceof AalooError);
//   }
// });

test('aaloo: config setter method updates config property if config property was not defined at the time of instantiation', (t) => {
  const client = Aaloo.new({ foo: 1, baseUrl: 'foo' });
  t.is(client.config.foo, 1);

  client.withFoo(2);
  t.is(client.config.foo, 2);

  client.withBaseUrl('baz');
  t.is(client.config.baseUrl, 'baz');
});

test('aaloo: can extend config by adding mixins', (t) => {
  class Mixin {
    config = {
      extraProp: true,
      headers: {
        b: 'a',
      },
    };
  }

  const aaloo = Aaloo.new({
    headers: {
      a: 'b',
    },
  }).addMixin(new Mixin());

  t.truthy(aaloo.config.extraProp);
  t.like(aaloo.config, {
    extraProp: true,
    headers: { a: 'b', b: 'a' },
  });
});

test('aaloo: adapter', (t) => {
  class Adapter extends AalooAdapter {
    transformConfig(config: AalooConfig) {
      return config;
    }

    request(config: AalooConfig) {
      const { p, i, t } = config as { [key: string]: number };
      return p + ((p * i) / 100) * t;
    }
  }

  const si = Aaloo.new({ p: 1000, i: 8, t: 1 })
    .setAdapter(Adapter)
    .request<number>();
  t.is(si, 1080);
});
