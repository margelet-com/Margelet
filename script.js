// Глобальные переменные для сессии
let currentUserEmail = null;
let resetEmailTarget = null;

// Функция переключения экранов
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // Если перешли на экран кода, автоматически ставим курсор
    if(screenId === 'screen-code') {
        setTimeout(() => document.querySelector('.code-input').focus(), 100);
    }
    // То же самое для кода сброса пароля
    if(screenId === 'screen-reset-code') {
        setTimeout(() => document.querySelector('.reset-code-input').focus(), 100);
    }
}

// НОВОЕ: Функция перехода на главный экран (в профиль)
function goToMainScreen() {
    if (currentUserEmail) {
        document.getElementById('profile-email').textContent = currentUserEmail;
        goToScreen('screen-main');
        loadChatHistory();
    } else {
        goToScreen('screen-login');
    }
}

// НОВОЕ: Функция выхода
function logout() {
    currentUserEmail = null;
    goToScreen('screen-login');
}

// Обработка регистрации
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const inputs = e.target.querySelectorAll('input');
    const email = inputs[0].value;
    const password = inputs[1].value;

    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];
    const userExists = users.some(u => u.email === email);

    if (userExists) {
        alert('Пользователь с такой почтой уже существует!');
    } else {
        users.push({ email: email, password: password });
        localStorage.setItem('socialNetworkUsers', JSON.stringify(users));
        
        currentUserEmail = email; // Сохраняем почту для текущей сессии
        goToScreen('screen-code');
    }
});

// Обработка входа
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputs = e.target.querySelectorAll('input');
    const email = inputs[0].value;
    const password = inputs[1].value;

    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUserEmail = user.email; // Запоминаем кто вошел
        goToMainScreen(); // Идем в профиль
    } else {
        alert('Ошибка: Неверная почта или пароль');
    }
});

// Обработка телефона
document.getElementById('phone-form').addEventListener('submit', function(e) {
    e.preventDefault();
    goToMainScreen(); // После привязки идем в профиль
});

// --- СУЩЕСТВУЮЩАЯ ЛОГИКА КОДА (РЕГИСТРАЦИЯ) ---
const codeInputs = document.querySelectorAll('.code-input');

codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
        if (e.target.value !== '') {
            if (index < codeInputs.length - 1) codeInputs[index + 1].focus();
            checkCodeComplete();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            codeInputs[index - 1].focus();
            codeInputs[index - 1].value = '';
        }
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, codeInputs.length);
        pastedData.split('').forEach((char, i) => {
            if (index + i < codeInputs.length) codeInputs[index + i].value = char;
        });
        const nextFocusIndex = Math.min(index + pastedData.length, codeInputs.length - 1);
        codeInputs[nextFocusIndex].focus();
        checkCodeComplete();
    });
});

function checkCodeComplete() {
    const isComplete = Array.from(codeInputs).every(input => input.value !== '');
    if (isComplete) {
        codeInputs.forEach(input => input.blur());
        setTimeout(() => {
            codeInputs.forEach(input => input.classList.add('success'));
            setTimeout(() => {
                codeInputs.forEach(input => {
                    input.classList.remove('success');
                    input.value = '';
                });
                goToScreen('screen-phone');
            }, 1000);
        }, 300);
    }
}

// --- БАЗА СТРАН (Оставлено без изменений) ---
const countries = [
    { name: "Россия", code: "+7", flag: "🇷🇺" },
    { name: "Украина", code: "+380", flag: "🇺🇦" },
    { name: "Беларусь", code: "+375", flag: "🇧🇾" },
    { name: "Казахстан", code: "+7", flag: "🇰🇿" },
    { name: "Узбекистан", code: "+998", flag: "🇺🇿" },
    { name: "США", code: "+1", flag: "🇺🇸" },
    { name: "Германия", code: "+49", flag: "🇩🇪" },
    { name: "Франция", code: "+33", flag: "🇫🇷" },
    { name: "Великобритания", code: "+44", flag: "🇬🇧" },
    { name: "Турция", code: "+90", flag: "🇹🇷" }
];

const countryPickerTrigger = document.getElementById('country-picker-trigger');
const countryDropdown = document.getElementById('country-dropdown');
const countryList = document.getElementById('country-list');
const countrySearch = document.getElementById('country-search');
const currentFlag = document.getElementById('current-flag');
const currentCode = document.getElementById('current-code');

function renderCountries(filter = '') {
    countryList.innerHTML = '';
    const filtered = countries.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    
    filtered.forEach(country => {
        const li = document.createElement('li');
        li.className = 'country-item';
        li.innerHTML = `
            <span class="flag">${country.flag}</span>
            <span class="name">${country.name}</span>
            <span class="code">${country.code}</span>
        `;
        li.onclick = () => {
            currentFlag.textContent = country.flag;
            currentCode.textContent = country.code;
            countryDropdown.classList.remove('show');
        };
        countryList.appendChild(li);
    });
}

