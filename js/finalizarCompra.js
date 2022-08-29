/////////////////////////// DOM ///////////////////////////

const confirmarCompra = document.querySelector('#confirmarCompra');
const nombreCliente = document.querySelector('#nombreCliente');
const apellidoCliente = document.querySelector('#apellidoCliente');
const emailCliente = document.querySelector('#emailCliente');
const wrapperCompraFinal = document.querySelector('#wrapperCompraFinal');

/////////////////////////// FUNCIONES ///////////////////////////

function cargarCarritoDeLocalStorage() {
    carrito = JSON.parse(miLocalStorage.getItem('carrito')) || []
}

async function mostrarResumenCompra() {
    let productos = await traerProductos();
    // Muestra un resumen del carrito seleccionado en el paso anterior
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
        const itemFinal = productos.filter((prod) => {
            return prod.idprod === parseInt(item);
        });
        const unidadesProd = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);
        let div = document.createElement('div')
        div.setAttribute('class', 'resumenCarrito')
        div.innerHTML = `
                        <img src='${itemFinal[0].imagen}' alt=${itemFinal[0].nombre} class="imgProdResumen">
                        <p class="nombreProdResumen">${itemFinal[0].nombre}</p>
                        <p class="cantProdResumen">Cantidad ${unidadesProd}</p>
                        <p class="precioProdResumen">P.U. $${itemFinal[0].precio}</p>
                        `
        secResumenCompra.append(div);
    });

    const Total =
        carrito.reduce((total, item) => {
            const miItem = productos.filter((items) => {
                return items.idprod === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0);

    precioFinalResumen.textContent = Total;

}

function chequearLocalStorage() {
    // Para prevenir que se muestre el resumen de compra vacío al refrescar la página luego de una compra
    let contMensajeCompra;
    let mensajeCompra;
    miLocalStorage.getItem('carrito') == null &&
        (
            wrapperCompraFinal.innerHTML = '',
            wrapperCompraFinal.style.height = "80vh",
            contMensajeCompra = document.createElement('div'),
            contMensajeCompra.setAttribute('class', 'contMensajeCompra'),
            mensajeCompra = document.createElement('p'),
            mensajeCompra.setAttribute('class', 'mensajeCompra'),
            mensajeCompra.innerText = "Vuelva al inicio para comprar",
            wrapperCompraFinal.appendChild(contMensajeCompra),
            contMensajeCompra.appendChild(mensajeCompra)
        )
}

function finalizarCompra() {
    // Muestra una animacion por el procesamiento de la compra y despliega un mensaje de la compra finalizada
    mostrarAnimacionCompra();
    wrapperCompraFinal.innerHTML = ''
    wrapperCompraFinal.style.height = "80vh";
    let contMensajeCompra = document.createElement('div');
    contMensajeCompra.setAttribute('class', 'contMensajeCompra');
    let mensajeCompra = document.createElement('p');
    mensajeCompra.setAttribute('class', 'mensajeCompra');
    mensajeCompra.innerText = "¡" + nombreCliente.value + " " + apellidoCliente.value + "  muchas gracias por tu compra!" + "\nLa información para el pago será enviada a: " + emailCliente.value;
    wrapperCompraFinal.appendChild(contMensajeCompra);
    contMensajeCompra.appendChild(mensajeCompra);
    carrito = [];
    localStorage.clear();
}

function mostrarAnimacionCompra() {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Procesando Compra',
        showConfirmButton: false,
        timer: 1500
    })
}

//////////////////////////////// PROGRAMA ////////////////////////////////

traerProductos()
cargarCarritoDeLocalStorage()
mostrarResumenCompra()
chequearLocalStorage()
