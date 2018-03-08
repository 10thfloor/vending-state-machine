export const STATES = Symbol("states");
export const STARTING_STATE = Symbol("starting-state");
export const STATE = Symbol("current-state");

export function transitionTo(nextState, fn) {
  return function(...args) {
    const returnValue = fn.apply(this, args);
    this[STATE] = this[STATES][nextState];
    return returnValue;
  };
}

export function StateMachine(description) {
  const machine = {};

  const propsAndMethods = Object.keys(description);
  for (const prop of propsAndMethods) {
    machine[prop] = description[prop];
  }

  machine[STATES] = description[STATES];
  const actionNames = Object.entries(description[STATES]).reduce(
    (names, [state, stateDescription]) => {
      const actionNamesForState = Object.keys(stateDescription);
      for (const actionName of actionNamesForState) {
        names.add(actionName);
      }
      return names;
    },
    new Set()
  );

  for (const actionName of actionNames) {
    machine[actionName] = function(...args) {
      return this[STATE][actionName].apply(this, args);
    };
  }

  machine[STATE] = description[STATES][description[STARTING_STATE]];
  return machine;
}
