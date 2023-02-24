<template>
  <header
    class="flex items-center justify-between px-5 h-28 w-full bg-neutral-800 border-b border-neutral-600"
  >
    <select class="block md:hidden" v-model="boardInView">
      <option v-for="board in boards" :value="board.id">{{ board.name }}</option>
    </select>
    <h2 class="hidden md:block">{{ boardName }}</h2>
    <button
      @click="emits('openModal')"
      class="bg-savoy rounded-3xl px-5 py-3 font-semibold"
    >
      + ADD TASK
    </button>
  </header>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";

const emits = defineEmits(["openModal"]);

const route = useRoute();
const router = useRouter()
const store = useKanbanStore();
const { boards } = store;

const boardId = Number(route.params.board);
const boardName = computed(() => {
  return boards.find((board) => board.id === boardId)?.name;
});

const boardInView = ref<number>(boardId)

watch(boardInView, () => {
  router.push(boardInView.value.toString())
})
</script>
