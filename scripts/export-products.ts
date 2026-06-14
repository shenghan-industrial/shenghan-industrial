import { products } from "../data/products";
import fs from "fs";

fs.writeFileSync(
  "data/products.json",
  JSON.stringify(products, null, 2),
  "utf8"
);
console.log(`Exported ${products.length} products to data/products.json`);
