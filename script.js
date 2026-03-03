// Функция переключения экранов
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if(screenId === 'screen-code') {
        setTimeout(() => document.querySelector('.code-input').focus(), 100);
    }
}

// Вход в само приложение (профиль)
function enterApp(email) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('screen-app').classList.add('active');
    document.getElementById('display-user-email').textContent = email || "Пользователь";
}

// Выход
function logout() {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('screen-app').classList.remove('active');
    goToScreen('screen-login');
}

// Регистрация
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];

    if (users.some(u => u.email === email)) {
        alert('Пользователь с такой почтой уже существует!');
    } else {
        users.push({ email, password });
        localStorage.setItem('socialNetworkUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', email);
        goToScreen('screen-code');
    }
});

// Вход
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', email);
        enterApp(email);
    } else {
        alert('Неверная почта или пароль');
    }
});

// Логика "Забыли пароль"
function openForgotScreen() {
    const loginEmail = document.getElementById('login-email').value;
    document.getElementById('forgot-email').value = loginEmail;
    goToScreen('screen-forgot');
}

document.getElementById('forgot-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];
    
    if (users.some(u => u.email === email)) {
        // Если аккаунт есть, имитируем отправку кода
        goToScreen('screen-code');
    } else {
        alert('На данную почту не зарегистрирован аккаунт');
    }
});

// Обработка телефона
document.getElementById('phone-form').addEventListener('submit', function(e) {
    e.preventDefault();
    enterApp(localStorage.getItem('currentUser'));
});

// --- ОСТАЛЬНАЯ ЛОГИКА (Код, страны) БЕЗ ИЗМЕНЕНИЙ ---

const codeInputs = document.querySelectorAll('.code-input');
codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        if (e.target.value !== '' && index < codeInputs.length - 1) codeInputs[index + 1].focus();
        checkCodeComplete();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            codeInputs[index - 1].focus();
            codeInputs[index - 1].value = '';
        }
    });
});

function checkCodeComplete() {
    const isComplete = Array.from(codeInputs).every(input => input.value !== '');
    if (isComplete) {
        setTimeout(() => {
            codeInputs.forEach(input => { input.classList.add('success'); });
            setTimeout(() => {
                codeInputs.forEach(input => { input.classList.remove('success'); input.value = ''; });
                // Если мы восстанавливали пароль, просто вернем на вход, если регались - на телефон
                const activeScreen = document.querySelector('.screen.active');
                if(activeScreen.id === 'screen-code') goToScreen('screen-phone');
            }, 1000);
        }, 300);
    }
}

const countries = [
    { name: "Россия", code: "+7", flag: "🇷🇺" },
    { name: "Украина", code: "+380", flag: "🇺🇦" },
    { name: "Беларусь", code: "+375", flag: "🇧🇾" },
    { name: "Казахстан", code: "+7", flag: "🇰🇿" },
    { name: "США", code: "+1", flag: "🇺🇸" }
];

const countryPickerTrigger = document.getElementById('country-picker-trigger');
const countryDropdown = document.getElementById('country-dropdown');
const countryList = document.getElementById('country-list');
const currentFlag = document.getElementById('current-flag');
const currentCode = document.getElementById('current-code');

function renderCountries() {
    countryList.innerHTML = '';
    countries.forEach(country => {
        const li = document.createElement('li');
        li.className = 'country-item';
        li.innerHTML = `<span class="flag">${country.flag}</span><span class="name">${country.name}</span><span class="code">${country.code}</span>`;
        li.onclick = () => {
            currentFlag.textContent = country.flag;
            currentCode.textContent = country.code;
            countryDropdown.classList.remove('show');
        };
        countryList.appendChild(li);
    });
}

countryPickerTrigger.onclick = (e) => { e.stopPropagation(); countryDropdown.classList.toggle('show'); };
document.addEventListener('click', () => countryDropdown.classList.remove('show'));
renderCountries();
