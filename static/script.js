// === ЛОГИКА МОДАЛЬНОГО ОКНА ===

// 1. Открытие модалки при нажатии на кнопку "+"
document.querySelector("#add").addEventListener("click", () => {
    document.querySelector(".model").classList.add("active");
});

// 2. Закрытие модалки при нажатии на крестик "X"
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".model").classList.remove("active");
    // Сбрасываем текст кнопки выбора файлов при закрытии
    document.querySelector(".image-label").textContent = "Zakrysi kartinka";
});


// === ЛОГИКА ВЫБОРА ФАЙЛОВ ===

// Отслеживаем выбор файлов через замену текста в <label>
document.querySelector("#image").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        document.querySelector(".image-label").textContent = `Выбрано файлов: ${e.target.files.length}`;
    } else {
        document.querySelector(".image-label").textContent = "Zakrysi kartinka";
    }
});


// === ОТПРАВКА ФОРМЫ ===
document.querySelector("#add-ad-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);

    fetch("/add", {
        method: "POST",
        body: formData // Отправляем данные на бэкенд
    })
    .then(response => {
        if (response.ok) {
            // Закрываем модалку и обновляем страницу, чтобы увидеть новое объявление
            document.querySelector(".model").classList.remove("active");
            location.reload(); 
        } else {
            alert("Ошибка при сохранении объявления на сервере");
        }
    })
    .catch(err => {
        console.error("Ошибка сети:", err);
        alert("Не удалось связаться с сервером");
    });
});
