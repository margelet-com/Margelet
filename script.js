// Находим элементы на странице по их ID
const button = document.getElementById('myButton');
const title = document.getElementById('title');

// Добавляем слушатель события на клик по кнопке
button.addEventListener('click', () => {
    // Меняем текст и цвет заголовка
    if (title.textContent === 'Привет, мир!') {
        title.textContent = 'Вы нажали кнопку!';
        title.style.color = '#28a745'; // Зеленый цвет
    } else {
        title.textContent = 'Привет, мир!';
        title.style.color = '#333333'; // Исходный цвет
    }
});
