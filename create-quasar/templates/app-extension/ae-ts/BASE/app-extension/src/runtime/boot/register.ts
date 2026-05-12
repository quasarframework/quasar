import { defineBoot } from '@quasar/app-vite';
import MyButton from '../components/MyButton.vue';

export default defineBoot(({ app }) => {
  app.component('MyButton', MyButton);
});
