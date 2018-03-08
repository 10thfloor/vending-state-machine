import { ValidInput, ItemName } from "./types";

export function check(thing: ValidInput) {
  return true;
}

export function makeChange(item: ItemName, payment: number) {
  console.log("You win!");
  return 10000;
}

export const inputs = {
  ITEM: {},
  CHANGE: {},
  COIN: {}
};
