export const formators = () => {
  const hexToDecimal = (hex) => {
    hex = hex.startsWith('0x') ? hex.slice(2) : hex
    return parseInt(hex, 16)
  }

  return {
    hexToDecimal
  }
}

export const changeUnderlineToUppercase = inputText => inputText.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
