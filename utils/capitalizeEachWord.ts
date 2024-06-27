export const capitalizeEachWord = (text:string):string => {
  if (text) {
    const capitalizedWords:string[] = text.split(' ').map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return capitalizedWords.join(' ')
  } else {
    return ''
  }
}
