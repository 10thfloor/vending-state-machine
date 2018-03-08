import { STATE, STATES, STARTING_STATE, transitionTo } from "./asm";

type CoinName = "Twoonie" | "Loonie" | "Quarter" | "Dime" | "Nickel";
type ItemName = "Crab Juice" | "Reese's" | "Tesla";
type MachineStock = { stock: number; value: number };
type VendingMachineItems = Map<ItemName, MachineStock>;
type VendingMachineChange = Map<CoinName, MachineStock>;

type MachineState =
  | "maintenance"
  | "restockChange"
  | "acceptingCoins"
  | "readyToVend"
  | "poweredOff"
  | "itemsEmpty"
  | "changeEmpty"
  | "dispensingItem"
  | "dispensingChange";

type ValidInput = CoinName | VendingMachineItems | VendingMachineChange;

interface VendingMachine {
  paymentGiven: number;
  selectedItem?: ItemName;
  maxItemCount: number;
  items: VendingMachineItems;
  change: VendingMachineChange;
  [STARTING_STATE]: MachineState;
  [STATES]: any; // TODO
}

export {
  CoinName,
  ItemName,
  MachineStock,
  VendingMachineItems,
  VendingMachineChange,
  MachineState,
  ValidInput,
  VendingMachine
};
