import MyButton from './components/MyButton.vue';

declare module 'vue' {
  interface GlobalComponents {
    MyButton: typeof MyButton;
  }
}

export { MyButton };
