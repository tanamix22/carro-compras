const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});
cards.addEventListener('click', (e) => {
  addCarrito(e);
});

const fetchData = async () => {
  try {
    const res = await fetch('api.json');
    const data = await res.json();
    pintarCard(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCard = (data) => {
  data.forEach((product) => {
    templateCard.querySelector('h5').textContent = product.title;
    templateCard.querySelector('p').textContent = product.precio;
    templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl);
    templateCard.querySelector('.btn-dark').dataset.id = product.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantida: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantida = carrito[producto.id].cantida + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  console.log(carrito);
};
