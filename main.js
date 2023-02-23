import { sortByPriceAsc, sortByPriceDec, sortByTitleAsc, sortByTitleDec, sortByAuthorAsc, sortByAuthorDec } from "./sort";

let books, categories = [], authors = [],
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
  addFilters();
  displayBooks(books);
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

function addFilters() {
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
    const filter = event.target.value;
    let matchingArray = getMatchingArray(filter);

    books = await getJSON('/books.json');
    let filteredBooks;
    switch (matchingArray) {
      case categories:
        filteredBooks = books.filter(book => book.category === filter);
        break;
      case authors:
        filteredBooks = books.filter(book => book.author.includes(filter));
        break;
      case priceIntervall:
        const [minPrice, maxPrice] = filter.split('-').map(parseFloat);
        filteredBooks = books.filter(book => book.price >= minPrice && book.price <= maxPrice);
        break;
      default:
        filteredBooks = books;
        break;
    }

    // Update the product container with the filtered books
    displayBooks(filteredBooks);
  });

  //SORTING
  const sorting = document.querySelector(".sorting");
  sorting.addEventListener("change", async event => {
    const sortType = event.target.value.toLowerCase();

    books = await getJSON('/books.json')
    let sortedBooks;
    switch (sortType) {
      case "title ascending":
        sortedBooks = sortByTitleAsc(books);
        break;
      case "title descending":
        sortedBooks = sortByTitleDec(books);
        break;
      case "price ascending":
        sortedBooks = sortByPriceAsc(books);
        break;
      case "price descending":
        sortedBooks = sortByPriceDec(books);
        break;
      case "author ascending":
        sortedBooks = sortByAuthorAsc(books)
        break;
      case "author descending":
        sortedBooks = sortByAuthorDec(books)
        break;
      default:
        sortedBooks = books;
    }

    // Update the product container with the sorted books
    displayBooks(sortedBooks);
  });
}

function displayBooks(books) {
  let productsHtml = "";
  for (let i = 0; i < books.length; i++) {
    productsHtml += /*html*/`
      <div class="card col-lg-2 col-md-3 col-sm-5 col-12">
        <img src="${books[i].imagePath}" alt="${books[i].title}" style="width:100%">
        <h1>${books[i].title}</h1>
        <p class="price">${books[i].price.toFixed(2)}kr</p>
        <p>${books[i].category}</p>
        <p><button type="button" class="btn btn-light details-button" data-mdb-ripple-color="dark" data-title="${books[i].title}">Details</button>
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