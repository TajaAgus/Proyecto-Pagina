document.addEventListener("DOMContentLoaded", search);
const URL_API = 'http://localhost:3000/api/'

var employees = []


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
    var url = URL_API + 'employees'
    //PEDIDO DE INFO EN JSON A LA URL CUSTOMERS (AWAIT ES PARA ESPERAR ESA INFO/FUNCION ANTES DE CARGAR UNA VARIABLE)
    var response = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    employees = await response.json() //CARGA A LA VARIABLE GLOBAL CUSTOMERS CON TODOS LOS DATOS DE LOS CLIENTES

    //CARGA DE DATOS EN VARIABLE HTML PARA CARGAR A LA TABLA
    var html = ''
    for (employee of employees) {
    var row = `<tr>
    <td>${employee.firstname}</td>
    <td>${employee.lastname}</td>
    <td>${employee.email}</td>
    <td>${employee.phone}</td>
    <td>
        <a href="#" onclick="edit(${employee.id})" class="botonEditar">Editar</a>
        <a href="#" onclick="remove(${employee.id})" class="botonEliminar">Eliminar</a>
    </td>
</tr>`
html = html + row;
}

//COMANDO PARA CARGAR DATOS EN LA TABLA
document.querySelector('.table > tbody').outerHTML = html

}

async function remove(id) {
    respuesta = confirm('¿Está seguro de eliminarlo?') //pide confirmación
    if (respuesta) { var url = URL_API + 'employees/' + id
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
            "email": document.getElementById('txtEmail').value,
            "firstname": document.getElementById('txtFirstname').value,
            "lastname": document.getElementById('txtLastname').value,
            "phone": document.getElementById('txtPhone').value
     }
     var id = document.getElementById('txtId').value
     if (id != '') {
         data.id = id
     }

    var url = URL_API + 'employees'
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
    var tecnico = employees.find(x => x.id == id) //trae la id del cliente de adentro del arreglo customers
    document.getElementById('txtId').value = tecnico.id
    document.getElementById('txtFirstname').value = tecnico.firstname
    document.getElementById('txtLastname').value = tecnico.lastname
    document.getElementById('txtPhone').value = tecnico.phone
    document.getElementById('txtEmail').value = tecnico.email
}

function clean() {
    document.getElementById('txtId').value = ''
    document.getElementById('txtFirstname').value = ''
    document.getElementById('txtLastname').value = ''
    document.getElementById('txtPhone').value = ''
    document.getElementById('txtEmail').value = ''
}