let productHead = document.getElementById("productHead");
let emptyCart = document.getElementById("emptyCart");
let MainAppend = document.getElementById("MainAppend");
let amt = document.getElementById("amt");
let countNumber = document.getElementById("countNumber");
let cartIcon = document.getElementById("cartIcon");
let cartBody = document.querySelector(".cartBody");
let light = document.getElementById("light");
let cartCloseBtn = document.getElementById("cartCloseBtn");

let arr = [];
let cartArray = JSON.parse(localStorage.getItem("CartArray")) || [];
let productId = 0;

function generatingProduct() {
    $.ajax({
        url: "https://dummyjson.com/products?limit=15",
        method: "GET",
        success: function (res) {
            res.products.forEach((value, index) => {
                const productHTML = `
                    <div id="productBody" class="mt-3 shadow">
                        <div id="productImage">
                            <img src="${value.thumbnail}" alt="">
                        </div>
                        <div id="productTitle">${value.title}</div>
                        <div id="subDetails">
                            <div>Category - <span>${value.category}</span></div>
                            <div class="my-1">Brand - <span>${value.brand}</span></div>
                            <div>Price - <span><i class="fa-regular fa-indian-rupee-sign"></i>${value.price}</span></div>
                            <button class="addToCartBtn" data-id="${productId}">
                                <i class="fa-solid fa-plus plusIcon"></i>
                                <i class="fa-solid fa-check checkMark"></i>
                                Add to cart
                            </button>
                        </div>
                    </div>`;

                let create = document.createElement("div");
                create.classList.add("col-lg-3", "col-md-4", "col-sm-6", "col-12");
                create.innerHTML = productHTML;
                productHead.appendChild(create);

                arr.push({
                    ID: productId,
                    Title: value.title,
                    Image: value.thumbnail,
                    Category: value.category,
                    Brand: value.brand,
                    Price: value.price,
                });

                productId++;
            });

            localStorage.setItem("Product", JSON.stringify(arr));
            attachAddToCartListeners();
        },
    });
}

function loadProduct() {
    const storedProducts = JSON.parse(localStorage.getItem("Product"));
    if (storedProducts && storedProducts.length > 0) {
        storedProducts.forEach((value, index) => {
            const productHTML = `
                <div id="productBody" class="mt-3 shadow">
                    <div id="productImage">
                        <img src="${value.Image}" alt="">
                    </div>
                    <div id="productTitle">${value.Title}</div>
                    <div id="subDetails">
                        <div>Category - <span>${value.Category}</span></div>
                        <div class="my-1">Brand - <span>${value.Brand}</span></div>
                        <div>Price - <span><i class="fa-regular fa-indian-rupee-sign"></i>${value.Price}</span></div>
                        <button class="addToCartBtn" data-id="${value.ID}">
                            <i class="fa-solid fa-plus plusIcon"></i>
                            <i class="fa-solid fa-check checkMark"></i>
                            Add to cart
                        </button>
                    </div>
                </div>`;

            let create = document.createElement("div");
            create.classList.add("col-lg-3", "col-md-4", "col-sm-6", "col-12");
            create.innerHTML = productHTML;
            productHead.appendChild(create);
        });
        attachAddToCartListeners();
    } else {
        generatingProduct();
    }
}

function attachAddToCartListeners() {
    let addToCartBtn = document.querySelectorAll(".addToCartBtn");
    let products = JSON.parse(localStorage.getItem("Product"));

    countNumber.innerText = cartArray.length;

    addToCartBtn.forEach((btn) => {
        btn.addEventListener("click", function () {
            const id = parseInt(btn.getAttribute("data-id"));
            const product = products.find((p) => p.ID === id);
            if (product) {
                cartArray.push({
                    Image: product.Image,
                    Title: product.Title,
                    Price: product.Price,
                });
                localStorage.setItem("CartArray", JSON.stringify(cartArray));
                countNumber.innerText = cartArray.length;
                alert(`${product.Title} added to cart!`);

                MainAppend.innerHTML = "";
                createProductInCart();
                calculateTotalAmt();
                attachRemoveListeners();
                updateEmptyCartDisplay();
            }
        });
    });
}

function createProductInCart() {
    let storedCart = JSON.parse(localStorage.getItem("CartArray")) || [];
    if (storedCart.length === 0) return;

    storedCart.forEach((item, index) => {
        let create = document.createElement("div");
        create.setAttribute("id", "cartProduct");
        create.innerHTML = `
            <div id="cartImage"><img src="${item.Image}" alt=""></div>
            <div id="cartRight">
                <div id="cartTitle">${item.Title}</div>
                <div><i class="fa-regular fa-indian-rupee-sign"></i><span>${item.Price}</span></div>
                <button class="removeFromCart" data-index="${index}">Remove</button>
            </div>`;
        MainAppend.appendChild(create);
    });
}

function attachRemoveListeners() {
    let removeBtns = document.querySelectorAll(".removeFromCart");
    removeBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const index = parseInt(btn.getAttribute("data-index"));
            if (!isNaN(index)) {
                cartArray.splice(index, 1);
                localStorage.setItem("CartArray", JSON.stringify(cartArray));
                countNumber.innerText = cartArray.length;
                MainAppend.innerHTML = "";
                createProductInCart();
                calculateTotalAmt();
                updateEmptyCartDisplay();
                attachRemoveListeners();
            }
        });
    });
}

function updateEmptyCartDisplay() {
    emptyCart.style.display = cartArray.length > 0 ? "none" : "block";
}

function calculateTotalAmt() {
    let get = JSON.parse(localStorage.getItem("CartArray")) || [];
    let total = get.reduce((sum, item) => sum + Number(item.Price), 0);
    amt.innerText = Math.round(total);
}

function reloadCart() {
    const get = sessionStorage.getItem("CartOpen");
    if (get === "true") {
        cartBody.classList.add("cartBodyToggle");
        light.style.display = "block";
        document.querySelector("body").style.overflow = "hidden";
    } else {
        cartBody.classList.remove("cartBodyToggle");
        light.style.display = "none";
        document.querySelector("body").style.overflow = "auto";
    }
}

cartIcon.addEventListener("click", function () {
    cartBody.classList.add("cartBodyToggle");
    light.style.display = "block";
    document.querySelector("body").style.overflow = "hidden";
    sessionStorage.setItem("CartOpen", "true");
});

cartCloseBtn.addEventListener("click", function () {
    cartBody.classList.remove("cartBodyToggle");
    light.style.display = "none";
    document.querySelector("body").style.overflow = "auto";
    sessionStorage.setItem("CartOpen", "false");
});

// Initial load
loadProduct();
createProductInCart();
attachRemoveListeners();
calculateTotalAmt();
updateEmptyCartDisplay();
reloadCart();
