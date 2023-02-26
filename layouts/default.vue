<template>
  <main class="flex h-screen w-screen">
    <aside
      class="hidden md:block h-full w-96 bg-charcoal border-r border-white border-opacity-10 text-marengo overflow-y-auto"
    >
      <div class="w-full p-5">
        <NuxtLink to="/" exact-active-class="text-savoy"
          ><h1 class="mb-20">||| kanban</h1></NuxtLink
        >
        <p class="mb-5 tracking-widest">
          ALL BOARDS ({{ boardsCount }})
        </p>
      </div>
      <NuxtLink
        v-for="board in boards"
        :key="board.id"
        :to="`/${board.id}`"
        class="flex gap-2 px-5 py-2 mr-5 items-center"
        exact-active-class="bg-savoy rounded-r-3xl font-bold transition-colors ease-out duration-700"
      >
        <ViewColumnsIcon class="w-5 h-5" />
        {{ board.name }}
      </NuxtLink>
      <div class="px-5 py-2 mr-5 flex gap-2 items-center text-savoy cursor-pointer" @click="boardFormState = true">
        <ViewColumnsIcon class="w-5 h-5" />+ Create New Board
      </div>
    </aside>
    <BoardForm />
    <slot></slot>
  </main>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";

const boardFormState = isBoardFormOpen()

const store = useKanbanStore();
const { boards } = store;

const boardsCount = computed(() => {
  return boards.length;
});
</script>
