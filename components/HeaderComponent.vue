<template>
  <header
    class="flex items-center justify-between px-5 h-28 w-full bg-neutral-800 border-b border-neutral-600"
  >
    <select class="block md:hidden" v-model="boardInView">
      <option v-for="board in boards" :value="board.id">
        {{ board.name }}
      </option>
    </select>
    <h2 class="hidden md:block">{{ boardName }}</h2>
    <button
      @click="toggleFormModal(true)"
      class="bg-savoy rounded-3xl px-5 py-3 font-semibold"
    >
      + ADD TASK
    </button>
  </header>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";

//Route
const route = useRoute();
const router = useRouter();

//Store
const store = useKanbanStore();
const { boards } = store;

const boardId = Number(route.params.board);
const boardName = computed(() => {
  return boards.find((board) => board.id === boardId)?.name;
});

//Refs
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();
const boardInView = ref<number>(boardId);

//Methods
const toggleFormModal = (isOpen: boolean): void => {
  taskToEditState.value = null;
  isFormOpenState.value = isOpen;
};

//Watcher for when user changes the board he wants to view in mobile
watch(boardInView, () => {
  router.push(boardInView.value.toString());
});
</script>
