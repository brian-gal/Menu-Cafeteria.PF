const listaCarrito = document.getElementById('listaCarrito');
const carritoSuma = document.getElementById('carritoSuma');
const cartCount = document.getElementById('cart-count');
const contenedorIconoCarrito = document.getElementById('contenedorIconoCarrito')
const vaciarCarrito = document.getElementById('vaciarCarrito')
const compra = document.getElementById('compra')

let carrito = [];
let precioTotal;
let cantidadTotal;

// Agregar producto al carrito
function addToCart(menu) {
    const itemIndex = carrito.findIndex(item => item.nombre === menu.nombre);
    if (itemIndex === -1) {
        const item = {
            foto: menu.foto,
            nombre: menu.nombre,
            precio: menu.precio,
            cantidad: 1,
            total: menu.precio
        };
        carrito.push(item);
    } else {
        carrito[itemIndex].cantidad += 1;
        carrito[itemIndex].total = carrito[itemIndex].precio * carrito[itemIndex].cantidad;
    }
    updateCartDisplay();
    guardaCarritoStorage();
    AnimacionBotones();
}

//actualiza el carrito para que los productos aparezcan y los conteos se actualicen
function updateCartDisplay() {
    listaCarrito.innerHTML = '';
    carrito.forEach((item, index) => {
        const itemCarrito = document.createElement('div');
        itemCarrito.classList.add('item-carrito');
        itemCarrito.innerHTML = `
                <div class="item_img">
                      <img src="${item.foto}" alt="">
                </div>
                <div class="item_info">
                    <p class="nombre-cart">${item.nombre}</p>
                    <div class="controles-cantidad">
                        <i class="bi bi-dash-circle" id="restar-${index}"></i>
                         <p class="cantidad">${item.cantidad}</p>
                         <i class="bi bi-plus-circle" id="sumar-${index}"></i>
                    </div>
                    <p class="precio-cart">$${(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
                <i class="bi bi-trash3" id="borrar-${index}"></i>
            `;
        listaCarrito.appendChild(itemCarrito);

        eventoCantidad(index)

    });
    actualizaConteo()
    guardaCarritoStorage();
    AnimacionBotones();
}

function actualizaConteo() {
    precioTotal = carrito.reduce((acu, el) => acu + el.total, 0)
    cantidadTotal = carrito.reduce((acu, el) => acu + el.cantidad, 0)
    if (cantidadTotal > 0) {
        cartCount.textContent = `${cantidadTotal}`;
        carritoSuma.textContent = `Total: $${precioTotal.toFixed(2)}`;
        cartCount.style.display = ""
        carritoSuma.style.display = ``;
        compra.style.display = ""
        vaciarCarrito.style.display = ""
    } else {
        listaCarrito.innerHTML = `
            <p>¡Empezá un carrito de compras!</p>
            <p>Sumá productos y disfrutá de nuestras delicias.</p>
        `;
        cartCount.style.display = "none"
        carritoSuma.style.display = `none`;
        compra.style.display = "none"
        vaciarCarrito.style.display = "none"
    }
}

//aumenta o disminuye la cantidad desde los botones
function actualizarCantidad(index, cambio) {
    if (carrito[index].cantidad + cambio > 0) {
        carrito[index].cantidad += cambio;
        carrito[index].total = carrito[index].precio * carrito[index].cantidad;
    } else {
        null
    }
    updateCartDisplay();
    guardaCarritoStorage();
    AnimacionBotones();
}

//alimina un producto individualmente
function aliminaProductoCarrito(index) {
    carrito.splice(index, 1);
    updateCartDisplay();
    guardaCarritoStorage();
    AnimacionBotones();
}

function AnimacionBotones() {
    const buttons = document.querySelectorAll('.buttonAgregarCarrito');
    buttons.forEach(button => {
        const nombre = button.dataset.nombre;
        const itemEnCarrito = carrito.find(item => item.nombre === nombre);
        if (itemEnCarrito) {
            button.classList.add('clicked'); //comienza la animacion del boton al agregar un producto
        } else {
            button.classList.remove('clicked'); //retira la animacion del boton al sacar un producto
        }
    });
}

function guardaCarritoStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        updateCartDisplay();
    }
}

//---------------------EVENTOS---------------------------

//le asigna el evento a el +, - y al icono de borrar
function eventoCantidad(i) {
    document.getElementById(`restar-${i}`).addEventListener('click', () => actualizarCantidad(i, -1));
    document.getElementById(`sumar-${i}`).addEventListener('click', () => actualizarCantidad(i, 1));
    document.getElementById(`borrar-${i}`).addEventListener('click', () => aliminaProductoCarrito(i));
}

//vacia todo el carrito
vaciarCarrito.addEventListener("click", function () {
    Swal.fire({
        title: `¿Desea vaciar el carrito por completo?`,
        showConfirmButton: true,
        confirmButtonText: "Vaciar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            updateCartDisplay();
            guardaCarritoStorage();
            AnimacionBotones();
        }
    });
});

//evento de compra
compra.addEventListener("click", function () {
    Swal.fire({
        title: `El total a pagar es: $${precioTotal} ¿Desea confirmar su compra?`,
        showConfirmButton: true,
        confirmButtonText: "Comprar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Procesando compra...",
                text: "Espere unos segundos.",
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });
            setTimeout(() => {
                Swal.fire({
                    title: "¡Compra confirmada!",
                    text: "Su compra ha sido realizada correctamente.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000
                });
                document.getElementById("closeButton").click(); //cierra el carrito
                carrito = [];
                updateCartDisplay();
                guardaCarritoStorage();
                AnimacionBotones();
            }, 2000);
        }
    });
});

cargarCarritoStorage();
actualizaConteo()
