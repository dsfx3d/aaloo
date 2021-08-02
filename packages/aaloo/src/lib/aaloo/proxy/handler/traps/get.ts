// import { AalooError } from '../../../exceptions';

export function getTrap({ configSetterRegex }) {
  return function (target, prop, receiver) {
    if (typeof prop === 'symbol') {
      return Reflect.get(target, prop, receiver);
    }

    const setterSignatureMatch = prop.match(configSetterRegex);
    if (setterSignatureMatch && setterSignatureMatch.length) {
      let configProp = setterSignatureMatch.pop();
      configProp = `${configProp[0].toLowerCase()}${configProp.slice(1)}`;
      // eslint-disable-next-line no-prototype-builtins
      // const propExists = receiver._config.hasOwnProperty(configProp);

      // if (propExists) {
      return function (value) {
        receiver._config[configProp] = value;
      };
      // }
      // throw new AalooError(`${prop} is not a method`);
    }

    return Reflect.get(target, prop, receiver);
  };
}
