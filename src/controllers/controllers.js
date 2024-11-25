const controller = {};
var empleadorEmail;
var empleadorEmpresa;
var password;
var empresaName; 
var address;
var razonSocial;
var description;
var date;

var userEmail;
var userPassword;
var userName;
var userLastName;
var userBirthday;
var userAge;
var userAddress;
var phoneNumber;
var userRegisterDate;

var adminUser;
var adminPassword;


controller.index = (req, res) => {
    res.render('index', {});
}

// USER EMPLEADOR

controller.empleadorRegisterPage = (req, res) => {
    res.render('empleadorRegister', {
    });
}

controller.empleadorRegister = (req, res) => {
    const data = req.body;
    let existentUser = false;
    let successRegister = false;

    req.getConnection((err, conn) => {
        conn.query('SELECT correo FROM userEmpleador WHERE correo = ?', [data.email], (err, empleadorEmail) => {
            if(err){
                console.log(err);
            }

            if(empleadorEmail.length > 0){ // EXISTE EL CORREO EN LA BASE DE DATOS
                existentUser = true;
                res.render('empleadorRegister', {existentUser: existentUser});
            }
            else {
                successRegister = true;

                req.getConnection((err, conn) => { // NO EXISTE EL CORREO EN LA DB ENTONCES SE REGISTRA CORRECTAMENTE
                    conn.query('INSERT INTO userEmpleador (correo, contrasena, nombreEmpresa, domicilio, razonSocial, descripcion)  VALUES (?, ?, ?, ?, ?, ?)', 
                        [data.email, data.password, data.name, data.address, data.razonSocial, data.description], (err, users) => {
                            return res.render('empleadorLogin', {successRegister: successRegister});
                    });
                });
            }
        });
    });
}

controller.empleadorLoginPage = (req, res) => {
    res.render('empleadorLogin')
}

controller.empleadorLogin = (req, res) => {
    const data = req.body;
    let loginExitoso = false;
    let empleadorFound = false;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userEmpleador', (err, empleadorCredentials) => {
            for (var i = 0; i < empleadorCredentials.length; i++) {
                if (data.email == empleadorCredentials[i].correo && data.password == empleadorCredentials[i].contrasena) {
                    empleadorEmail = data.email;
                    empleadorEmpresa = empleadorCredentials;
                    loginExitoso = true;
                    empleadorFound = true;
                    break; // Salir del bucle una vez que se encuentra el empleador
                };
            };
            
            // Renderizar la vista después de que se completa el bucle
            if (empleadorFound) {
                res.redirect('/empleador-auth');
            } else {
                res.render('empleadorLogin', { loginExitoso: loginExitoso });
            }

        });
    });


}


controller.empleadorAuth = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM vacantes WHERE correo = ?', [empleadorEmail], (err, data) => {
            res.render('empleadorAuth', {data});
        });
    });

    req.getConnection((err, conn) => {
        conn.query('SELECT nombreEmpresa FROM userEmpleador WHERE correo = ?', [empleadorEmail],(err, empresa) => {
            empleadorEmpresa = empresa[0].nombreEmpresa;
        });
    });
}

controller.empleadorMyAccount = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userEmpleador WHERE correo = ?', [empleadorEmail], (err, accountInfo) => {

            if(err){
                console.log(err);
            }

            if(!accountInfo || !accountInfo[0]){
                console.log('Datos no encontrado');
            }

            password = accountInfo[0].contrasena;
            empresaName = accountInfo[0].nombreEmpresa;
            address= accountInfo[0].domicilio;
            razonSocial = accountInfo[0].razonSocial;
            description = accountInfo[0].descripcion;
            date = accountInfo[0].fechaRegistro;  
            res.render('empleadorMyAccount', {empleadorEmail, password, empresaName, address, razonSocial, description, date});
       });
    });
}

controller.empleadorUpdateAccount = (req, res) => {
    const data = req.body;
    console.log(data);

    req.getConnection((err, conn) => {
        conn.query('UPDATE userEmpleador SET correo = ?, contrasena = ?, nombreEmpresa = ?, domicilio = ?, razonSocial = ?, descripcion = ? WHERE correo = ?', 
        [data.email, data.password, data.empresaName, data.address, data.razonSocial, data.description, data.email], (err) => {
            console.log(err);
            res.redirect('/empleador-mi-perfil');
        });
    });
}
controller.empleadorDeleteAccount = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM userEmpleador WHERE correo = ?', [empleadorEmail], (err) => {
            res.redirect('/');
        });
    });
}

controller.empleadorInbox = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM postulaciones WHERE nombreEmpresa = ?', [empleadorEmpresa], (err, data) => {
            res.render('empleadorInbox', {data});
        });
    });
}

