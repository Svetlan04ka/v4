// const express = require("express");
// const app = express();
// const multer = require("multer");
// const path = require("path");

// // 1. Сначала базовые middleware и логирование
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// app.use(express.static("static"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // 2. НАСТРОЙКА ХРАНИЛИЩА (должна быть строго выше, чем создание самого multer)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // 3. ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННОЙ `upload` (СТРОГО ЗДЕСЬ!)
// const upload = multer({ storage: storage });

// app.set("view engine", "ejs");
// app.set("views", "views");

// let products = [];

// app.get("/", (req, res) => {
//   res.render("index", { products: products });
// });

// app.get("/post/:id", (req, res) => {
//   const postId = req.params.id;
//   if (!products[postId]) {
//     return res.status(404).send("Post not found");
//   }
//   res.render("post", { product: products[postId] });
// });

// // 4. ТЕПЕРЬ МАРШРУТ МОЖЕТ БЕЗОПАСНО ИСПОЛЬЗОВАТЬ `upload`
// app.post("/add", upload.fields([{ name: "image" }]), (req, res) => {
//   let data = req.body;

//   if (req.files && req.files.image) {
//     data.image = req.files.image.map((file) => file.filename);
//   } else {
//     data.image = [];
//   }

//   data.id = products.length;
//   products.push(data);
//   res.status(201).end();
// });

// // 5. Обработка 404 (в самом конце)
// app.use((req, res, next) => {
//   res.status(404);
//   res.render("notfound");
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Автоматическое создание папки uploads, если её нет (чтобы multer не выдавал ошибку)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Настройка хранилища Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Инициализация multer ДО использования в роутах
const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", "views");

let products = [];

app.get("/", (req, res) => {
  res.render("index", { products: products });
});

app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  if (!products[postId]) {
    return res.status(404).send("Post not found");
  }
  res.render("post", { product: products[postId] });
});

// Обработка отправки формы через Fetch API
app.post("/add", upload.fields([{ name: "image" }]), (req, res) => {
  let data = req.body;

  if (req.files && req.files.image) {
    data.image = req.files.image.map((file) => file.filename);
  } else {
    data.image = []; 
  }

  data.id = products.length;
  products.push(data);
  res.status(201).end();
});

// Обработка несуществующих страниц
app.use((req, res, next) => {
  res.status(404);
  res.render("notfound");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
