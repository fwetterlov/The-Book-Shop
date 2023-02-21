import { sortByPriceAsc } from "./sort";

let books, categories = ["All"], authors = [];

async function getJSON(url) {
  let rawData = await fetch(url);
  let data = await rawData.json();

  return data;
}

async function start() {
  books = await getJSON('/books.json')
  getCategories(books);
  getAuthors(books)
  console.log(books)
  console.log(authors)
  getHtml();
}

function getCategories(books) {
  books.forEach((book) => {
    if (!categories.includes(book.category)) {
      categories.push(book.category);
    }
  });
  categories.sort((a, b) => a.localeCompare(b));
}

function getAuthors(books) {
  books.forEach((book) => {
    if (!authors.includes(book.author)) {
      authors.push(book.author);
    }
  });
  authors.sort((a, b) => a.localeCompare(b));
}

function displayBooks() {
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

  // Create the HTML structure
  const html = /*html*/`
    <div class="row" id="product-container">
      ${productsHtml}
    </div>
  `;

  document.querySelector('main').innerHTML = html;
}

function getHtml() {
  displayBooks();

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