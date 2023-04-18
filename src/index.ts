import Express from "express";
import { router as productsRouter } from "./routes/products";
import { router as categoriesRouter } from "./routes/categories";

const app = Express();

app.use(Express.json());
app.set("json spaces", 2);

app.get("/", (request, response) => {
    response.send("The API is running! :)")
} )
app.use("/products", productsRouter);
app.use("/products/categories", categoriesRouter);

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
