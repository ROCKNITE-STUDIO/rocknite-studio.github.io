let sliderData = [];
let currentIndex = 0;

async function loadSliderData() {
    try {
        const response = await fetch('slider.json');
        sliderData = await response.json();
        createSliderImages();
        createNavButtons();
        updateSlider(true);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

function createSliderImages() {
    const track = document.querySelector('.slider-track');
    sliderData.forEach((slide, index) => {
        const img = document.createElement('img');
        img.src = slide.imageUrl;
        img.alt = `Slide ${index + 1}`;
        img.classList.add('slider-image');
        if (index !== 0) {
            img.classList.add('slide-right');
        }
        track.appendChild(img);
    });
}

function createNavButtons() {
    const nav = document.querySelector('.slider-nav');
    sliderData.forEach((_, index) => {
        const button = document.createElement('button');
        button.textContent = index + 1;
        button.addEventListener('click', () => goToSlide(index));
        nav.appendChild(button);
    });
}

function updateSlider(isInitial = false) {
    const images = document.querySelectorAll('.slider-image');
    const content = document.querySelector('.slider-content');
    
    content.classList.add('fade-out');
    
    images.forEach((img, index) => {
        if (index === currentIndex) {
            img.className = 'slider-image slide-center';
        } else if (index < currentIndex) {
            img.className = 'slider-image slide-left';
        } else {
            img.className = 'slider-image slide-right';
        }
    });

    const currentSlide = sliderData[currentIndex];
    
    setTimeout(() => {
        document.querySelector('.slider-title').textContent = currentSlide.title;
        document.querySelector('.slider-description').textContent = currentSlide.description;
        document.querySelector('.slider-button').onclick = () => window.open(currentSlide.trailerUrl, '_blank');
        content.classList.remove('fade-out');
        updateNavButtons();
    }, 250);
}

function updateNavButtons() {
    const buttons = document.querySelectorAll('.slider-nav button');
    buttons.forEach((button, index) => {
        if (index === currentIndex) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function goToSlide(index) {
    if (index !== currentIndex) {
        currentIndex = index;
        updateSlider();
    }
}

document.addEventListener('DOMContentLoaded', loadSliderData);
