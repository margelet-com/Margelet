function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

/* =======================
   РЕГИСТРАЦИЯ
======================= */

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!email || !password) {
        alert("Заполните все поля");
        return;
    }

    // Проверяем существует ли пользователь
    const users = JSON.parse(localStorage.getItem("margelet_users")) || [];

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("Аккаунт с такой почтой уже существует!");
        return;
    }

    // Сохраняем нового пользователя
    users.push({ email, password });
    localStorage.setItem("margelet_users", JSON.stringify(users));

    alert("Регистрация успешна! Теперь войдите.");
    goToScreen('screen-login');
});


/* =======================
   ВХОД
======================= */

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const users = JSON.parse(localStorage.getItem("margelet_users")) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert("Неверная почта или пароль!");
        return;
    }

    // Сохраняем текущего пользователя
    localStorage.setItem("margelet_current_user", email);

    alert("Успешный вход в Margelet!");
});
