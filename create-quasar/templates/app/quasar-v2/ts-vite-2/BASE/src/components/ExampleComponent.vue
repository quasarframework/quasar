<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>
<% if (sfcStyle === 'composition-setup') { %>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo, Meta } from './models';

interface Props {
  title: string;
  todos?: Todo[];
  meta: Meta;
  active: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  todos: () => []
});

const clickCount = ref(0);
function increment() {
  clickCount.value += 1;
  return clickCount.value;
}

const todoCount = computed(() => props.todos.length);
</script><% } else if (sfcStyle === 'composition') { %>
<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  toRef,
  type PropType,
  type Ref,
} from 'vue';
import type { Todo, Meta } from './models';

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'ExampleComponent',

  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => []
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },

  setup (props) {
    return { ...useClickCount(), ...useDisplayTodo(toRef(props, 'todos')) };
  }
});
</script><% } else if (sfcStyle === 'options') { %>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Todo, Meta } from './models';

export default defineComponent({
  name: 'ExampleComponent',

  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [] as Todo[]
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },

  data(): { clickCount: number } {
    return {
      clickCount: 0
    };
  },

  methods: {
    increment (): void {
      this.clickCount += 1;
    }
  },

  computed: {
    todoCount (): number {
      return this.todos.length;
    }
  }
});
</script><% } %>
