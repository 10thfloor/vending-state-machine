/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/description.ts":
/*!****************************!*\
  !*** ./src/description.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const asm_1 = __webpack_require__(/*! ./lib/asm */ "./src/lib/asm.ts");
const helpers_1 = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
exports.vendingMachine = {
    paymentGiven: 0,
    selectedItem: undefined,
    maxItemCount: 10,
    items: new Map([
        ["Crab juice", { stock: 0, price: 1 }],
        ["Reese's", { stock: 0, price: 1 }],
        ["Tesla", { stock: 0, price: 100 }]
    ]),
    change: new Map([
        ["Twoonie", { stock: 0, value: 2 }],
        ["Loonie", { stock: 0, value: 1 }],
        ["Quarter", { stock: 0, value: 0.25 }],
        ["Dime", { stock: 0, value: 0.1 }],
        ["Nickel", { stock: 0, value: 0.05 }]
    ]),
    [asm_1.STARTING_STATE]: "poweredOff",
    [asm_1.STATES]: {
        maintenance: {
            restockItems: items => {
                try {
                    helpers_1.check(items, helpers_1.inputs.ITEM);
                    for (const item of items) {
                        this.items[item].stock = this.maxItemCount;
                    }
                }
                catch (e) {
                    console.log(e, "Attempted to insert an invlaid item.");
                    return false;
                }
            },
            restockChange: change => {
                try {
                    helpers_1.check(change, helpers_1.inputs.CHANGE);
                    this.change = change;
                }
                catch (e) {
                    console.log("Attempted to insert an invlaid change.");
                    return false;
                }
            },
            ready: asm_1.transitionTo("acceptingCoins", () => {
                console.log("Machine is ready, accepting coins.");
            }),
            powerOff: asm_1.transitionTo("poweredOff", () => {
                console.log("Machine is off.");
            })
        },
        acceptingCoins: {
            addCoin: coin => {
                try {
                    helpers_1.check(coin, helpers_1.inputs.COIN);
                    this.paymentGiven += coin;
                }
                catch (e) {
                    console.log("Attempted to insert an invlaid coin.");
                    return false;
                }
            },
            returnCoins: () => {
                console.log("Here is your change", this.paymentGiven);
                this.paymentGiven = 0;
            },
            powerOff: asm_1.transitionTo("poweredOff", () => {
                console.log("Machine is off.");
            })
        },
        readyToVend: {
            selectItem: name => {
                const item = this.items.get(name);
                if (item && item.stock > 0) {
                    this.selectedItem = item;
                }
            },
            enterMaintenanceMode: asm_1.transitionTo("maintenance", () => {
                console.log("Entering maintenance mode.");
            }),
            powerOff: asm_1.transitionTo("poweredOff", () => {
                console.log("Machine is off.");
            })
        },
        poweredOff: {
            powerOn: asm_1.transitionTo("maintenance", () => {
                console.log("Machine was restarted. Entering maintenance mode.");
            })
        },
        itemsEmpty: {
            enterMaintenanceMode: asm_1.transitionTo("maintenance", () => {
                console.log("Items are empty. Entering maintenance mode.");
            }),
            powerOff: asm_1.transitionTo("poweredOff", () => {
                console.log("Machine is off.");
            })
        },
        changeEmpty: {
            enterMaintenanceMode: asm_1.transitionTo("maintenance", () => {
                console.log("Change is empty. Entering maintenance mode.");
            }),
            powerOff: asm_1.transitionTo("poweredOff", () => {
                console.log("Machine is off.");
            })
        },
        dispensingItem: {
            dispenseItem: asm_1.transitionTo("dispensingChange", () => {
                console.log("Here is your item.", this.selectedItem);
            })
        },
        dispensingChange: {
            giveChange: asm_1.transitionTo("acceptingCoins", () => {
                console.log("Here is your change", makeChange(this.selectedItem, this.paymentGiven));
                this.selectedItem = undefined;
                this.paymentGiven = 0;
            })
        }
    }
};
function makeChange(item, payment) {
    console.log("You win!");
    return 10000;
}


/***/ }),

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function check(thing, type) {
    return true;
}
exports.check = check;
exports.inputs = {
    ITEM: {},
    CHANGE: {},
    COIN: {}
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const asm_1 = __webpack_require__(/*! ./lib/asm */ "./src/lib/asm.ts");
const description_1 = __webpack_require__(/*! ./description */ "./src/description.ts");
exports.VendingMachine = asm_1.StateMachine(description_1.vendingMachine);


/***/ }),

