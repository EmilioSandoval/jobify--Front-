const express = require('express');
const router = express.Router();
const multer = require('multer');

const controllers = require('../controllers/controllers');
const controller = require('../controllers/controllers');

router.get('/', controllers.index);

// EMPLEADOR

router.get('/empleador-registro', controllers.empleadorRegisterPage);
router.post('/empleador-register', controllers.empleadorRegister);

router.get('/empleador-iniciar-sesion', controllers.empleadorLoginPage);
router.post('/empleador-login', controllers.empleadorLogin);

router.get('/empleador-auth', controllers.empleadorAuth);

router.get('/empleador-buzon', controllers.empleadorInbox);
router.delete('/empleador-delete-inbox:inboxId', controllers.empleadorDeleteInbox);

router.get('/empleador-mi-perfil', controllers.empleadorMyAccount);

router.post('/empleador-actualizar-informacion', controllers.empleadorUpdateAccount);

router.post('/empleador-account-delete', controllers.empleadorDeleteAccount);

router.get('/publicar-vacante', controllers.postJobPage);
router.post('/post-job', controllers.postJob);
router.post('/update-job', controllers.updateJob);
router.delete('/delete-vacante:vacanteId', controllers.deleteJob);

// USUARIO

router.get('/usuario-registro', controllers.userRegisterPage);
router.post('/usuario-register', controllers.userRegister);

router.get('/usuario-iniciar-sesion', controllers.userLoginPage);
router.post('/user-login', controllers.userLogin);
router.get('/usuario-auth', controllers.userAuth);
router.get('/usuario-mi-perfil', controllers.userMyAccount);
router.post('/usuario-actualizar-informacion', controllers.userUpdateAccount);

router.post('/usuario-aplicar-vacante:vacanteId/:empresa', controllers.userApplyJob);
router.get('/usuario-postulaciones', controllers.userApplies);
router.delete('/user-delete-apply:applyTitle', controllers.userDeleteApply);

// ADMIN 

router.get('/admin-iniciar-sesion', controllers.adminLoginPage);
router.post('/admin-login', controllers.adminLogin);

router.get('/admin-auth', controllers.adminAuth);
router.delete('/admin-delete-user:cuentaId', controller.adminDeleteUser);
router.post('/admin-edit-user', controller.adminEditUser);

router.get('/admin-auth-empleadores', controllers.adminAuthEmpleadores);
router.delete('/admin-delete-empleador:cuentaId', controller.adminDeleteEmpleador);
router.post('/admin-edit-empleador', controller.adminEditEmpleador);

module.exports = router;