// https://github.com/lodash/lodash/issues/953
// https://stackoverflow.com/q/44145069/2603230
export function castArray(value) {
  return [].concat(value || []);
}
