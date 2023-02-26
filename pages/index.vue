<template>
  <section class="w-full h-full p-10 overflow-y-auto">
    <h1 class="mb-24">Your boards:</h1>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-10">
      <div
        v-for="board in boards"
        class="rounded-2xl bg-savoy p-5 cursor-pointer w-full h-full hover:bg-red-400 transition-colors"
        @click="() => $router.push(`/${board.id}`)"
      >
        <ViewColumnsIcon class="w-10 h-10 mb-5" />
        <h2>{{ board.name }}</h2>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { useKanbanStore } from "~~/stores/kanban";

const store = useKanbanStore();
const { boards } = store;
</script>
