interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
  
  let container = document.querySelector(".container") as HTMLElement;
  let searchInput = document.querySelector("#searchInput") as HTMLInputElement;
  let categorySelect = document.querySelector("#categorySelect") as HTMLSelectElement;
  let lowPriceInput = document.querySelector("#lowPriceInput") as HTMLInputElement;
  let highPriceInput = document.querySelector("#highPriceInput") as HTMLInputElement;
  let applyFilterButton = document.querySelector("#applyFilterButton") as HTMLButtonElement;
  let cartQuantity = document.querySelector("#cartQuantity") as HTMLElement;
  
  let cart: Product[] = [];
  
//   const URL = "https://fakestoreapi.com/products";
  
  const getData = async (): Promise<Product[]> => {
    const res = await fetch("https://fakestoreapi.com/products");
    const data: Product[] = await res.json();
    return data;
  };
  
  const addToCart = (product: Product): void => {
    cart.push(product);
    updateCartQuantity();
  };
  
  const updateCartQuantity = (): void => {
    cartQuantity.textContent = cart.length.toString();
  };
  
  const displayProducts = async (): Promise<void> => {
    let query = searchInput.value.toLowerCase();
    let selectedCategory = categorySelect.value;
    let lowPrice = parseFloat(lowPriceInput.value) || 0;
    let highPrice = parseFloat(highPriceInput.value) || 999999;
  
    const products = await getData();
  
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
      button.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        const product = JSON.parse(target.getAttribute('data-product')!) as Product;
        addToCart(product);
      });
    });
  };
  
  searchInput.addEventListener('input', displayProducts);
  applyFilterButton.addEventListener('click', displayProducts);
  displayProducts();
  