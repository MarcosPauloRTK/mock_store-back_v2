import productsRouter from "./routes/products";
import express from "express";

const app = express();

app.use(express.json());

app.use("/products", productsRouter);

app.get("/", (_req, res) => {
  res.send("API Fake Store");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(
    `Listening on the port ${port}...`,
    `\nServer at: http://localhost:${port}`
  )
);
