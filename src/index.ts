import { StateMachine } from "./lib/asm";
import { vendingMachine } from "./description";

export const VendingMachine = StateMachine(vendingMachine);
