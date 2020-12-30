export interface ExampleStateInterface {
  prop: boolean;
}

function state(): ExampleStateInterface {
  return {
    prop: false,
  };
}

export default state;
