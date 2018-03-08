import { STATE, STATES } from "../src/lib/asm";
import { vendingMachine } from "../src/description";
import { VendingMachine } from "../src/index";

describe("Vending Machine Tests", () => {
  describe("When installing a new machine", () => {
    test("The machine should arrive powered off.", () => {
      expect(VendingMachine[STATE]).toEqual(vendingMachine[STATES].poweredOff);
    });
    test("The machine should be empty.", () => {
      let stock = 0;
      for (const [name, info] of VendingMachine.items) {
        stock += info.stock;
      }
      expect(stock).toEqual(0);
    });
    test("We should be able to turn on the machine.", () => {
      VendingMachine.powerOn();
      expect(VendingMachine[STATE]).toEqual(vendingMachine[STATES].maintenance);
    });
    test("We can't turn the machine on twice.", () => {
      VendingMachine.powerOff();
      VendingMachine.powerOn();
      try {
        VendingMachine.powerOn();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
    test("We can't add coins if the machine is off.", () => {
      VendingMachine.powerOff();
      try {
        VendingMachine.addCoin("Loonie");
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});