/***/ "./src/lib/asm.ts":
/*!************************!*\
  !*** ./src/lib/asm.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.STATES = Symbol("states");
exports.STARTING_STATE = Symbol("starting-state");
exports.STATE = Symbol("current-state");
function transitionTo(nextState, fn) {
    return function (...args) {
        const returnValue = fn.apply(this, args);
        this[exports.STATE] = this[exports.STATES][nextState];
        return returnValue;
    };
}
exports.transitionTo = transitionTo;
function StateMachine(description) {
    const machine = {};
    const propsAndMethods = Object.keys(description);
    for (const prop of propsAndMethods) {
        machine[prop] = description[prop];
    }
    machine[exports.STATES] = description[exports.STATES];
    const actionNames = Object.entries(description[exports.STATES]).reduce((names, [state, stateDescription]) => {
        const actionNamesForState = Object.keys(stateDescription);
        for (const actionName of actionNamesForState) {
            names.add(actionName);
        }
        return names;
    }, new Set());
    for (const actionName of actionNames) {
        machine[actionName] = function (...args) {
            return this[exports.STATE][actionName].apply(this, args);
        };
    }
    machine[exports.STATE] = description[exports.STATES][description[exports.STARTING_STATE]];
    return machine;
}
exports.StateMachine = StateMachine;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Rlc2NyaXB0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2FzbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25FQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QyxxQkFBcUIscUJBQXFCO0FBQzFDLG1CQUFtQix1QkFBdUI7QUFDMUM7QUFDQTtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUMsb0JBQW9CLHFCQUFxQjtBQUN6QyxxQkFBcUIsd0JBQXdCO0FBQzdDLGtCQUFrQix1QkFBdUI7QUFDekMsb0JBQW9CLHdCQUF3QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzSEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLGNBQWM7QUFDZDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidmVuZGlubWFjaGluZS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFzbV8xID0gcmVxdWlyZShcIi4vbGliL2FzbVwiKTtcbmNvbnN0IGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XG5leHBvcnRzLnZlbmRpbmdNYWNoaW5lID0ge1xuICAgIHBheW1lbnRHaXZlbjogMCxcbiAgICBzZWxlY3RlZEl0ZW06IHVuZGVmaW5lZCxcbiAgICBtYXhJdGVtQ291bnQ6IDEwLFxuICAgIGl0ZW1zOiBuZXcgTWFwKFtcbiAgICAgICAgW1wiQ3JhYiBqdWljZVwiLCB7IHN0b2NrOiAwLCBwcmljZTogMSB9XSxcbiAgICAgICAgW1wiUmVlc2Unc1wiLCB7IHN0b2NrOiAwLCBwcmljZTogMSB9XSxcbiAgICAgICAgW1wiVGVzbGFcIiwgeyBzdG9jazogMCwgcHJpY2U6IDEwMCB9XVxuICAgIF0pLFxuICAgIGNoYW5nZTogbmV3IE1hcChbXG4gICAgICAgIFtcIlR3b29uaWVcIiwgeyBzdG9jazogMCwgdmFsdWU6IDIgfV0sXG4gICAgICAgIFtcIkxvb25pZVwiLCB7IHN0b2NrOiAwLCB2YWx1ZTogMSB9XSxcbiAgICAgICAgW1wiUXVhcnRlclwiLCB7IHN0b2NrOiAwLCB2YWx1ZTogMC4yNSB9XSxcbiAgICAgICAgW1wiRGltZVwiLCB7IHN0b2NrOiAwLCB2YWx1ZTogMC4xIH1dLFxuICAgICAgICBbXCJOaWNrZWxcIiwgeyBzdG9jazogMCwgdmFsdWU6IDAuMDUgfV1cbiAgICBdKSxcbiAgICBbYXNtXzEuU1RBUlRJTkdfU1RBVEVdOiBcInBvd2VyZWRPZmZcIixcbiAgICBbYXNtXzEuU1RBVEVTXToge1xuICAgICAgICBtYWludGVuYW5jZToge1xuICAgICAgICAgICAgcmVzdG9ja0l0ZW1zOiBpdGVtcyA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGVscGVyc18xLmNoZWNrKGl0ZW1zLCBoZWxwZXJzXzEuaW5wdXRzLklURU0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNbaXRlbV0uc3RvY2sgPSB0aGlzLm1heEl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLCBcIkF0dGVtcHRlZCB0byBpbnNlcnQgYW4gaW52bGFpZCBpdGVtLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0b2NrQ2hhbmdlOiBjaGFuZ2UgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhlbHBlcnNfMS5jaGVjayhjaGFuZ2UsIGhlbHBlcnNfMS5pbnB1dHMuQ0hBTkdFKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2UgPSBjaGFuZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXR0ZW1wdGVkIHRvIGluc2VydCBhbiBpbnZsYWlkIGNoYW5nZS5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVhZHk6IGFzbV8xLnRyYW5zaXRpb25UbyhcImFjY2VwdGluZ0NvaW5zXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1hY2hpbmUgaXMgcmVhZHksIGFjY2VwdGluZyBjb2lucy5cIik7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHBvd2VyT2ZmOiBhc21fMS50cmFuc2l0aW9uVG8oXCJwb3dlcmVkT2ZmXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1hY2hpbmUgaXMgb2ZmLlwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGFjY2VwdGluZ0NvaW5zOiB7XG4gICAgICAgICAgICBhZGRDb2luOiBjb2luID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoZWxwZXJzXzEuY2hlY2soY29pbiwgaGVscGVyc18xLmlucHV0cy5DT0lOKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXltZW50R2l2ZW4gKz0gY29pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdHRlbXB0ZWQgdG8gaW5zZXJ0IGFuIGludmxhaWQgY29pbi5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmV0dXJuQ29pbnM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlcmUgaXMgeW91ciBjaGFuZ2VcIiwgdGhpcy5wYXltZW50R2l2ZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMucGF5bWVudEdpdmVuID0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3dlck9mZjogYXNtXzEudHJhbnNpdGlvblRvKFwicG93ZXJlZE9mZlwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWNoaW5lIGlzIG9mZi5cIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICByZWFkeVRvVmVuZDoge1xuICAgICAgICAgICAgc2VsZWN0SXRlbTogbmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXMuZ2V0KG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uc3RvY2sgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXJNYWludGVuYW5jZU1vZGU6IGFzbV8xLnRyYW5zaXRpb25UbyhcIm1haW50ZW5hbmNlXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVudGVyaW5nIG1haW50ZW5hbmNlIG1vZGUuXCIpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwb3dlck9mZjogYXNtXzEudHJhbnNpdGlvblRvKFwicG93ZXJlZE9mZlwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWNoaW5lIGlzIG9mZi5cIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBwb3dlcmVkT2ZmOiB7XG4gICAgICAgICAgICBwb3dlck9uOiBhc21fMS50cmFuc2l0aW9uVG8oXCJtYWludGVuYW5jZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWNoaW5lIHdhcyByZXN0YXJ0ZWQuIEVudGVyaW5nIG1haW50ZW5hbmNlIG1vZGUuXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbXNFbXB0eToge1xuICAgICAgICAgICAgZW50ZXJNYWludGVuYW5jZU1vZGU6IGFzbV8xLnRyYW5zaXRpb25UbyhcIm1haW50ZW5hbmNlXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW1zIGFyZSBlbXB0eS4gRW50ZXJpbmcgbWFpbnRlbmFuY2UgbW9kZS5cIik7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHBvd2VyT2ZmOiBhc21fMS50cmFuc2l0aW9uVG8oXCJwb3dlcmVkT2ZmXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1hY2hpbmUgaXMgb2ZmLlwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZUVtcHR5OiB7XG4gICAgICAgICAgICBlbnRlck1haW50ZW5hbmNlTW9kZTogYXNtXzEudHJhbnNpdGlvblRvKFwibWFpbnRlbmFuY2VcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2hhbmdlIGlzIGVtcHR5LiBFbnRlcmluZyBtYWludGVuYW5jZSBtb2RlLlwiKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcG93ZXJPZmY6IGFzbV8xLnRyYW5zaXRpb25UbyhcInBvd2VyZWRPZmZcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWFjaGluZSBpcyBvZmYuXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZGlzcGVuc2luZ0l0ZW06IHtcbiAgICAgICAgICAgIGRpc3BlbnNlSXRlbTogYXNtXzEudHJhbnNpdGlvblRvKFwiZGlzcGVuc2luZ0NoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZXJlIGlzIHlvdXIgaXRlbS5cIiwgdGhpcy5zZWxlY3RlZEl0ZW0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZGlzcGVuc2luZ0NoYW5nZToge1xuICAgICAgICAgICAgZ2l2ZUNoYW5nZTogYXNtXzEudHJhbnNpdGlvblRvKFwiYWNjZXB0aW5nQ29pbnNcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVyZSBpcyB5b3VyIGNoYW5nZVwiLCBtYWtlQ2hhbmdlKHRoaXMuc2VsZWN0ZWRJdGVtLCB0aGlzLnBheW1lbnRHaXZlbikpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMucGF5bWVudEdpdmVuID0gMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59O1xuZnVuY3Rpb24gbWFrZUNoYW5nZShpdGVtLCBwYXltZW50KSB7XG4gICAgY29uc29sZS5sb2coXCJZb3Ugd2luIVwiKTtcbiAgICByZXR1cm4gMTAwMDA7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGNoZWNrKHRoaW5nLCB0eXBlKSB7XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmNoZWNrID0gY2hlY2s7XG5leHBvcnRzLmlucHV0cyA9IHtcbiAgICBJVEVNOiB7fSxcbiAgICBDSEFOR0U6IHt9LFxuICAgIENPSU46IHt9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhc21fMSA9IHJlcXVpcmUoXCIuL2xpYi9hc21cIik7XG5jb25zdCBkZXNjcmlwdGlvbl8xID0gcmVxdWlyZShcIi4vZGVzY3JpcHRpb25cIik7XG5leHBvcnRzLlZlbmRpbmdNYWNoaW5lID0gYXNtXzEuU3RhdGVNYWNoaW5lKGRlc2NyaXB0aW9uXzEudmVuZGluZ01hY2hpbmUpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNUQVRFUyA9IFN5bWJvbChcInN0YXRlc1wiKTtcbmV4cG9ydHMuU1RBUlRJTkdfU1RBVEUgPSBTeW1ib2woXCJzdGFydGluZy1zdGF0ZVwiKTtcbmV4cG9ydHMuU1RBVEUgPSBTeW1ib2woXCJjdXJyZW50LXN0YXRlXCIpO1xuZnVuY3Rpb24gdHJhbnNpdGlvblRvKG5leHRTdGF0ZSwgZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgdGhpc1tleHBvcnRzLlNUQVRFXSA9IHRoaXNbZXhwb3J0cy5TVEFURVNdW25leHRTdGF0ZV07XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9O1xufVxuZXhwb3J0cy50cmFuc2l0aW9uVG8gPSB0cmFuc2l0aW9uVG87XG5mdW5jdGlvbiBTdGF0ZU1hY2hpbmUoZGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCBtYWNoaW5lID0ge307XG4gICAgY29uc3QgcHJvcHNBbmRNZXRob2RzID0gT2JqZWN0LmtleXMoZGVzY3JpcHRpb24pO1xuICAgIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wc0FuZE1ldGhvZHMpIHtcbiAgICAgICAgbWFjaGluZVtwcm9wXSA9IGRlc2NyaXB0aW9uW3Byb3BdO1xuICAgIH1cbiAgICBtYWNoaW5lW2V4cG9ydHMuU1RBVEVTXSA9IGRlc2NyaXB0aW9uW2V4cG9ydHMuU1RBVEVTXTtcbiAgICBjb25zdCBhY3Rpb25OYW1lcyA9IE9iamVjdC5lbnRyaWVzKGRlc2NyaXB0aW9uW2V4cG9ydHMuU1RBVEVTXSkucmVkdWNlKChuYW1lcywgW3N0YXRlLCBzdGF0ZURlc2NyaXB0aW9uXSkgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb25OYW1lc0ZvclN0YXRlID0gT2JqZWN0LmtleXMoc3RhdGVEZXNjcmlwdGlvbik7XG4gICAgICAgIGZvciAoY29uc3QgYWN0aW9uTmFtZSBvZiBhY3Rpb25OYW1lc0ZvclN0YXRlKSB7XG4gICAgICAgICAgICBuYW1lcy5hZGQoYWN0aW9uTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWVzO1xuICAgIH0sIG5ldyBTZXQoKSk7XG4gICAgZm9yIChjb25zdCBhY3Rpb25OYW1lIG9mIGFjdGlvbk5hbWVzKSB7XG4gICAgICAgIG1hY2hpbmVbYWN0aW9uTmFtZV0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbZXhwb3J0cy5TVEFURV1bYWN0aW9uTmFtZV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIG1hY2hpbmVbZXhwb3J0cy5TVEFURV0gPSBkZXNjcmlwdGlvbltleHBvcnRzLlNUQVRFU11bZGVzY3JpcHRpb25bZXhwb3J0cy5TVEFSVElOR19TVEFURV1dO1xuICAgIHJldHVybiBtYWNoaW5lO1xufVxuZXhwb3J0cy5TdGF0ZU1hY2hpbmUgPSBTdGF0ZU1hY2hpbmU7XG4iXSwic291cmNlUm9vdCI6IiJ9