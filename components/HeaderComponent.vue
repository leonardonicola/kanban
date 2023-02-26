<template>
  <header
    class="flex items-center justify-between px-5 h-24 w-full bg-charcoal"
  >
    <select class="block md:hidden" v-model="boardInView">
      <option v-for="board in boards" :value="board.id">
        {{ board.name }}
      </option>
    </select>
    <h2 class="hidden md:block">{{ boardName }}</h2>
    <button
      @click="toggleFormModal(true)"
      class="hidden md:block bg-savoy rounded-3xl px-5 py-3 font-semibold hover:scale-105 transition"
    >
      + ADD TASK
    </button>
    <Bars2Icon class="md:hidden w-10 h-10" @click="() => (isMenuOpen = true)" />

    <transition name="fade">
      <div
        v-if="isMenuOpen"
        class="center-fixed w-full h-full bg-neutral-800 flex flex-col gap-10 items-center justify-center font-bold z-20"
      >
        <NuxtLink to="/" class="border-b p-2">HOME</NuxtLink>
        <p class="border-b p-2" @click="openBoardModal">+ CREATE NEW BOARD</p>
        <p class="border-b p-2" @click="toggleFormModal(true)">+ ADD TASK</p>
        <XMarkIcon
          class="w-10 h-10 absolute top-8 right-5 z-10"
          @click="() => (isMenuOpen = false)"
        />
      </div>
    </transition>
  </header>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
import { Bars2Icon, XMarkIcon } from "@heroicons/vue/24/outline";

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
const boardFormState = isBoardFormOpen();
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();
const boardInView = ref<number>(boardId);
const isMenuOpen = ref<boolean>(false);

//Methods
const toggleFormModal = (isOpen: boolean): void => {
  taskToEditState.value = null;
  isFormOpenState.value = isOpen;
  isMenuOpen.value = false;
};

const openBoardModal = (): void => {
  boardFormState.value = true;
  isMenuOpen.value = false;
};

//Watcher for when user changes the board he wants to view in mobile
watch(boardInView, () => {
  router.push(boardInView.value.toString());
});
</script>
