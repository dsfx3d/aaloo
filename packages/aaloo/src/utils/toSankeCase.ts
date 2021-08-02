export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

// https://stackoverflow.com/questions/54246477/how-to-convert-camelcase-to-snake-case-in-javascript
