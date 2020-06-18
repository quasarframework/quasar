import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { ExampleStateInterface } from './state';

const getters: GetterTree<ExampleStateInterface, StoreInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
