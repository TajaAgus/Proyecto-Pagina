// Carga la función search. Esto se pone asi hay que esperar a cargar toda la pagina web para ejecutar una funcion de js.
document.addEventListener("DOMContentLoaded", search);
const URL_API = 'http://localhost:3000/api/'

var customers = []

function init() {
    search()
}

function add() {
    clean()
    openForm()
}
function openForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale opened")
}
  function closeForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale")
}

// FUNCION PARA CARGAR DATOS EN LA TABLA (ASYNC permite meter await dentro de la funcion)
async function search () {
    var url = URL_API + 'customers'
    //PEDIDO DE INFO EN JSON A LA URL CUSTOMERS (AWAIT ES PARA ESPERAR ESA INFO/FUNCION ANTES DE CARGAR UNA VARIABLE)
    var response = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    customers = await response.json() //CARGA A LA VARIABLE GLOBAL CUSTOMERS CON TODOS LOS DATOS DE LOS CLIENTES

    //CARGA DE DATOS EN VARIABLE HTML PARA CARGAR A LA TABLA
    var html = ''
    for (customer of customers) {
    var row = `<tr>
    <td>${customer.firstname}</td>
    <td>${customer.lastname}</td>
    <td>${customer.email}</td>
    <td>${customer.phone}</td>
    <td>${customer.address}</td>
    <td>
        <a href="#" onclick="edit(${customer.id})" class="botonEditar">Editar</a>
        <a href="#" onclick="remove(${customer.id})" class="botonEliminar">Eliminar</a>
    </td>
</tr>`
html = html + row;
}

//COMANDO PARA CARGAR DATOS EN LA TABLA
document.querySelector('.table > tbody').outerHTML = html

}

async function remove(id) {
    respuesta = confirm('¿Está seguro de eliminarlo?') //pide confirmación
    if (respuesta) { var url = URL_API + 'customers/' + id
        await fetch(url, {
        "method": 'DELETE',
        "headers": {
            "Content-Type": 'application/json'
         }
        })
    }
    window.location.reload(); //recarga pagina
}

async function save() {
     var data = {
            "address": document.getElementById('txtAddress').value,
            "email": document.getElementById('txtEmail').value,
            "firstname": document.getElementById('txtFirstname').value,
            "lastname": document.getElementById('txtLastname').value,
            "phone": document.getElementById('txtPhone').value
     }
     var id = document.getElementById('txtId').value
     if (id != '') {
         data.id = id
     }

    var url = URL_API + 'customers'
        await fetch(url, {
        "method": 'POST',
        "body": JSON.stringify(data),
        "headers": {
            "Content-Type": 'application/json'
         }
        })
        window.location.reload(); //recarga pagina
}

function edit(id) {
    openForm()
    var customer = customers.find(x => x.id == id) //trae la id del cliente de adentro del arreglo customers
    document.getElementById('txtId').value = customer.id
    document.getElementById('txtFirstname').value = customer.firstname
    document.getElementById('txtLastname').value = customer.lastname
    document.getElementById('txtPhone').value = customer.phone
    document.getElementById('txtEmail').value = customer.email
    document.getElementById('txtAddress').value = customer.address
}

function clean() {
    document.getElementById('txtId').value = ''
    document.getElementById('txtFirstname').value = ''
    document.getElementById('txtLastname').value = ''
    document.getElementById('txtPhone').value = ''
    document.getElementById('txtEmail').value = ''
    document.getElementById('txtAddress').value = ''
}