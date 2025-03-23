const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute");
const Memory = require("./controllers/MemoriesControl");
// const ExpenseRoute = require("./routes/ExpenseRoute");
// const BudgetRoute = require("./routes/BudgetRoute");
// const errorHandler = require("./middlewares/errorHandler");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const MongodbURL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
	origin: "http://localhost:3000", // Allow requests from this origin
	credentials: true, // Allow cookies and credentials
  }));
app.use("/api/auth", UserRoute);
app.use("/api/posts", Memory);



app.get("/", (req, res) => {
	res.send("ALUMNI!");
});

mongoose
	.connect(MongodbURL)
	.then(() => {
		console.log("connected to mongodb");

		app.listen(port, () => {
			console.log(`Example app listening on port ${port}`);
		});
	})
	.catch((e) => {
		console.log(e);
	});
module.exports = app;
