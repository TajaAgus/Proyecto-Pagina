document.addEventListener("DOMContentLoaded", search);
let works = []

function init() {
    search()
}

function add() {
    clean()
    openForm()
    customerEmployeeRequest()
}

function openForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale opened")
    body.setAttribute("onclick", "closeList()")
}
function closeForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale")
    window.location.reload()
}


//Busca todos los trabajos y los muestra
async function search () {
    let url = URL_API + 'works'
    let response = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    works = await response.json() 

    let html = ''

    for (work of works) {
        let date = work.date
        let row = `<tr>
        <td>${work.employee}</td>
        <td>${work.customer}</td>
        <td>${transformDateToShow(date)}</td>
        <td>${work.address}</td>
        <td>${work.phone}</td>
        <td>${work.email}</td>
        <td>
            <a href="#" onclick="edit(${work.id})" class="botonEditar">Editar</a>
            <a href="#" onclick="remove(${work.id})" class="botonEliminar">Eliminar</a>
        </td>
    </tr>`
        html = html + row  
    }

document.querySelector('.table > tbody').outerHTML = html
}

//Guargar tanto al agregar como al editar
async function save() {
    let data = {
        "employee_id": employeeId,
        "customer_id": customerId,
        "date": document.getElementById('txtDate').value,
        "address": document.getElementById('txtAddress').value
    }
    
    var id = document.getElementById('txtId').value
     if (id != '') {
         data.id = id
     }

    let date = `${data.date}`
    date = date.replace('T', ' ')
    data.date = date

    if (checkData(data)) {
        let url = URL_API + 'works'  
            await fetch(url, {
            "method": 'POST',
            "body": JSON.stringify(data),
            "headers": {
                "Content-Type": 'application/json'
            }
        })
        window.location.reload()
    }
}

//Eliminar
async function remove(id) {
    respuesta = confirm('¿Está seguro de eliminarlo?') 
    if (respuesta) { let url = URL_API + 'works/' + id
        await fetch(url, {
        "method": 'DELETE',
        "headers": {
            "Content-Type": 'application/json'
         }
        })
    }
    window.location.reload(); 
}

//Editar
async function edit(id) {
    openForm()
    await customerEmployeeRequest()
    let work = works.find(x => x.id == id) //trae el trabajo con la id que le pasamos
    document.getElementById('txtId').value = work.id
    document.getElementById('txtCustomer').value = work.customer
    document.getElementById('txtEmployee').value = work.employee
    document.getElementById('txtDate').value = transformDateForJS(transformDateToShow(work.date))
    document.getElementById('txtAddress').value = work.address
    idFromCustomer()
    idFromEmployee()
}

//Chequea la info del formulario
function checkData (data) {
    let dataChecked
    let text = "Campos erroneos o vacios: "

    let dataChecked1 = data.employee_id ? true : false
    dataChecked1 ? true : text += "empleado "
    let dataChecked2 = data.customer_id ? true : false 
    dataChecked2 ? true : text += "cliente "
    let dataChecked3 = data.date ? true : false
    dataChecked3 ? true : text += "fecha "
    let dataChecked4 = data.address ? true : false 
    dataChecked4 ? true : text += "dirección"

    if (dataChecked1 && dataChecked2 && dataChecked3 && dataChecked4) dataChecked = true
    else dataChecked = false

    if (dataChecked) return true 
    else return false, alert(text) 
}

//Limpia formulario
function clean() {
    document.getElementById('txtId').value = ''
    document.getElementById('txtCustomer').value = ''
    document.getElementById('txtEmployee').value = ''
    document.getElementById('txtDate').value = ''
    document.getElementById('txtAddress').value = ''
}

//Transfroma el formato de fecha para mostrarlo
function transformDateToShow (date) {
    date = date.replace('Jan', '01')
    date = date.replace('Feb', '02')
    date = date.replace('Mar', '03')
    date = date.replace('Apr', '04')
    date = date.replace('May', '05')
    date = date.replace('Jun', '06')
    date = date.replace('Jul', '07')
    date = date.replace('Aug', '08')
    date = date.replace('Sep', '09')
    date = date.replace('Oct', '10')
    date = date.replace('Nov', '11')
    date = date.replace('Dec', '12')
    date = date.replace(/[A-Za-z]/g, "")
    date = date.replace(",", "")
    date = date.replace(" ", "")
    date = date.slice(0, -4) + ""
        return date
}

//Transfroma el formato de fecha para que lo entienda Java Script
function transformDateForJS (date) {

    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + 1);
    } 

    date = date.replace(/ /g, "-")
    date = date.replaceAt(10, "T")
    year = date.substring(6, 10)
    day = date.substring(0, 2)
    date = date.replace(date.substring(6,10), day)
    date = date.replace(date.substring(0,2), year)
        return date
}