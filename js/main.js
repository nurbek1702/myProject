const API = "http://localhost:3001/phones";
let inpName = document.querySelector("#inpName");
let inpMemory = document.querySelector("#inpMemory");
let inpImage = document.querySelector("#inpImage");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let btnOpenForm = document.querySelector("#flush-collapseOne");
let sectionProducts = document.querySelector("#sectionProducts");
let currentPage = 1;
let countPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
//Переменная для детального обзора
let detailsContainer = document.querySelector(".details");
btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpMemory.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
  let newProduct = {
    productName: inpName.value,
    productMemory: inpMemory.value,
    productImage: inpImage.value,
    productPrice: inpPrice.value,
  };
  createProducts(newProduct);
  readProducts();
});

//! ================CREATE====================
function createProducts(product) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  });
  inpName.value = "";
  inpMemory.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  btnOpenForm.classList.toggle("show");
}
//! =====================READ=======================
async function readProducts() {
  const response = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=4`
  );
  const data = await response.json();
  sectionProducts.innerHTML = "";
  data.forEach((item) => {
    sectionProducts.innerHTML += `
    <div class="card m-4 cardProduct" style="width: 14rem">
      <img
        id="${item.id}"
        src="${item.productImage}"
        alt=""
        class="card-img-top detailsCard"
        style="height: 280px"
      />
      <div class="card-body">
        <h5 class="card-title">${item.productName}</h5>
        <p class="card-text">${item.productMemory}</p>
        <span class="card-text">${item.productPrice}</span>
        <div>
        <button class="btn btn-outline-success btnBuy" data-id="${item.id}">Купить</button>
        <button class="detailsCard btn btn-outline-warning btnDetails" id="${item.id}">Обзор</button>
        <button class="btn btn-outline-danger btnDelete" id="${item.id}" >
        Удалить
        </button>
        <button
      class="btn btn-outline-warning btnEdit"
      id="${item.id}"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Изменить
    </button></div>
        </div>
      </div>
    </div>
    `;
  });
  pageFunc();
}

readProducts();
//!=========== delete ==========
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readProducts());
  }
});

//!================Edit/ Save===============
let editInpName = document.querySelector("#editInpName");
let editInpMemory = document.querySelector("#editInpMemory");
let editInpImage = document.querySelector("#editInpImage");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpName.value = data.productName;
        editInpMemory.value = data.productMemory;
        editInpImage.value = data.productImage;
        editInpPrice.value = data.productPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedProduct = {
    productName: editInpName.value,
    productMemory: editInpMemory.value,
    productImage: editInpImage.value,
    productPrice: editInpPrice.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});
function editProduct(editProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editProduct),
  }).then(() => readProducts());
}
//!================ Pagination ==================
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 4);
    });
}
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
//!=============SEARCH==================
inpSearch.addEventListener("input", (e) => {
  currentPage = 1;
  searchValue = e.target.value.trim();
  readProducts();
});
//!============= Categories ===========
let access = document.querySelector(".dropdown-item2");
access.addEventListener("click", (e) => {});
//!------------- Корзина -------------
document.addEventListener("DOMContentLoaded", function () {
  let cartItems = document.querySelector("#cart-items");

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btnBuy")) {
      let productId = e.target.getAttribute("data-id");
      fetch(`${API}/${productId}`)
        .then((response) => response.json())
        .then((product) => {
          addToCart(product);
        });
    }
  });
  function addToCart(product) {
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    storedCart.push(product);
    localStorage.setItem("cart", JSON.stringify(storedCart));

    updateCart();
  }
  function updateCart() {
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.innerHTML = "";
    storedCart.forEach((item) => {
      cartItems.innerHTML += `<li>${item.productName} - ${item.productPrice}</li>`;
    });
  }

  let checkoutBtn = document.querySelector("#btnCheckout");
  checkoutBtn.addEventListener("click", function () {
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    alert("Заказ оформлен! В ближайшее время с вами свяжутся наши специалисты");
    storedCart = [];
    localStorage.setItem("cart", JSON.stringify(storedCart));
    updateCart();
  });
});

// !======================ДЕТАЛЬНЫЙ ОБЗОР======================
document.addEventListener("click", (event) => {
  let arr1 = [...event.target.classList];

  const productId = event.target
    .closest(".cardProduct")
    ?.querySelector("img")?.id;
  if (arr1.includes("btnDetails")) {
    details(productId);
  }
});

async function details(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();

    if (!res.ok) {
      console.log(`HTTP Error! Status ${res.status}`);
    } else {
      displayDetails(data);
    }
  } catch (error) {
    console.error(error);
  }
}

function displayDetails(data) {
  detailsContainer.innerHTML = `
    <img src="${data.productImage}" alt="">
    <h2>${data.productName}</h2>
    <span>${data.productMemory}</span>
    <p>${data.productPrice}</p>
    <button class="btn btn-outline-warning btnCloseDetails">Скрыть</button>
  `;
  detailsContainer.style.display = "block";
  sectionProducts.style.display = "none";

  let btnCloseDetails = detailsContainer.querySelector(".btnCloseDetails");
  btnCloseDetails.addEventListener("click", closeDetails);
}

function closeDetails() {
  detailsContainer.style.display = "none";
  sectionProducts.style.display = "block";
}
// !====================== Регистрация ======================
let inpUsername = document.querySelector("#inpUsername");
let inpPassword = document.querySelector("#inpPassword");
let btnRegister = document.querySelector("#btnRegister");

btnRegister.addEventListener("click", () => {
  if (!inpUsername.value.trim() || !inpPassword.value.trim()) {
    alert("Заполните все поля!");
    return;
  }

  let newUser = {
    username: inpUsername.value,
    password: inpPassword.value,
  };

  registerUser(newUser);
});

function registerUser(newUser) {
  fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Пользователь успешно зарегистрирован!");
      inpUsername.value = "";
      inpPassword.value = "";
    })
    .catch((error) => {
      console.error("Ошибка при регистрации пользователя:", error);
      alert("Ошибка при регистрации пользователя. Пожалуйста, попробуйте снова.");
    });
}

