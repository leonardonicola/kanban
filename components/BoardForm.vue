<template>
  <transition name="fade">
    <div
      v-if="props.isFormOpen"
      class="center-fixed w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div
        class="w-full h-5/6 md:w-1/3 md:h-1/2 flex flex-col p-8 bg-neutral-800 rounded-xl gap-10 relative m-10"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-neutral-900 p-3"
          @click="emits('closeForm')"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
        <h2>Create a New Board</h2>
        <div class="flex flex-col space-y-2 justify-between h-full">
          <div class="flex flex-col gap-5">
            <label for="task_name">Board Name</label>
            <input
              v-model.trim="boardName"
              type="text"
              name="task_name"
              placeholder="e.g Learn Nuxt.js"
            />
          </div>
        </div>
        <button
          @click="useCreateNewBoard"
          class="bg-savoy p-2 rounded-lg font-semibold"
        >
          CREATE BOARD
        </button>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
import { XMarkIcon } from "@heroicons/vue/24/outline";

//Props and emits
const props = defineProps<{ isFormOpen: boolean }>();
const emits = defineEmits(["closeForm"]);

//Route
const router = useRouter();

//Refs
const boardName = ref<string>("");

//Store
const store = useKanbanStore();
const { createNewBoard, boards } = store;

//Methods
const resetValues = (): void => {
  boardName.value = "";
};

const isInputsValid = (): boolean => {
  if (boardName.value.match(/^$/)) return false;
  else return true;
};

const useCreateNewBoard = () => {
  if (isInputsValid()) {
    createNewBoard(boardName.value);
    resetValues();
    emits("closeForm");
  }
  router.push(`/${boards.length}`);
};
</script>
