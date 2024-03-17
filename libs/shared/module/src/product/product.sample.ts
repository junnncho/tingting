import * as Chance from "chance";
import * as gql from "../gql";
import { Id } from "@shared/util-server";
import { ProductService } from "./product.service";
import { TestingModule } from "@nestjs/testing";
const c = new Chance();
export const productInput = (fileId: Id): gql.ProductInput => ({
  name: c.word(),
  description: "desc",
  image: fileId,
});

export const createProduct = async (app: TestingModule, fileId: Id) => {
  const productService = app.get<ProductService>(ProductService);
  const product = await productService.create(productInput(fileId));
  return product;
};
