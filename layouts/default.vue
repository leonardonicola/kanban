<template>
  <main class="flex h-screen w-screen">
    <aside
      class="hidden md:block h-full w-1/3 lg:w-1/4 bg-neutral-800 border-r border-neutral-600 text-marengo overflow-y-auto"
    >
      <div class="w-full p-8">
        <NuxtLink to="/" exact-active-class="text-savoy"
          ><h1 class="mb-20">||| kanban</h1></NuxtLink
        >
        <p class="text-xl mb-5 tracking-widest">
          ALL BOARDS ({{ boardsCount }})
        </p>
      </div>
      <NuxtLink
        v-for="board in boards"
        :key="board.id"
        :to="`/${board.id}`"
        class="flex gap-2 px-8 py-3 mr-5 items-center"
        exact-active-class="bg-savoy rounded-r-3xl font-bold transition-colors ease-out duration-700"
      >
        <ViewColumnsIcon class="w-8 h-8" />
        {{ board.name }}
      </NuxtLink>
      <div class="px-8 py-3 mr-5 flex gap-2 items-center text-savoy cursor-pointer" @click="isBoardFormOpen = true">
        <ViewColumnsIcon class="w-8 h-8" />+ Create New Board
      </div>
    </aside>
    <BoardForm :is-form-open="isBoardFormOpen" @close-form="() => isBoardFormOpen = false"/>
    <slot></slot>
  </main>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";

const store = useKanbanStore();
const { boards } = store;

const isBoardFormOpen = ref<boolean>(false);

const boardsCount = computed(() => {
  return boards.length;
});
</script>
