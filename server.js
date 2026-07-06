const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server pornit"));
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

app.get("/me", (req, res) => {
  res.json(req.session.user || null);
});

app.get("/loads", (req, res) => {
  res.json(loads);
});

app.post("/add-load", (req, res) => {
  if (req.session.user?.role !== "dispatcher") {
    return res.send("Nu ai acces");
  }

  const newLoad = {
    id: loads.length + 1,
    pickup: req.body.pickup,
    delivery: req.body.delivery,
    cargo: req.body.cargo,
    weight: req.body.weight,
    truck: req.body.truck,
    date: req.body.date,
    phone: "0711111111",
    email: "office@mara.ro",
  };

  loads.push(newLoad);
  res.redirect("/dashboard.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

app.listen(3000, () => console.log("Server rulând pe http://localhost:3000"));