countryPickerTrigger.onclick = (e) => {
    e.stopPropagation();
    countryDropdown.classList.toggle('show');
    if (countryDropdown.classList.contains('show')) countrySearch.focus();
};

countrySearch.oninput = (e) => renderCountries(e.target.value);
document.addEventListener('click', () => countryDropdown.classList.remove('show'));
renderCountries();

// =========================================
// НОВЫЙ КОД: СБРОС ПАРОЛЯ
// =========================================

function startPasswordReset() {
    const loginEmailInput = document.getElementById('login-email');
    const resetEmailInput = document.getElementById('reset-email-input');
    
    // Автозаполнение почты из окна логина
    if (loginEmailInput.value) {
        resetEmailInput.value = loginEmailInput.value;
    }
    goToScreen('screen-reset-email');
}

// Проверка почты на существование
document.getElementById('reset-email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email-input').value;
    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];
    
    const userExists = users.some(u => u.email === email);
    
    if (!userExists) {
        alert('Аккаунт с такой почтой не найден!');
    } else {
        resetEmailTarget = email;
        goToScreen('screen-reset-code');
    }
});

// Логика ячеек кода для сброса (аналогично регистрации)
const resetCodeInputs = document.querySelectorAll('.reset-code-input');

resetCodeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
        if (e.target.value !== '') {
            if (index < resetCodeInputs.length - 1) resetCodeInputs[index + 1].focus();
            checkResetCodeComplete();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            resetCodeInputs[index - 1].focus();
            resetCodeInputs[index - 1].value = '';
        }
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, resetCodeInputs.length);
        pastedData.split('').forEach((char, i) => {
            if (index + i < resetCodeInputs.length) resetCodeInputs[index + i].value = char;
        });
        const nextFocusIndex = Math.min(index + pastedData.length, resetCodeInputs.length - 1);
        resetCodeInputs[nextFocusIndex].focus();
        checkResetCodeComplete();
    });
});

function checkResetCodeComplete() {
    const isComplete = Array.from(resetCodeInputs).every(input => input.value !== '');
    if (isComplete) {
        resetCodeInputs.forEach(input => input.blur());
        setTimeout(() => {
            resetCodeInputs.forEach(input => input.classList.add('success'));
            setTimeout(() => {
                resetCodeInputs.forEach(input => {
                    input.classList.remove('success');
                    input.value = '';
                });
                goToScreen('screen-new-password');
            }, 1000);
        }, 300);
    }
}

// Сохранение нового пароля
document.getElementById('new-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('new-password-input').value;
    let users = JSON.parse(localStorage.getItem('socialNetworkUsers')) || [];
    
    const userIndex = users.findIndex(u => u.email === resetEmailTarget);
    if(userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('socialNetworkUsers', JSON.stringify(users));
        
        currentUserEmail = resetEmailTarget; // Запоминаем пользователя
        goToMainScreen(); // Пускаем сразу в профиль (или можешь сделать goToScreen('screen-login'))
    }
});

// =========================================
// НОВЫЙ КОД: МЕССЕНДЖЕР
// =========================================

document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('chat-message-input');
    const messageText = input.value.trim();
    
    if (messageText) {
        addMessageToChat(messageText, 'outgoing');
        saveMessage(messageText, 'outgoing');
        input.value = '';
        
        // Бот-ответ через секунду
        setTimeout(() => {
            const reply = "Вы написали: " + messageText;
            addMessageToChat(reply, 'incoming');
            saveMessage(reply, 'incoming');
        }, 1000);
    }
});

function addMessageToChat(text, type) {
    const chatArea = document.getElementById('chat-area');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = text;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight; // Автоскролл вниз
}

function saveMessage(text, type) {
    if (!currentUserEmail) return;
    const chatKey = 'chat_' + currentUserEmail; // Индивидуальный ключ для каждого аккаунта
    let history = JSON.parse(localStorage.getItem(chatKey)) || [];
    history.push({ text, type });
    localStorage.setItem(chatKey, JSON.stringify(history));
}

function loadChatHistory() {
    const chatArea = document.getElementById('chat-area');
    // Оставляем только базовое приветствие
    chatArea.innerHTML = '<div class="message incoming">Добро пожаловать в Marglet! Здесь вы можете общаться.</div>';
    
    if (!currentUserEmail) return;
    const chatKey = 'chat_' + currentUserEmail;
    let history = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    history.forEach(msg => {
        addMessageToChat(msg.text, msg.type);
    });
}
