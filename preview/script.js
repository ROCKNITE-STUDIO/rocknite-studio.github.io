let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const dotsContainer = document.getElementById('dots');

// Générer les boutons ronds
slides.forEach((_, index) => {
    const button = document.createElement('button');
    button.onclick = () => showSlide(index);
    if (index === 0) button.classList.add('active');
    dotsContainer.appendChild(button);
});

const dots = document.querySelectorAll('.dots button');

function showSlide(index) {
    const slider = document.getElementById('slider');
    currentIndex = index;
    const offset = -currentIndex * 100;
    slider.style.transform = `translateX(${offset}%)`;
    updateDots();
}

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}
