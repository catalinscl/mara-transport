const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

const users = [
  { email: "disp1@mara.ro", password: "1234", role: "dispatcher" },
  { email: "disp2@mara.ro", password: "1234", role: "dispatcher" },
  { email: "trans1@mail.com", password: "1234", role: "carrier" },
];

let loads = [];

// LOGIN
app.post("/login", (req, res) => {
  const user = users.find(
    (u) => u.email === req.body.email && u.password === req.body.password
  );
  if (user) {
    req.session.user = user;
    res.redirect("/dashboard.html");
  } else {
    res.send("Login invalid");
  }
});

// API
app.get("/loads", (req, res) => {
  res.json(loads);
});

app.post("/add-load", (req, res) => {
  if (req.session.user?.role !== "dispatcher") {
    return res.send("Nu ai acces");
  }

  loads.push({
    pickup: req.body.pickup,
    delivery: req.body.delivery,
    cargo: req.body.cargo,
  });

  res.redirect("/dashboard.html");
});

// ✅ PORT LA FINAL (CORECT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server pornit"));
