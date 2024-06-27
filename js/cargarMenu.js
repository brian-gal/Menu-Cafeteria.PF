const contenedorMenu = document.getElementById('contenedor-menu');
const navegacion = document.getElementById('navegacion');

// Cargar menú desde un archivo JSON
async function cargarMenu() {
    try {
        const resp = await fetch('menu.json');
        const data = await resp.json();
        creandoContenedoresMenu(data);
        AnimacionBotones();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Crear contenedores de menú
function creandoContenedoresMenu(data) {
    const categoriasUnicas = [];

    //crea un array con las categorias disponibles en base al json
    data.forEach(menu => {
        if (!categoriasUnicas.includes(menu.categoria)) {
            categoriasUnicas.push(menu.categoria);
        }
    });

    // Crear enlaces de navegación por cada categoría del array
    categoriasUnicas.forEach(categoria => {
        const enlaceCategoria = document.createElement('a');
        const idCategoria = categoria.toLowerCase().replace(/\s+/g, '-'); // Convierte la categoria en formato de ID
        enlaceCategoria.href = `#${idCategoria}`;    // Asigna el ID convertido como dirección de enlace
        enlaceCategoria.textContent = categoria;    // Asigna el nombre de la categoría como texto del enlace
        navegacion.appendChild(enlaceCategoria);
    });


    //crea un div por cada categoria
    categoriasUnicas.forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('categoria');
        const idCategoria = categoria.toLowerCase().replace(/\s+/g, '-'); // Convierte la categoria en formato de ID
        const tituloCategoria = document.createElement('h2');

        tituloCategoria.textContent = categoria;    // Asigna el nombre de la categoría como texto del título
        tituloCategoria.id = `${idCategoria}`;  // Asigna el ID convertido al título de la categoría para que el enlace anterior te lleve al titulo
        categoriaDiv.appendChild(tituloCategoria);  // Añade el título de la categoría al div de la categoría

        const menuItemsDiv = document.createElement('div');
        menuItemsDiv.classList.add('menu-items');

        data.forEach(menu => {
            if (menu.categoria === categoria) {
                const menuDiv = document.createElement('div');
                menuDiv.classList.add('menu-item');
                menuDiv.innerHTML = `
                    <h3>${menu.nombre}</h3>
                    <div>
                        <img src="${menu.foto}" alt="${menu.nombre}">
                    </div>
                    <p>Precio: $${menu.precio}</p>
                    <div class="divAgregarCarrito">
                        <button class="buttonAgregarCarrito" data-nombre="${menu.nombre}">
                            <i class="bi bi-cart"></i>
                            <i class="bi bi-cart-check-fill"></i>
                            <span class="added">Agregar</span>
                            <i class="bi bi-check2 added2"></i>
                        </button>
                    </div>
                `;
                menuItemsDiv.appendChild(menuDiv);

                //le asigna el evento a cada boton
                menuDiv.querySelector('.buttonAgregarCarrito').addEventListener('click', () => {
                    addToCart(menu);
                });
            }
        });

        categoriaDiv.appendChild(menuItemsDiv);
        contenedorMenu.appendChild(categoriaDiv);
    });
}

cargarMenu();