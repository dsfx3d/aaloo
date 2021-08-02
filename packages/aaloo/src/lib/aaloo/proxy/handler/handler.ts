// import { AalooError } from '../../exceptions';

import { getTrap } from './traps/get';

export function ServiceProxyHandler({ configSetterRegex }) {
  this.get = getTrap({ configSetterRegex });
  this.set = setTrap();
}

// traps
const setTrap = function () {
  return function (
    target,
    prop: PropertyKey,
    value: unknown,
    receiver: unknown
  ) {
    return Reflect.set(target, prop, value, receiver);
  };
};
// const applyTrap = function ({ configSetterRegex }) {
//   return function (target: TargetFunc, _this, args)
//     const configProp = isConfigSetter(configSetterRegex, target.name, _this);

//     if (configProp) {
//       const [arg] = args;
//       return Reflect.set(_this._config, configProp, arg);
//     }

//     throw new AalooError(`${target.name} is not a method`);
//   };
// };

// utils
// const isConfigSetter = (regex, name, _this) => {
//   const configSetterMatch = name.match(regex);
//   const isSetterSignature = configSetterMatch && configSetterMatch.length;

//   if (isSetterSignature) {
//     const configProp = configSetterMatch.pop().toLowerCase();
//     // eslint-disable-next-line no-prototype-builtins
//     const propExists = _this._config.hasOwnProperty(configProp);
//     if (propExists) {
//       return configProp;
//     }
//   }

//   return false;
// };

// type TargetFunc = (...args: never[]) => never;
