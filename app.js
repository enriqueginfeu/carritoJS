const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const items = document.querySelector('#items');

let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    items.addEventListener('click', agregarCurso);

    carrito.addEventListener('click', eliminarCurso);

    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        
        limpiarHTML();

        carritoHTML();
    })
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

    carritoHTML();
})

const fetchData = async () => {
    try {
        const respuesta = await fetch('api.json')
        const data = await respuesta.json()
        card(data)
    } catch (error) {
        console.log(error)
    }
}
    const card = data => {
        data.forEach(function(item) { 
            const cardDiv = document.createElement('div');
            cardDiv.classList.add("p-5", "w-3/4", "m-auto", "sm:w-full")

            const card = document.createElement('div');
            card.classList.add("shadow-lg", "rounded-b-lg");
            
            const cardImg = document.createElement('img');
            cardImg.src = item.img;
            cardImg.classList.add("w-100", "rounded-b-xl");

            const cardBody = document.createElement('div');
            cardBody.classList.add("p-5");

            const cardTitulo = document.createElement('h2');
            cardTitulo.classList.add("text-3xl", "py-3");
            cardTitulo.textContent = item.title;

            const precio = document.createElement('p');
            precio.classList.add('text-xl', "font-bold");
            precio.textContent = '$ ' + item.precio;

            const botonAgregar = document.createElement('button');
            botonAgregar.setAttribute("data-id", item.id);
            botonAgregar.classList.add("agregar-carrito", "w-full", "text-white", "bg-gradient-to-r", "from-blue-500", "via-blue-600", "to-blue-700", "hover:bg-gradient-to-br", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "shadow-lg", "shadow-blue-500/50", "dark:shadow-lg", "dark:shadow-blue-800/80", "font-medium", "rounded-lg", "text-sm", "px-5", "py-2.5", "text-center", "me-2", "mb-2", "md:text-lg")
            botonAgregar.textContent = 'Agregar al Carrito'

            cardBody.appendChild(cardTitulo)
            cardBody.appendChild(precio)
            cardBody.appendChild(botonAgregar)

            card.appendChild(cardImg)
            card.appendChild(cardBody)
            
            cardDiv.appendChild(card)

            items.appendChild(cardDiv);



    })

    }

    function agregarCurso(e) {
        e.preventDefault();

        if(e.target.classList.contains('agregar-carrito')) {
            const cursoSeleccionado = e.target.parentElement.parentElement;
            leerDatosCurso(cursoSeleccionado);
        }
    }

    function eliminarCurso(e){
        
        if(e.target.classList.contains('borrar-curso')) {
            const cursoId = e.target.getAttribute('data-id');

            articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId )

            carritoHTML();
        }
    }

    function leerDatosCurso(curso) {

        const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h2').textContent,
            precio: curso.querySelector('p').textContent,
            id: curso.querySelector('button').getAttribute('data-id'),
            cantidad: 1
        }

        const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
        if(existe) {
            
            const cursos = articulosCarrito.map( curso => {
                if( curso.id === infoCurso.id ) {
                    curso.cantidad++;
                    return curso;
                } else {
                    return curso;
                }
            } );
            articulosCarrito = [...cursos];
        } else {
            articulosCarrito = [...articulosCarrito, infoCurso];
        }
        

        console.log(articulosCarrito)

        carritoHTML();
    }

    function carritoHTML() {

        limpiarHTML();

        let total = 0;

        articulosCarrito.forEach( curso => {
            
            const { imagen, titulo, precio, cantidad, id } = curso

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">
                    <img src=${imagen} >
                </td>
                <td class="text-center">
                    ${titulo}
                </td>
                <td class="text-center">
                    ${precio}
                </td>
                <td class="text-center">
                    ${cantidad}
                </td>
                <td>
                    <a href="#" class="borrar-curso" data-id="${id}"> X </a>
                </td>
            `;

            contenedorCarrito.appendChild(row);

            total += parseFloat(precio.replace('$', '')) * cantidad;
        });

        document.getElementById('total-carrito').textContent = total.toFixed(2);

        sicronizarStorage();
    }

    function sicronizarStorage() {
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
    }

    function limpiarHTML() {
        
        while(contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild)
        }
    }
    