controller.empleadorDeleteInbox = (req, res) => {
    const inboxId = req.params.inboxId

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM postulaciones WHERE id = ?', [inboxId])
    });
}

controller.postJobPage = (req, res) => {
    res.render('postJob', {});
}

controller.postJob = async (req, res) => {
    const data = req.body;
    const file = req.files;

    try {
        if (!file || Object.keys(file).length === 0) { // Verificar si se envió algún archivo
            return res.status(400).json({ message: 'No se ha seleccionado ningún archivo.' });
        } else {
            const uploadedFile = file.multimedia; 

            const fileName = data.title + '_' + Date.now() + '.' + uploadedFile.name.split('.').pop();
            
            uploadedFile.mv('./src/public/uploads/' + fileName, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al mover el archivo.' });
                }
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO vacantes (titulo, salario, horario, requisitos, descripcion, correo, empresa, capacitacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [data.title, data.salary, data.schedule, data.requirements, data.description, empleadorEmail, empleadorEmpresa, fileName], (err) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ error: err });
                            } else {
                                res.redirect('/empleador-auth');
                            }
                    });
                });
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


controller.deleteJob = (req, res) => {
    const vacanteId = req.params.vacanteId

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM vacantes WHERE id = ?', [vacanteId])
    });
}

controller.updateJob = ((req, res) => {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('UPDATE vacantes SET titulo = ?, salario = ?, horario = ?, requisitos = ?, descripcion = ? WHERE id = ?', 
        [data.editedTitle, data.editedSalary, data.editedSchedule, data.editedRequirements, data.editedDescription, data.accountId], (err) => {
            console.log(err);
            res.redirect('/empleador-auth');
        });
    });
});

// USER NORMAL
controller.userRegisterPage = (req, res) => {
    res.render('userRegister', {
    });
}

controller.userRegister = (req, res) => {
    const data = req.body;
    let existentUser = false;
    let successRegister = false;

    req.getConnection((err, conn) => {
        conn.query('SELECT correo FROM userNormal WHERE correo = ?', [data.email], (err, userEmail) => {

            if(err){
                console.log(err);
            }

            if(userEmail.length > 0){ // EXISTE EL CORREO EN LA BASE DE DATOS
                existentUser = true;
                res.render('userRegister', {existentUser: existentUser});
            }
            else {
                successRegister = true
                req.getConnection((err, conn) => { // NO EXISTE EL CORREO EN LA DB ENTONCES SE REGISTRA CORRECTAMENTE
                    conn.query('INSERT INTO userNormal (correo, contrasena, nombre, apellidos, fechaNacimiento, edad, domicilio, numTelefono)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                        [data.email, data.password, data.name, data.lastName, data.birthday ,data.age, data.address, data.phoneNumber], (err, users) => {
                            console.log(err);
                            return res.render('userLogin', {successRegister: successRegister});
                    });
                });
            }
        });
    });
}

controller.userLoginPage = (req, res) => {
    res.render('userLogin')
}

controller.userLogin = (req, res) => {
    const data = req.body;
    let loginExitoso = false;
    let userFound = false;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT correo, contrasena FROM userNormal', (err, userCredentials) => {
            for (var i = 0; i < userCredentials.length; i++) {
                if (data.email == userCredentials[i].correo && data.password == userCredentials[i].contrasena) {
                    userEmail = data.email;
                    loginExitoso = true;
                    userFound = true;
                    break; // Salir del bucle una vez que se encuentra el usuario
                }
            }
            
            // Renderizar la vista después de que se completa el bucle
            if (userFound) {
                res.redirect('/usuario-auth');
            } else {
                res.render('userLogin', { loginExitoso: loginExitoso });
            }
        });
    });
}

controller.userAuth = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM vacantes',(err, data) => {
            res.render('userAuth', {data});
        });
    });

}

controller.userMyAccount = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userNormal WHERE correo = ?', [userEmail], (err, accountInfo) => {
            if(err){
                console.log(err);
            }

            if(!accountInfo || !accountInfo[0]){
                console.log('Datos no encontrado');
            }

            userPassword = accountInfo[0].contrasena;
            userName = accountInfo[0].nombre;
            userLastName= accountInfo[0].apellidos;
            userBirthday = accountInfo[0].fechaNacimiento;
            userAge = accountInfo[0].edad;
            userAddress = accountInfo[0].domicilio;  
            phoneNumber = accountInfo[0].numTelefono;   
            userRegisterDate = accountInfo[0].fechaRegistro;   

            res.render('userMyAccount', {userEmail, userPassword, userName, userLastName, userBirthday, userAge, userAddress, phoneNumber, userRegisterDate});
       });
    });
}

