const express = require("express");
const app = express();

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views" , "views");

let products = [];

// ИСПРАВЛЕНО: Теперь главная страница сайта открывается по адресу "/"
app.get("/", (req, res) => {
    res.render("index", { products: products });
});

// ИСПРАВЛЕНО: После сохранения данных перенаправляем пользователя обратно на главную
app.post("/", (req, res) => {
    let data = req.body;
    products.push(data);
    res.redirect("/"); // Браузер автоматически обновит страницу и покажет новый product
});

app.use((req, res, next) => {
    res.status(404);
    res.render("notfound");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
