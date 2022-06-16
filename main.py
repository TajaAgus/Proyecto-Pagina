from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-type'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'system'
mysql = MySQL(app)


# CLIENTES

@app.route('/api/customers')
@cross_origin()
def getALlCustomers():
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, firstname, lastname, phone, email, address FROM customers')
    data = cur.fetchall()
    result = []
    for row in data:
        content = {'id': row[0], 'firstname': row[1], 'lastname': row[2], 'phone': row[3], 'email': row[4], 'address': row[5]}
        result.append(content)
    return jsonify(result)


# @app.route('/api/customers/<int:id>')
# @cross_origin()
# def getCustomer(id):
#     cur = mysql.connection.cursor()
#     cur.execute('SELECT id, firstname, lastname, phone, email, address FROM customers WHERE id = ' + str(id))
#     data = cur.fetchall()
#     for row in data:
#         content = {'id': row[0], 'firstname': row[1], 'lastname': row[2], 'phone': row[3], 'email': row[4],
#                    'address': row[5]}
#     return jsonify(content)


@app.route('/api/customers', methods=['POST'])
@cross_origin()
def createUpdateCustomer():
    if 'id' in request.json:
        updateCustomer()
    else:
        createCustomer()
    return "ok"


def createCustomer():
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO `customers` (`id`, `firstname`, `lastname`, `email`, `phone`, `address`) VALUES (NULL, %s, %s, %s, %s, %s);",
                (request.json['firstname'], request.json['lastname'], request.json['email'], request.json['phone'], request.json['address']))
    mysql.connection.commit()
    return 'Cliente guardado'


def updateCustomer():
    cur = mysql.connection.cursor()
    cur.execute("UPDATE `customers` SET `firstname` = %s, `lastname` = %s, `email` = %s, `phone` = %s, `address` = %s WHERE `customers`.`id` = %s;",
                (request.json['firstname'], request.json['lastname'], request.json['email'], request.json['phone'], request.json['address'], request.json['id']))
    mysql.connection.commit()
    return 'Cliente actualizado'


@app.route('/api/customers/<int:id>', methods=['DELETE'])
def removeCustomer(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM customers WHERE `customers`.`id` = " + str(id) + ";")
    mysql.connection.commit()
    return 'Cliente eliminado'


# TECNICOS


@app.route('/api/employees')
@cross_origin()
def getALlEmployees():
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, firstname, lastname, phone, email FROM employees')
    data = cur.fetchall()
    result = []
    for row in data:
        content = {'id': row[0], 'firstname': row[1], 'lastname': row[2], 'phone': row[3], 'email': row[4]}
        result.append(content)
    return jsonify(result)


# @app.route('/api/employees/<int:id>')
# @cross_origin()
# def getTecnico(id):
#     cur = mysql.connection.cursor()
#     cur.execute('SELECT id, firstname, lastname, phone, email FROM employees WHERE id = ' + str(id))
#     data = cur.fetchall()
#     for row in data:
#         content = {'id': row[0], 'firstname': row[1], 'lastname': row[2], 'phone': row[3], 'email': row[4]}
#     return jsonify(content)


@app.route('/api/employees', methods=['POST'])
@cross_origin()
def createUpdateEmployee():
    if 'id' in request.json:
        updateEmployee()
    else:
        createEmployee()
    return "ok"


def createEmployee():
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO `employees` (`id`, `firstname`, `lastname`, `email`, `phone`) VALUES (NULL, %s, %s, %s, %s);",
                (request.json['firstname'], request.json['lastname'], request.json['email'], request.json['phone']))
    mysql.connection.commit()
    return 'Cliente guardado'


def updateEmployee():
    cur = mysql.connection.cursor()
    cur.execute("UPDATE `employees` SET `firstname` = %s, `lastname` = %s, `email` = %s, `phone` = %s WHERE `employees`.`id` = %s;",
                (request.json['firstname'], request.json['lastname'], request.json['email'], request.json['phone'], request.json['id']))
    mysql.connection.commit()
    return 'Cliente actualizado'


@app.route('/api/employees/<int:id>', methods=['DELETE'])
def removeEmployee(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM employees WHERE `employees`.`id` = " + str(id) + ";")
    mysql.connection.commit()
    return 'Cliente eliminado'


# TRABAJOS
@app.route('/api/works')
@cross_origin()
def getALlWorks():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.id, CONCAT(t.firstname, ' ', t.lastname) as 'employee', concat(c.firstname, ' ', c.lastname) as 'customer', u.date, u.address, c.phone, c.email FROM works u INNER JOIN employees t ON u.employee_id = t.id inner join customers c ON u.customer_id = c.id;")
    data = cur.fetchall()
    result = []
    for row in data:
        content = {'id': row[0], 'employee': row[1], 'customer': row[2], 'date': row[3], 'address': row[4], 'phone': row[5], 'email': row[6]}
        result.append(content)

    return jsonify(result)


@app.route('/api/works/customer')
@cross_origin()
def getCutomers():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, CONCAT(firstname, ' ', lastname) AS 'name' FROM customers;")
    data = cur.fetchall()
    result = []
    for row in data:
        content = {'id': row[0], 'name': row[1]}
        result.append(content)

    return jsonify(result)


@app.route('/api/works/employee')
@cross_origin()
def getEmployees():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, CONCAT(firstname, ' ', lastname) AS 'name' FROM employees;")
    data = cur.fetchall()
    result = []
    for row in data:
        content = {'id': row[0], 'name': row[1]}
        result.append(content)

    return jsonify(result)

# @app.route('/api/works/<int:id>')
# @cross_origin()
# def getWork(id):
#     cur = mysql.connection.cursor()
#     cur.execute('SELECT id, date, place, customer_id, employee_id FROM works WHERE id = ' + str(id))
#     data = cur.fetchall()
#     for row in data:
#         content = {'id': row[0], 'firstname': row[1], 'lastname': row[2], 'phone': row[3], 'email': row[4]}
#     return jsonify(content)


@app.route('/api/works', methods=['POST'])
@cross_origin()
def createUpdateWork():
    if 'id' in request.json:
        updateWork()
    else:
        createWork()
    return "OK"


def createWork():
    print(request.json)
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO `works` (`id`, `date`, `address`, `customer_id`, `employee_id`) VALUES (NULL, %s, %s, %s, %s);",
                (request.json['date'], request.json['address'], request.json['customer_id'], request.json['employee_id']))
    mysql.connection.commit()
    return 'Word saved'


def updateWork():
    cur = mysql.connection.cursor()
    cur.execute("UPDATE `works` SET `date` = %s, `address` = %s, `customer_id` = %s, `employee_id` = %s WHERE `works`.`id` = %s;",
                (request.json['date'], request.json['address'], request.json['customer_id'], request.json['employee_id'], request.json['id']))
    mysql.connection.commit()
    return 'Work updated'


@app.route('/api/works/<int:id>', methods=['DELETE'])
def removeWork(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM works WHERE `works`.`id` = " + str(id) + ";")
    mysql.connection.commit()
    return 'Work deleted'


if __name__ == '__main__':
    app.run(None, 3000, True)