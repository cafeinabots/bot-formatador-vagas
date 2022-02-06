export function searchTerms(terms, arrayToAdd, body) {
  const optionsArray = Object.keys(terms);
  for (let i = 0; i < optionsArray.length; i++) {
    for (let j = 0; j < terms[optionsArray[i]].terms.length; j++) {
      const termRegex = new RegExp(
        terms[optionsArray[i]].terms[j],
        terms[optionsArray[i]].regexOpt
      );
      if (body.search(termRegex) !== -1) {
        arrayToAdd.push(terms[optionsArray[i]].hashtag);
        break;
      }
    }
  }
}
