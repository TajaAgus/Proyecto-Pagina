document.addEventListener("DOMContentLoaded", search);
const URL_API = 'http://localhost:3000/api/'

let works = []

function init() {
    search()
}

function add() {
    clean()
    openForm()
    inputSearchForSave()
}
function openForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale opened")
}
function closeForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale")
}



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
    console.log(data)

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


function edit(id) {
    openForm()
    let work = works.find(x => x.id == id) //trae el trabajo con la id que le pasamos
    document.getElementById('txtId').value = work.id
    document.getElementById('txtCustomer').value = work.customer
    document.getElementById('txtEmployee').value = work.employee
    document.getElementById('txtDate').value = transformDateForJS(transformDateToShow(work.date))
    document.getElementById('txtAddress').value = work.address
    let forEdit = true
    inputSearchForSave(forEdit)
}

function clean() {
    document.getElementById('txtId').value = ''
    document.getElementById('txtCustomer').value = ''
    document.getElementById('txtEmployee').value = ''
    document.getElementById('txtDate').value = ''
    document.getElementById('txtAddress').value = ''
}

function checkData (data) {
    let dataChecked
    let text = "Campos erroneos o  vacios: "
    let dataChecked1 = data.employee_id ? true : false
    dataChecked1 ? true : text += "empleado "
    let dataChecked2 = data.customer_id ? true : false 
    dataChecked2 ? true : text += "cliente "
    let dataChecked3 = data.date ? true : false
    dataChecked3 ? true : text += "fecha "
    let dataChecked4 = data.address ? true : false 
    dataChecked4 ? true : text += "dirección"
    if (dataChecked1 && dataChecked2 && dataChecked3 && dataChecked4) {
        dataChecked = true
    } else {dataChecked = false}
    if (dataChecked) {return true} else {return false, alert(text)} 
}




/////////////////////buscador por cliente y tecnico/////////////////////////////

//Elementos de los buscadores
const searchWapperCustomers = document.querySelector(".search-input-customers")
const searchWapperEmployees = document.querySelector(".search-input-employees")

//Elementos del buscador de clientes
const inputBoxCustomers =  searchWapperCustomers.querySelector(".customer-input")
const boxCustomers = searchWapperCustomers.querySelector(".box-customers")

//Elementos del buscador de empleados
const inputBoxEmployees =  searchWapperEmployees.querySelector(".employee-input")
const boxEmployees = searchWapperEmployees.querySelector(".box-employees")


//Se llama a esta función cuando se toca el boton de agregar trabajo
async function inputSearchForSave(forEdit) {
    //Trae un array con los objetos de clientes
    async function searchCustomers() {
        let url = URL_API + 'works/customer'
        let response = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'
            }
        })
        customersObjects = await response.json()
        
            return customersObjects
    }

    //Crea un array solo para los nombres de los clientes
    customers = await searchCustomers()
    customersNames = []
    for (let i = 0; i < customers.length; i++) {
        customersNames.push(customers[i].name)
    }
    
    //Trae un array con los objetos de empleados
    async function searchEmployees() {
        let url = URL_API + 'works/employee'
        let response = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'
            }
        })
        employeesObjects = await response.json()
        
            return employeesObjects
    }
    
    //Crea un array solo para los nombres de los empleados
    employees = await searchEmployees()
    employeesNames = []
    for (let i = 0; i < employees.length; i++) {
        employeesNames.push(employees[i].name)
    }

    //Editar
    if (forEdit) {
        select(null, customers, employees)
    }
    
    //Input de customers
    inputBoxCustomers.onkeyup = (e) =>{
        let userData = e.target.value
        let emptyArray = []
        if(userData){
            emptyArray = customersNames.filter((data)=>{ //Filtra por los nombres por la letra que comienzan
                return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            emptyArray = emptyArray.map((data)=>{ //Crea el lista html con los nombres
                return data = '<li>' + data + '</li>'
            })
            searchWapperCustomers.classList.add("active") //Activa elemento css para que muestre la lista

            showCustomers(emptyArray)

            let allList = boxCustomers.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) { // AL hacer click en un elemento lista llama a select()
                allList[i].setAttribute("onclick", "select(this, customers, null)")
            }
        }else {
            searchWapperCustomers.classList.remove("active") 
        }
    }
    function showCustomers(list){ //Muestra la lista en el html
        list = list.join('')
        boxCustomers.innerHTML = list
    }

    //Input de empleados
    inputBoxEmployees.onkeyup = (e) =>{
        let userData = e.target.value
        let emptyArray = []
        if(userData){
            emptyArray = employeesNames.filter((data)=>{ //Filtra por los nombres por la letra que comienzan
                return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            emptyArray = emptyArray.map((data)=>{ //Crea el lista html con los nombres
                return data = '<li>' + data + '</li>'
            })
            searchWapperEmployees.classList.add("active") //Activa elemento css para que muestre la lista

            showEmployees(emptyArray)

            let allList = boxEmployees.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) { // AL hacer click en un elemento lista llama a select()
                allList[i].setAttribute("onclick", "select(this, null, employees)")
            }
        }else {
            searchWapperEmployees.classList.remove("active") 
        }
    }
    function showEmployees(list){ //Muestra la lista en el html
        list = list.join('')
        boxEmployees.innerHTML = list
    }
}
function select(element, customers, employees){ //Muestra y da el valor del elemento seleccionado en el input
    if (customers != null && element != null) {
        let selectUserData = element.textContent
        inputBoxCustomers.value = selectUserData
        searchWapperCustomers.classList.remove("active")
    }  
    if (employees != null && element != null) {
        let selectUserData = element.textContent
        inputBoxEmployees.value = selectUserData
        searchWapperEmployees.classList.remove("active")
    }
    idFromPerson(customers, employees)
}

let customerId
let employeeId
function idFromPerson(customers, employees) { //Relaciona el Nombre con la id y guarda id para usarla en save()
    console.log("se ejecuto") 
    if (customers != null) {
        let customerName = inputBoxCustomers.value
        for (let i = 0; i < customers.length; i++) {
            if (customerName == customers[i].name) {
            customerId  = customers[i].id
        } 
    }
    } 
    if (employees != null) {
        let employeeName = inputBoxEmployees.value
        for (let i = 0; i < employees.length; i++) {
            if (employeeName == employees[i].name) {
            employeeId  = employees[i].id
        }
    }
    }
}