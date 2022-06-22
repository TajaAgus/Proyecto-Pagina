const URL_API = 'http://localhost:3000/api/'

let customerObjects
let employeeObjects
let customersNames = []
let employeesNames = []
let customerId
let employeeId

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

//Trae un array con los objetos de clientes y empleados. Y crea array con los nombres.
async function customerEmployeeRequest(){
    let url = URL_API + 'works/customer'
    let response = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    customerObjects = await response.json()

    for (let i = 0; i < customerObjects.length; i++) {
        customersNames.push(customerObjects[i].name)
    }

    url = URL_API + 'works/employee'
    response = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    employeeObjects = await response.json()
    
    for (let i = 0; i < employeeObjects.length; i++) {
        employeesNames.push(employeeObjects[i].name)
    }
}

function customersList(){
    searchWapperEmployees.classList.remove("active")

    inputBoxCustomers.onkeyup = (e) =>{
        if (inputBoxCustomers.value != ""){
        let userData = e.target.value
        
        let finalArray = filterAndMakeHTMLList(userData, true)

        searchWapperCustomers.classList.add("active") //Activa elemento css para que muestre la lista

        showCustomers(finalArray)

        let allList = boxCustomers.querySelectorAll("li")

        for (let i = 0; i < allList.length; i++) { // AL hacer click en un elemento lista llama a select()
            allList[i].setAttribute("onclick", "selectCustomer(this)")
        }

        if (finalArray.length == 0) searchWapperCustomers.classList.remove("active")

        } else deployCompleteCustomersList()
    }
    if (inputBoxCustomers.value == "") deployCompleteCustomersList()
}

function employeesList(){
    searchWapperCustomers.classList.remove("active")

    inputBoxEmployees.onkeyup = (e) =>{
        if (inputBoxEmployees.value != ""){
        let userData = e.target.value
        
        let finalArray = filterAndMakeHTMLList(userData, false)

        searchWapperEmployees.classList.add("active") //Activa elemento css para que muestre la lista

        showEmployees(finalArray)

        let allList = boxEmployees.querySelectorAll("li")
        for (let i = 0; i < allList.length; i++) { // AL hacer click en un elemento lista llama a select()
            allList[i].setAttribute("onclick", "selectEmployee(this)")
        }

        if (finalArray.length == 0) searchWapperEmployees.classList.remove("active")

        } else deployCompleteEmployeesList()
    }
    if (inputBoxEmployees.value == "") deployCompleteEmployeesList()
}

function filterAndMakeHTMLList(userData, flag){
    let fullName
    if (flag) fullName = customersNames
    else fullName = employeesNames

    let firstNamesArray = []
    let lastNamesArray = []
    let finalArray = []
    
    firstNamesArray = fullName.filter((data)=>{ //Filtra los nombres por la letra que comienzan
        return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
    })
    lastNamesArray = fullName.filter((data)=>{ //Filtra los apellidos por la letra que comienzan 
        return data.split(" ")[1].toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
    })
    firstNamesArray = firstNamesArray.map((data)=>{ //Crea el lista html con los nombres
        return data = '<li>' + data + '</li>'
    })
    lastNamesArray = lastNamesArray.map((data)=>{ //Crea el lista html con los Apellidos
        return data = '<li>' + data + '</li>'
    })

    finalArray = Array.from(new Set(firstNamesArray.concat(lastNamesArray))) // Esto junta y permite no repetir nombres y apellidos de una persona que empiezan con la misma letra.
        return finalArray
}


//Despliega y cierra lista completa.
function deployCompleteCustomersList(){
    if (inputBoxCustomers.value == "") {
        searchWapperEmployees.classList.remove("active")
        searchWapperCustomers.classList.add("active")

        let isFocusCustomer = (inputBoxCustomers == document.activeElement)
        if (!isFocusCustomer && searchWapperCustomers.classList.contains("active")) {
            searchWapperCustomers.classList.remove("active")
        }
        if (isFocusCustomer){
            let list = customersNames
            list = list.map((data)=>{
                return data = '<li>' + data + '</li>'
            })
            showCustomers(list)

            let allList = boxCustomers.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) {
                allList[i].setAttribute("onclick", "selectCustomer(this)")
            }      
        }
    }
}

function deployCompleteEmployeesList(){
    if (inputBoxEmployees.value == "") {
        searchWapperCustomers.classList.remove("active")
        searchWapperEmployees.classList.add("active")

        let isFocusEmployee = (inputBoxEmployees == document.activeElement)
        if (!isFocusEmployee && searchWapperEmployees.classList.contains("active")) {
            searchWapperEmployees.classList.remove("active")
        }

        if (isFocusEmployee) {
            let list = employeesNames
            list = list.map((data)=>{
                return data = '<li>' + data + '</li>'
            })
            showEmployees(list)

            let allList = boxEmployees.querySelectorAll("li")
            for (let i = 0; i < allList.length; i++) {
                allList[i].setAttribute("onclick", "selectEmployee(this)")
            }
        }
    }
}

function closeList(){
    let isFocusCustomer = (inputBoxCustomers == document.activeElement)
    let isFocusEmployee = (inputBoxEmployees == document.activeElement)
    if (!isFocusCustomer && searchWapperCustomers.classList.contains("active")) {
        searchWapperCustomers.classList.remove("active")
    }
    if (!isFocusEmployee && searchWapperEmployees.classList.contains("active")) {
        searchWapperEmployees.classList.remove("active")
    }
}

function showCustomers(list){
    list = list.join('')
    boxCustomers.innerHTML = list
}

function showEmployees(list){
    list = list.join('')
    boxEmployees.innerHTML = list
}

//Da el valor del elemento seleccionado de la lista al input.
function selectCustomer(element){
    let selectUserData = element.textContent
    inputBoxCustomers.value = selectUserData
    searchWapperCustomers.classList.remove("active")
    idFromCustomer()
}

function selectEmployee(element){
    let selectUserData = element.textContent
    inputBoxEmployees.value = selectUserData
    searchWapperEmployees.classList.remove("active")
    idFromEmployee()
}

//Guarda id de la persona seleccionada. 
function idFromCustomer() {
    let customerName = inputBoxCustomers.value
    for (let i = 0; i < customerObjects.length; i++) {
        if (customerName == customerObjects[i].name) {
        customerId  = customerObjects[i].id
        break
        }
        else customerId = null 
    }
}

function idFromEmployee() {
    let employeeName = inputBoxEmployees.value
    for (let i = 0; i < employeeObjects.length; i++) {
        if (employeeName == employeeObjects[i].name) {
        employeeId  = employeeObjects[i].id
        break
        } 
        else employeeId = null 
    }
}