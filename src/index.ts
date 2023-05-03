import categoryRouter from "./routes/category";
import express from "express";

const app = express();

app.use(express.json())
app.use("/products/categories", categoryRouter);
app.use("/products/category", categoryRouter);

app.get("/", (_req, res) => {
  res.send("API Fake Store");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(
    `Listening on the port ${port}...`,
    `Server at: http://localhost:${port}`
  )
);