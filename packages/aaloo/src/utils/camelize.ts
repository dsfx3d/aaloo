export function camelize(str: string, separator = '_') {
  const iter = str.split(separator)
  const capital = iter.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  )
  return capital.join('')
}

// https://stackoverflow.com/questions/57556471/convert-kebab-case-to-camelcase-javascript
