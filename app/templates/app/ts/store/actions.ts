import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { ExampleStateInterface } from './state';

const actions: ActionTree<ExampleStateInterface, StoreInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;
