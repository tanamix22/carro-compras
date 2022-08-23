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
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    pintarCarrito();
  }
});
cards.addEventListener('click', (e) => {
  addCarrito(e);
});
items.addEventListener('click', (e) => {
  btnAccion(e);
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
  items.innerHTML = '';
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector('th').textContent = producto.id;
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantida;
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
    templateCarrito.querySelector('span').textContent =
      producto.cantida * producto.precio;
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  pintarFooter();

  localStorage.setItem('carrito', JSON.stringify(carrito));
};

const pintarFooter = () => {
  footer.innerHTML = '';
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantida }) => acc + cantida,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantida, precio }) => acc + cantida * precio,
    0
  );

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
  templateFooter.querySelector('span').textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById('vaciar-carrito');
  btnVaciar.addEventListener('click', () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAccion = (e) => {
  if (e.target.classList.contains('btn-info')) {
    const producto = carrito[e.target.dataset.id];
    producto.cantida++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.classList.contains('btn-danger')) {
    const producto = carrito[e.target.dataset.id];
    producto.cantida--;
    if (producto.cantida === 0) {
      delete carrito[e.target.dataset.id];
      pintarCarrito();
    }
    pintarCarrito();
  }

  e.stopPropagation();
};
