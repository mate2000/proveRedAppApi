require("./config");
const express = require("express");
const routes = require("./routes/routes");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(fileUpload());

app.use(routes);
app.use(cors());
//md5
const PORT = 3001;
app.listen(PORT, () => {
  console.log("API running http://localhost:" + PORT);
});
