import { boot } from 'quasar/wrappers';
import MyButton from '../components/MyButton.vue';

export default boot(({ app }) => {
  app.component('MyButton', MyButton);
});
