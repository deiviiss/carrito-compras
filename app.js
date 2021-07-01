const cards = document.getElementById('cards');
const footer = document.getElementById('footer');
const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

let carrito = {};

//*==================== eventos
document.addEventListener('DOMContentLoaded', () => {
  fechData()

  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
  }
});

cards.addEventListener('click', (event) => {
  addCarrito(event)
});

items.addEventListener('click', (event) => {
  btnAccion(event)
})

//*==================== api
const fechData = async () => {
  try {
    const res = await fetch('api.json')
    const data = await res.json()
    pintarCards(data)
  } catch (error) {
    console.log(error)
  }
};


//?==================== funciones

const pintarCards = (data) => {
  console.log('Cards');
  console.log(data);
  //recorro la api (json)
  data.forEach(producto => {

    templateCard.querySelector('h5').textContent = producto.title
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
    templateCard.querySelector('button').dataset.id = producto.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })

  cards.appendChild(fragment)
};

//función con el evento, manda data a setCarrito
const addCarrito = (event) => {
  // console.log(event.target);

  //pregunta si el elemento(target) tiene está clase true-false
  // console.log(event.target.classList.contains('btn-dark'));

  if (event.target.classList.contains('btn-dark')) {

    // console.log(event.target.parentElement);

    setCarrito(event.target.parentElement);
  }

  //detener cualquier otro event en item heredados por el padre
  event.stopPropagation()
};

const setCarrito = objeto => {
  console.log('Objeto que llega al carrito');
  console.log(objeto);

  //captura los objetos enviados por el evento
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
  }

  //pregunta si existe esa propiedad
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1
  }

  //spreate operator ... hace una copia del producto adquirido
  carrito[producto.id] = { ...producto }

  console.log('En el carrito');
  console.log(carrito);

  pintarCarrito()
};

const pintarCarrito = () => {
  //reinicia html
  items.innerHTML = ''

  //lo que esta en el carrito lo convierto en un array
  console.log('Lo que está en el carrito');
  console.log(Object.values(carrito));

  //recorro el array carrito
  Object.values(carrito).forEach(producto => {

    //limpia html
    items.innerHTML = ''

    //llenando template
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })

  items.appendChild(fragment)

  pintarFooter()

  localStorage.setItem('carrito', JSON.stringify(carrito))
};

const pintarFooter = () => {
  //reinicia html
  footer.innerHTML = ''

  //object keys para usar métodos de array
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

    return
  }

  //object value para usar métodos de array
  //suma la cantidad de productos
  const nCantidad = Object.values(carrito).reduce((acum, { cantidad }) => acum + cantidad, 0)

  //multiplica cantidad por precio
  const nPrecio = Object.values(carrito).reduce((acum, { precio, cantidad }) => acum + cantidad * precio, 0)

  console.log(nPrecio);
  console.log(nCantidad);

  //llenado del template
  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
  })

};

const btnAccion = (event) => {
  //llegar al item
  console.log(event.target);

  //botón de aumentar
  //se obtiene el elemento mediante su clase
  let sumar = event.target.classList.contains('btn-info');
  let restar = event.target.classList.contains('btn-danger');

  if (sumar) {
    console.log(carrito[event.target.dataset.id]);
    const producto = carrito[event.target.dataset.id]

    producto.cantidad = carrito[event.target.dataset.id].cantidad + 1

    //spreate operator ... hace una copia del producto adquirido
    carrito[event.target.dataset.id] = { ...producto }
    pintarCarrito()
  }

  //botón de restar
  if (restar) {
    console.log(carrito[event.target.dataset.id]);
    const producto = carrito[event.target.dataset.id]

    // producto.cantidad = carrito[event.target.dataset.id].cantidad - 1
    producto.cantidad--

    if (producto.cantidad === 0) {
      delete carrito[event.target.dataset.id]
    }

    pintarCarrito()
  }

  //detener cualquier otro event en item heredados por el padre
  event.stopPropagation()

}