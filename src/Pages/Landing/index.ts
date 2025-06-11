import '../../styles/global/main.css';
import '../../styles/pages/landing.css';
import { setupNavigationButtons, addButtonHoverEffects } from '../../utils/navigation';

// Funcionalidad específica de la página landing
document.addEventListener('DOMContentLoaded', () => {
  console.log('Landing page loaded successfully');
  
  // Configurar las imágenes con las rutas correctas de webpack
  const logoImg = document.querySelector('.LogoImage') as HTMLImageElement;
  if (logoImg) {
    logoImg.src = '/assets/imgs/logo/LogoHiFiacNoBackground.png';
    console.log('Logo image src set to:', logoImg.src);
  }

  // Configurar los círculos decorativos
  const circles = document.querySelectorAll('.CircleSmall, .CircleBig, .CircleMedium') as NodeListOf<HTMLImageElement>;
  circles.forEach(circle => {
    circle.src = '/assets/imgs/logo/Circulos sin fondo.png';
  });

  // Configurar los iconos de las cards
  const icons = document.querySelectorAll('.Card .Icon') as NodeListOf<HTMLImageElement>;
  if (icons[0]) icons[0].src = '/assets/icons/mensaje-04.png';
  if (icons[1]) icons[1].src = '/assets/icons/corazon-03.png';
  if (icons[2]) icons[2].src = '/assets/icons/user flecha-02.png';
  
  // Configurar navegación automática
  setupNavigationButtons();
  
  // Agregar efectos visuales a los botones
  addButtonHoverEffects('.CardBotton');
  
  // Animación de entrada del logo
  if (logoImg) {
    logoImg.style.opacity = '0';
    logoImg.style.transform = 'scale(0.8)';
    logoImg.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
      logoImg.style.opacity = '1';
      logoImg.style.transform = 'scale(1)';
    }, 200);
  }
}); 