controller.userUpdateAccount = (req, res) => {
    const data = req.body;
    console.log(data);

    req.getConnection((err, conn) => {
        conn.query('UPDATE userNormal SET correo = ?, contrasena = ?, nombre = ?, apellidos = ?, fechaNacimiento = ?, edad = ?, domicilio = ?, numTelefono = ? WHERE correo = ?', 
        [data.email, data.password, data.userName, data.userLastName, data.userBirthday, data.userAge, data.userAddress, data.phoneNumber, data.email], (err) => {
            console.log(err);
            res.redirect('/usuario-mi-perfil');
        });
    });
}

controller.userApplies = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userPostulaciones WHERE correo = ?', [userEmail],(err, data) => {
            res.render('userApplies', {data});
        });
    });
}

controller.userApplyJob = (req, res) => {
    const vacanteId = req.params.vacanteId;
    const empresa = req.params.empresa;
    console.log(empresa);

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userNormal WHERE correo = ?', [userEmail], (err, userData)=> {
            req.getConnection((err, conn) => {
                conn.query('INSERT INTO postulaciones (titulo, nombre, apellidos, fechaNacimiento, edad, domicilio, numTelefono, correo, nombreEmpresa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [vacanteId, userData[0].nombre, userData[0].apellidos, userData[0].fechaNacimiento, userData[0].edad, userData[0].domicilio, userData[0].numTelefono, userEmail, empresa]);
            });
        });
    });

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM vacantes WHERE titulo = ?', [vacanteId], (err, data)=> {
            req.getConnection((err, conn) => {
                conn.query('INSERT INTO userPostulaciones (titulo, salario, horario, requisitos, descripcion, empresa, correo) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [vacanteId, data[0].salario, data[0].horario, data[0].requisitos, data[0].descripcion, data[0].empresa, userEmail]);
            });
        });
    });

}

controller.userDeleteApply = (req, res) => {
    const applyTitle = req.params.applyTitle
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM userPostulaciones WHERE titulo = ?', [applyTitle])
        res.redirect('/usuario-postulaciones');
    });

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM postulaciones WHERE titulo = ?', [applyTitle])
        res.redirect('/usuario-postulaciones');
    });
}

// USER ADMIN
controller.adminLoginPage = (req, res) => {
    res.render('adminLogin');
}

controller.adminLogin = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT usuario, contrasena FROM useradministrador', (err, userCredentials) => {
            for(var i = 0; i < userCredentials.length; i++){
                if(data.user == userCredentials[i].usuario && data.password == userCredentials[i].contrasena){
                    console.log('exitoso');
                    adminUser = data.user;
                    res.redirect('/admin-auth');
                }
                else console.log('no es');
            }
        });
    });
}

controller.adminAuth = (req, res) => {
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userNormal', (err, data) => {
            res.render('adminAuth', {data});
        });
    });
}

controller.adminDeleteUser = (req, res) => {
    const cuentaId = req.params.cuentaId

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM userNormal WHERE id = ?', [cuentaId])
        res.redirect('/admin-auth');
    });
}

controller.adminEditUser = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE userNormal SET correo = ?, contrasena = ?, nombre = ?, apellidos = ?, fechaNacimiento = ?, edad = ?, domicilio = ?, numTelefono = ? WHERE id = ?', 
        [data.editedEmail, data.editedPassword, data.editedName, data.editedLastname, data.editedBirthDay, data.editedAge, data.editedAddress, data.editedPhoneNumber, data.accountId], (err) => {
            res.redirect('/admin-auth');
        });
    });
}

controller.adminAuthEmpleadores = (req, res) => {
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM userEmpleador', (err, data) => {
            res.render('adminAuthEmpleadores', {data});
        });
    });
}

controller.adminDeleteEmpleador = (req, res) => {
    const cuentaId = req.params.cuentaId
    console.log(cuentaId);
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM userEmpleador WHERE id = ?', [cuentaId])
        res.redirect('/admin-auth-empleadores');
    });
}

controller.adminEditEmpleador = (req, res) => {
    const data = req.body;
    console.log(data);

    req.getConnection((err, conn) => {
        conn.query('UPDATE userEmpleador SET correo = ?, contrasena = ?, nombreEmpresa = ?, domicilio = ?, razonSocial = ?, descripcion = ? WHERE id = ?', 
        [data.editedEmail, data.editedPassword, data.editedName, data.editedAddress, data.editedRazonSocial, data.editedDescription, data.accountId], (err) => {
            res.redirect('/admin-auth-empleadores');
        });
    });
}

module.exports = controller;