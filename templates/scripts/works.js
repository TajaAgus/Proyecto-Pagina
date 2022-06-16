document.addEventListener("DOMContentLoaded", search);
const URL_API = 'http://localhost:3000/api/'

let works = []

function init() {
    search()
}

function add() {
    clean()
    openForm()
    requestEmployeesCustomers()
}

function openForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale opened")
}
function closeForm() {
    htmlAgregar = document.getElementById("btnAgregar")
    htmlAgregar.setAttribute("class", "modale")
    body.removeAttribute("onclick")
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
let forEdit = false
function edit(id) {
    openForm()
    let work = works.find(x => x.id == id) //trae el trabajo con la id que le pasamos
    document.getElementById('txtId').value = work.id
    document.getElementById('txtCustomer').value = work.customer
    document.getElementById('txtEmployee').value = work.employee
    document.getElementById('txtDate').value = transformDateForJS(transformDateToShow(work.date))
    document.getElementById('txtAddress').value = work.address
    forEdit = true
    requestEmployeesCustomers()
}

//Limpia formulario
function clean() {
    document.getElementById('txtId').value = ''
    document.getElementById('txtCustomer').value = ''
    document.getElementById('txtEmployee').value = ''
    document.getElementById('txtDate').value = ''
    document.getElementById('txtAddress').value = ''
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
    if (dataChecked1 && dataChecked2 && dataChecked3 && dataChecked4) {
        dataChecked = true
    } else {dataChecked = false}
    if (dataChecked) {return true} else {return false, alert(text)} 
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



/////////////////////Buscador por cliente y tecnico/////////////////////////////

//Divs de los buscadores
const searchWapperCustomers = document.querySelector(".search-input-customers")
const searchWapperEmployees = document.querySelector(".search-input-employees")

//Elementos del buscador de clientes
const inputBoxCustomers = searchWapperCustomers.querySelector(".customer-input")
const boxCustomers = searchWapperCustomers.querySelector(".box-customers")

//Elementos del buscador de empleados
const inputBoxEmployees = searchWapperEmployees.querySelector(".employee-input")
const boxEmployees = searchWapperEmployees.querySelector(".box-employees")

const body = document.querySelector("body")

//Se llama a esta función cuando se toca el boton de agregar trabajo o editar
async function requestEmployeesCustomers() {
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
        idFromPerson(customers, employees)
    }

    inputBoxes(customers, employees, employeesNames, customersNames)

    body.setAttribute("onclick", "deployCompleteList(customers, employees, employeesNames, customersNames)")
}


function inputBoxes (customers, employees, employeesNames, customersNames)  {
    //Input de customers
    inputBoxCustomers.onkeyup = (e) =>{
        let userData = e.target.value
        let emptyArray = []
        let emptyArray2 = []
        if(userData){
            emptyArray = customersNames.filter((data)=>{ //Filtra los nombres por la letra que comienzan
                    return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            emptyArray2 = customersNames.filter((data)=>{ //Filtra los apellidos por la letra que comienzan 
                    return data.split(" ")[1].toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            emptyArray = emptyArray.map((data)=>{ //Crea el lista html con los nombres
                return data = '<li>' + data + '</li>'
            })
            emptyArray2 = emptyArray2.map((data)=>{ //Crea el lista html con los nombres
                return data = '<li>' + data + '</li>'
            })
            emptyArray = emptyArray.concat(emptyArray2)

            searchWapperCustomers.classList.add("active") //Activa elemento css para que muestre la lista

            idFromPerson(customers, null)

            show(emptyArray, true)

            let allList = boxCustomers.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) { // AL hacer click en un elemento lista llama a select()
                allList[i].setAttribute("onclick", "select(this, customers, null)")
            }

            if (emptyArray.length == 0) {
                searchWapperCustomers.classList.remove("active")
            }

        } else if (inputBoxCustomers.value == "") {
            deployCompleteList(customers, null, null, customersNames)
        }
    }

    //Input de empleados
    inputBoxEmployees.onkeyup = (e) =>{
        let userData = e.target.value
        let emptyArray = []
        let emptyArray2 = []
        if(userData){
            emptyArray = employeesNames.filter((data)=>{ //Filtra los nombres por la letra que comienzan
                    return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            emptyArray2 = employeesNames.filter((data)=>{ //Filtra los apellidos por la letra que comienzan 
                    return data.split(" ")[1].toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            
            emptyArray = emptyArray.map((data)=>{ //Crea el lista html con los nombres
                return data = '<li>' + data + '</li>'
            })
            emptyArray2 = emptyArray2.map((data)=>{ //Crea el lista html con los nombres
                return data = '<li>' + data + '</li>'
            })
            emptyArray = Array.from(new Set(emptyArray.concat(emptyArray2)))

            searchWapperEmployees.classList.add("active") //Activa elemento css para que muestre la lista

            idFromPerson(null, employees)

            show(emptyArray, false)

            let allList = boxEmployees.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) { // AL hacer click en un elemento lista llama a select()
                allList[i].setAttribute("onclick", "select(this, null, employees)")
            }


            if (emptyArray.length == 0) {
                searchWapperEmployees.classList.remove("active")
            }

        }else if (inputBoxEmployees.value == "") {
            deployCompleteList(null, employees, employeesNames, null)
        }
    }
}


//Desplega la lista completa al hacer click en los input y la saca al hacer click en otro lado
function deployCompleteList (customers, employees, employeesNames, customersNames) {
    let isFocusCustomer = (inputBoxCustomers == document.activeElement)
    let isFocusEmployee = (inputBoxEmployees == document.activeElement)
    let emptyArray = []
    if (!isFocusCustomer && searchWapperCustomers.classList.contains("active")) {
        searchWapperCustomers.classList.remove("active")
    }
    if (!isFocusEmployee && searchWapperEmployees.classList.contains("active")) {
        searchWapperEmployees.classList.remove("active")
    }
    if (isFocusCustomer && inputBoxEmployees.value == "") {
        searchWapperCustomers.classList.add("active")
        emptyArray = customersNames
        emptyArray = emptyArray.map((data)=>{
            return data = '<li>' + data + '</li>'
        })
        show(emptyArray, true)

        let allList = boxCustomers.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) {
                allList[i].setAttribute("onclick", "select(this, customers, null)")
            }
    }
    if (isFocusEmployee && inputBoxEmployees.value == "") {
        searchWapperEmployees.classList.add("active")
        emptyArray = employeesNames
        emptyArray = emptyArray.map((data)=>{
            return data = '<li>' + data + '</li>'
        })

        show(emptyArray, false)

        let allList = boxEmployees.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) {
                allList[i].setAttribute("onclick", "select(this, null, employees)")
            }
    }          
}

//Muestra la lista en el html
function show(list, cusOrEmp){
    list = list.join('')
    if (cusOrEmp) {
        boxCustomers.innerHTML = list
    }
    if (!cusOrEmp) {
        boxEmployees.innerHTML = list
    }
}


//Da el valor del elemento seleccionado de la lista al input
function select(element, customers, employees){
    if (customers != null) {
        let selectUserData = element.textContent
        inputBoxCustomers.value = selectUserData
        searchWapperCustomers.classList.remove("active")
        idFromPerson(customers, null)
    }  
    if (employees != null) {
        let selectUserData = element.textContent
        inputBoxEmployees.value = selectUserData
        searchWapperEmployees.classList.remove("active")
        idFromPerson(null, employees)
    }
}

//Relaciona el Nombre con la id y guarda id para usarla en save()
let customerId
let employeeId
function idFromPerson(customers, employees) {
    if (customers != null) {
        let customerName = inputBoxCustomers.value
        for (let i = 0; i < customers.length; i++) {
            if (customerName == customers[i].name) {
            customerId  = customers[i].id
            break
        } else { customerId = null }
        }
    } 
    if (employees != null) {
        let employeeName = inputBoxEmployees.value
        for (let i = 0; i < employees.length; i++) {
            if (employeeName == employees[i].name) {
            employeeId  = employees[i].id
            break
        } else { employeeId = null }
        }
    }
}