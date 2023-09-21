export default function truncate(str: string, num: number, middle: boolean = false, maskChar: string = ".") {
  if (str.length > num && str.length > 3) {
    if (!middle) {
      return `${str.substring(0, num)}${maskChar.repeat(3)}`
    }

    const a = Math.round((num * 2) / 3)
    const b = num - a

    return `${str.substring(0, a)}${maskChar.repeat(3)}${str.substring(str.length - b, str.length)}`
  }

  return str
}
