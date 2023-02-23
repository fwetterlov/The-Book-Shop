import { sortByPriceAsc, sortByPriceDec, sortByTitleAsc, sortByTitleDec, sortByAuthorAsc, sortByAuthorDec } from "./sort";

let books, chosenFilter = "All", chosenSort, categories = [], authors = [],
  priceIntervall = ["0-200", "201-300", "301-400", "401-500", "501-600", "601-700"];

async function getJSON(url) {
  let rawData = await fetch(url);
  let data = await rawData.json();

  return data;
}

async function start() {
  books = await getJSON('/books.json');
  getCategories(books);
  getAuthors(books);
  addFiltersAndSort();
  displayBooks();
}

function getCategories(books) {
  books.forEach((book) => {
    if (!categories.includes(book.category)) {
      categories.push(book.category);
    }
  });
  categories.sort();
}

function getAuthors(books) {
  books.forEach((book) => {
    if (!authors.includes(book.author)) {
      authors.push(book.author);
    }
  });
  authors.sort();
}

function getMatchingArray(searchTerm) {
  if (categories.includes(searchTerm)) {
    return categories;
  } else if (authors.includes(searchTerm)) {
    return authors;
  } else if (priceIntervall.includes(searchTerm)) {
    return priceIntervall;
  } else {
    return books; // No match found
  }
}

function addFiltersAndSort() {
  let filtersHtml = /*html*/`
  <select class="filters">
    <option>Filtering</option>
    <optgroup label="Category" id="option">
      <option>All</option>
      ${categories.map(category => `<option>${category}</option>`).join("")}
    </optgroup>
    <optgroup label="Prices" id="option">
      <option>All</option>
      ${priceIntervall.map(prices => `<option>${prices}</option>`).join("")}
    </optgroup>
    <optgroup label="Author" id="option">
      <option>All</option>
      ${authors.map(author => `<option>${author}</option>`).join("")}
    </optgroup>
  </select>
  <select class="sorting">
    <option>Sorting</option>
    <optgroup label="Price">
      <option>Price Ascending</option>
      <option>Price Descending</option>
    </optgroup>
    <optgroup label="Title">
      <option>Title Ascending</option>
      <option>Title Descending</option>
    </optgroup>
    <optgroup label="Author">
      <option>Author Ascending</option>
      <option>Author Descending</option>
    </optgroup>
  </select>
  `;

  document.querySelector('.filter-container').innerHTML = filtersHtml;

  //FILTERING
  const filters = document.querySelector(".filters");
  filters.addEventListener("change", async event => {
    chosenFilter = event.target.value;
    displayBooks();
  });

  //SORTING
  const sorting = document.querySelector(".sorting");
  sorting.addEventListener("change", async event => {
    chosenSort = event.target.value.toLowerCase();
    displayBooks();
  });
}

function displayBooks() {

  let matchingArray = getMatchingArray(chosenFilter);
  let filteredBooks;
  switch (matchingArray) {
    case categories:
      filteredBooks = books.filter(book => book.category === chosenFilter);
      break;
    case authors:
      filteredBooks = books.filter(book => book.author.includes(chosenFilter));
      break;
    case priceIntervall:
      const [minPrice, maxPrice] = chosenFilter.split('-').map(parseFloat);
      filteredBooks = books.filter(book => book.price >= minPrice && book.price <= maxPrice);
      break;
    default:
      filteredBooks = books;
      break;
  }

  let sortedBooks;
  switch (chosenSort) {
    case "title ascending":
      sortedBooks = sortByTitleAsc(filteredBooks);
      break;
    case "title descending":
      sortedBooks = sortByTitleDec(filteredBooks);
      break;
    case "price ascending":
      sortedBooks = sortByPriceAsc(filteredBooks);
      break;
    case "price descending":
      sortedBooks = sortByPriceDec(filteredBooks);
      break;
    case "author ascending":
      sortedBooks = sortByAuthorAsc(filteredBooks)
      break;
    case "author descending":
      sortedBooks = sortByAuthorDec(filteredBooks)
      break;
    default:
      sortedBooks = filteredBooks;
  }

  let productsHtml = "";
  for (let i = 0; i < sortedBooks.length; i++) {
    productsHtml += /*html*/`
      <div class="card col-lg-2 col-md-3 col-sm-5 col-12">
        <img src="${sortedBooks[i].imagePath}" alt="${sortedBooks[i].title}" style="width:100%">
        <h1>${sortedBooks[i].title}</h1>
        <p class ="author">${sortedBooks[i].author}</p>
        <p class="price">${sortedBooks[i].price.toFixed(2)}kr</p>
        <p>${sortedBooks[i].category}</p>
        <p><button type="button" class="btn btn-light details-button" data-mdb-ripple-color="dark" data-title="${sortedBooks[i].title}">Details</button>
        <button type="button" class="btn btn-light" data-mdb-ripple-color="dark">Add to cart</button></p>
      </div>
      `;
  }

  document.querySelector('#product-container').innerHTML = productsHtml;

  // Attach a click event listener to each "Details" button
  const detailsButtons = document.querySelectorAll('.details-button');
  for (let i = 0; i < detailsButtons.length; i++) {
    detailsButtons[i].addEventListener('click', function (event) {
      const title = this.dataset.title;
      const book = books.find((book) => book.title === title);
      console.log(book);
    });
  }
}

start();