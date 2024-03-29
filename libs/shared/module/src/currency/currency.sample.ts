import * as Chance from "chance";
import * as gql from "../gql";
import { CurrencyService } from "./currency.service";
import { TestingModule } from "@nestjs/testing";
const c = new Chance();
export const currencyInput = (): gql.CurrencyInput => ({
  name: "ether",
  type: "crypto",
  symbol: "ETH",
  services: ["ethers"],
});

export const createCurrency = async (app: TestingModule) => {
  const currencyService = app.get<CurrencyService>(CurrencyService);
  const currency = await currencyService.create(currencyInput());
  return currency;
};
