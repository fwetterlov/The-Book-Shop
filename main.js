import { sortByPriceAsc, sortByPriceDec, sortByTitleAsc, sortByTitleDec, sortByAuthorAsc, sortByAuthorDec } from "./sort";

let books, shopCart = [], chosenFilter = "All", chosenSort, categories = [], authors = [],
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

  const shoppingCartButton = document.getElementById("shoppingcart");
  shoppingCartButton.addEventListener("click", function () {
    console.log(shopCart);
    let shopCartHtml = "";
    shopCartHtml += /*html*/`
    <div class="modal" id="modal-content">
      <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close" data-mdb-ripple-color="dark"></button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Loop through the books in shopCart and create a row for each one
    for (let i = 0; i < shopCart.length; i++) {
      let book = shopCart[i];
      shopCartHtml += /*html*/`
      <tr>
        <td>${book.title}</td>
        <td>${book.price}</td>
      </tr>
    `;
    }

    // Close the table element
    shopCartHtml += /*html*/`
        </tbody>
      </table>
    </div>
  `;

    //document.body.insertAdjacentHTML('beforeend', detailsHtml);
    document.querySelector('.modal-container').innerHTML = shopCartHtml;

    const closeButton = document.querySelector('.btn-close');
    closeButton.addEventListener('click', function (event) {
      document.querySelector('.modal-container').innerHTML = "";
    });
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
        <p><button type="button" class="btn btn-light details-button" id="detailsbutton" data-mdb-ripple-color="dark">Details</button>
        <button type="button" class="btn btn-light add-button" id="add" data-mdb-ripple-color="dark">Add to cart</button></p>
      </div>
      `;
  }

  document.querySelector('#product-container').innerHTML = productsHtml;

  // Attach a click event listener to each "Details" button
  const detailsButtons = document.querySelectorAll('#detailsbutton');
  for (let i = 0; i < detailsButtons.length; i++) {
    const book = sortedBooks[i];
    detailsButtons[i].addEventListener('click', function (event) {

      let detailsHtml = "";
      detailsHtml += /*html*/`
      <div class="modal" id="modal-content">
        <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close" data-mdb-ripple-color="dark"></button>
        <div id="details">
          <h4>${book.title}</h4>
          <hr width="100%" color="grey" />
          <img src="${book.imagePath}" alt="${book.title}">
          <p style="font-size: 15px;">${book.description}</p>
          <hr width="100%" color="grey" />
          <div class="container" id="info-container">
            <div class="row">
              <div class="col-sm-4 mb-4 mb-sm-0" id="info-row">
                <p style="font-size: 14px; color: grey;">Author: ${book.author}</p>
              </div>
              <div class="col-sm-4 mb-4 mb-sm-0" id="info-row">
                <p style="font-size: 14px; color: grey;">Price: ${book.price}kr</p>
              </div>
              <div class="col-sm-4" id="info-row">
                <button type="button" class="btn btn-light detail-add-button" data-mdb-ripple-color="dark" data-title="${book.title}">Add to cart</button></p>
              </div>
            </div>      
          </div>
        </div>
      </div>
      `;

      //document.body.insertAdjacentHTML('beforeend', detailsHtml);
      document.querySelector('.modal-container').innerHTML = detailsHtml;

      const closeButton = document.querySelector('.btn-close');
      closeButton.addEventListener('click', function (event) {
        document.querySelector('.modal-container').innerHTML = "";
      });

      // Attach a click event listener to each "Details" button
      const addButton = document.querySelector('.detail-add-button');
      addButton.addEventListener('click', function (event) {
        console.log(book)
        shopCart.push(book);
      });
    });
  }

  // Attach a click event listener to each "Details" button
  const addButtons = document.querySelectorAll('.add-button');
  for (let i = 0; i < addButtons.length; i++) {
    const book = sortedBooks[i];
    addButtons[i].addEventListener('click', function (event) {
      console.log(book)
      shopCart.push(book);
    });
  }

}

start();