const Bubble = {
  bind(el, binding, vnode) {
    Object.keys(binding.modifiers).forEach(event => {
      // Bubble events of Vue components
      if (vnode.componentInstance) {
        vnode.componentInstance.$on(event, (...args) => {
          vnode.context.$emit(event, ...args);
        });
      } else { // Bubble events of native DOM elements
        el.addEventListener(event, payload => {
          vnode.context.$emit(event, payload);
        });
      };
    });
  },
};

export default Bubble;
