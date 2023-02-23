function sortByPriceAsc(books) {
  books.sort((a, b) => {
    return a.price - b.price;
  });
  return books;
}

function sortByPriceDec(books) {
  books.sort((a, b) => {
    return b.price - a.price;
  });
  return books;
}

function sortByTitleAsc(books) {
  books.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  return books;
}

function sortByTitleDec(books) {
  books.sort((a, b) => {
    return b.title.localeCompare(a.title);
  });
  return books;
}

function sortByAuthorAsc(books) {
  books.sort((a, b) => {
    return a.author.localeCompare(b.author);
  });
  return books;
}

function sortByAuthorDec(books) {
  books.sort((a, b) => {
    return b.author.localeCompare(a.author);
  });
  return books;
}

export { sortByPriceAsc, sortByPriceDec, sortByTitleAsc, sortByTitleDec, sortByAuthorAsc, sortByAuthorDec };