/*======= Funcion Menu ========*/
const navMenu = document.getElementById('nav-menu'), 
      navToggle = document.getElementById('nav-toggle'), 
      navClose = document.getElementById('nav-close')
/* Funcion Mostrar Menu */
if (navToggle) { 
     navToggle.addEventListener('click', () => { 
          navMenu.classList.add('show-menu')})
}
/* Funcion Esconder Menu */
if (navClose) { 
     navClose.addEventListener('click', () => { 
          navMenu.classList.remove('show-menu')})
}
/*======= Remover Menu Movil ========*/
const navLink = document.querySelectorAll('.nav__link')
const linkAction = () => {
     const navMenu = document.getElementById('nav-menu')
     navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*======= Header Activo al Scroll ========*/
const bgHeader = () => {
     const header = document.getElementById('header')
     this.scrollY >= 50 ? header.classList.add('bg-header') 
                         : header.classList.remove('bg-header')
}
window.addEventListener('scroll', bgHeader)
/* ========== Carrusel ==========*/
document.addEventListener('DOMContentLoaded', function() {
     const track = document.getElementById('card-container'); // Cambiado a getElementById
     const items = track.getElementsByClassName('card'); // Obtener los elementos de tarjeta
     let currentIndex = 0;
 
     function updateSlidePosition() {
         const itemWidth = track.clientWidth / 3;
         track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
     }
 
     document.querySelector('.prev').addEventListener('click', () => {
         currentIndex = Math.max(0, currentIndex - 1);
         updateSlidePosition();
     });
 
     document.querySelector('.next').addEventListener('click', () => {
         currentIndex = Math.min(items.length - 3, currentIndex + 1); // Asegurarse de no ir más allá del último elemento visible
         updateSlidePosition();
     });
 
     updateSlidePosition();
 });
 /* ========== Mas y Menos informacion ==========*/
 const arrow = document.querySelector('.arrow');
    const contenidoOculto = document.querySelector('.contenido-oculto');

    arrow.addEventListener('click', () => {
        contenidoOculto.classList.toggle('mostrar'); 
        if (contenidoOculto.classList.contains('mostrar')) {
            arrow.textContent = 'Menos informacion'; 
        } else {
            arrow.textContent = 'Mas informacion';
        }
    });
