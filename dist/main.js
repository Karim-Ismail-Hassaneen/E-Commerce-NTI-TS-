"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let container = document.querySelector(".container");
let searchInput = document.querySelector("#searchInput");
let categorySelect = document.querySelector("#categorySelect");
let lowPriceInput = document.querySelector("#lowPriceInput");
let highPriceInput = document.querySelector("#highPriceInput");
let applyFilterButton = document.querySelector("#applyFilterButton");
let cartQuantity = document.querySelector("#cartQuantity");
let cart = [];
//   const URL = "https://fakestoreapi.com/products";
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("https://fakestoreapi.com/products");
    const data = yield res.json();
    return data;
});
const addToCart = (product) => {
    cart.push(product);
    updateCartQuantity();
};
const updateCartQuantity = () => {
    cartQuantity.textContent = cart.length.toString();
};
const displayProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = searchInput.value.toLowerCase();
    let selectedCategory = categorySelect.value;
    let lowPrice = parseFloat(lowPriceInput.value) || 0;
    let highPrice = parseFloat(highPriceInput.value) || 999999;
    const products = yield getData();
    const filteredProducts = products.filter((product) => {
        const matchesQuery = product.title.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= lowPrice && product.price <= highPrice;
        return matchesQuery && matchesCategory && matchesPrice;
    });
    const displayData = filteredProducts.map((product) => {
        return `
        <div class="products-grid">
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image" src="${product.image}" />
            </div>
            <div class="product-name limit-text-to-2-lines">${product.title}</div>
            <div class="product-rating-container">
              <div class="product-rating-count link-primary">${product.rating.rate}</div>
            </div>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart-button button-primary" data-product='${JSON.stringify(product)}'>Add to Cart</button>
          </div>
          <div class="product-spacer"></div>
        </div>`;
    }).join("");
    container.innerHTML = displayData;
    document.querySelectorAll(".add-to-cart-button").forEach(button => {
        button.addEventListener("click", (e) => {
            const target = e.target;
            const product = JSON.parse(target.getAttribute('data-product'));
            addToCart(product);
        });
    });
});
searchInput.addEventListener('input', displayProducts);
applyFilterButton.addEventListener('click', displayProducts);
displayProducts();
