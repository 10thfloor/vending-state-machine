import {
  CoinName,
  ItemName,
  MachineStock,
  VendingMachineItems,
  VendingMachineChange,
  MachineState,
  VendingMachine
} from "./lib/types";

import { STATE, STATES, STARTING_STATE, transitionTo } from "./lib/asm";
import { check, inputs, makeChange } from "./lib/helpers";

export const vendingMachine: VendingMachine = {
  paymentGiven: 0,
  selectedItem: undefined,
  maxItemCount: 10,
  items: new Map([
    [<ItemName>"Crab juice", <MachineStock>{ stock: 0, value: 1 }],
    [<ItemName>"Reese's", <MachineStock>{ stock: 0, value: 1 }],
    [<ItemName>"Tesla", <MachineStock>{ stock: 0, value: 100 }]
  ]),
  change: new Map([
    [<CoinName>"Twoonie", <MachineStock>{ stock: 0, value: 2 }],
    [<CoinName>"Loonie", <MachineStock>{ stock: 0, value: 1 }],
    [<CoinName>"Quarter", <MachineStock>{ stock: 0, value: 0.25 }],
    [<CoinName>"Dime", <MachineStock>{ stock: 0, value: 0.1 }],
    [<CoinName>"Nickel", <MachineStock>{ stock: 0, value: 0.05 }]
  ]),
  [STARTING_STATE]: <MachineState>"poweredOff",
  [STATES]: {
    maintenance: {
      restockItems: (items: VendingMachineItems) => {
        try {
          check(items);
          for (const item of items) {
            this.items.get(item).stock = this.maxItemCount;
          }
        } catch (e) {
          console.log(e, "Attempted to insert an invlaid item.");
          return false;
        }
      },
      restockChange: (change: VendingMachineChange) => {
        try {
          check(change);
          this.change = change;
        } catch (e) {
          console.log("Attempted to insert an invlaid change.");
          return false;
        }
      },
      ready: transitionTo("acceptingCoins", () => {
        console.log("Machine is ready, accepting coins.");
      }),
      powerOff: transitionTo("poweredOff", () => {
        console.log("Machine is off.");
      })
    },
    acceptingCoins: {
      addCoin: (coin: CoinName) => {
        try {
          check(coin);
          this.paymentGiven += inputs.COIN;
        } catch (e) {
          console.log("Attempted to insert an invlaid coin.");
          return false;
        }
      },
      returnCoins: () => {
        console.log("Here is your change", this.paymentGiven);
        this.paymentGiven = 0;
      },
      powerOff: transitionTo("poweredOff", () => {
        console.log("Machine is off.");
      })
    },
    readyToVend: {
      selectItem: (name: ItemName) => {
        const item = this.items.get(name);
        if (item && item.stock > 0) {
          this.selectedItem = item;
        }
      },
      enterMaintenanceMode: transitionTo("maintenance", () => {
        console.log("Entering maintenance mode.");
      }),
      powerOff: transitionTo("poweredOff", () => {
        console.log("Machine is off.");
      })
    },
    poweredOff: {
      powerOn: transitionTo("maintenance", () => {
        console.log("Machine was restarted. Entering maintenance mode.");
      })
    },
    itemsEmpty: {
      enterMaintenanceMode: transitionTo("maintenance", () => {
        console.log("Items are empty. Entering maintenance mode.");
      }),
      powerOff: transitionTo("poweredOff", () => {
        console.log("Machine is off.");
      })
    },
    changeEmpty: {
      enterMaintenanceMode: transitionTo("maintenance", () => {
        console.log("Change is empty. Entering maintenance mode.");
      }),
      powerOff: transitionTo("poweredOff", () => {
        console.log("Machine is off.");
      })
    },
    dispensingItem: {
      dispenseItem: transitionTo("dispensingChange", () => {
        console.log("Here is your item.", this.selectedItem);
      })
    },
    dispensingChange: {
      giveChange: transitionTo("acceptingCoins", () => {
        console.log(
          "Here is your change",
          makeChange(this.selectedItem, this.paymentGiven)
        );
        this.selectedItem = undefined;
        this.paymentGiven = 0;
      })
    }
  }
};
