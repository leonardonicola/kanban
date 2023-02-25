<template>
  <transition name="fade">
    <div
      v-if="isFormOpenState"
      class="center-fixed w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div
        class="w-full h-5/6 md:w-1/3 md:h-4/5 flex flex-col p-8 bg-neutral-800 rounded-xl gap-10 relative m-10"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-neutral-900 p-3"
          @click="toggleFormModal(false)"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2>{{ !!taskToEditState ? "Edit" : "Add" }} Task</h2>

        <div class="w-full h-full overflow-y-auto space-y-10 pr-8">
          <div class="flex flex-col space-y-2">
            <label for="task_name">Title</label>
            <input
              v-model.trim="taskName"
              type="text"
              name="task_name"
              placeholder="e.g Learn Nuxt.js"
            />
          </div>

          <div class="flex flex-col space-y-2 h-2/3 md:h-1/2 overflow-hidden">
            <label for="task_description">Description</label>
            <textarea
              v-model.trim="taskDescription"
              type="text"
              name="task_description"
              placeholder="e.g Learn how to generate server side rendered pages"
              class="h-full"
            />
          </div>

          <select name="status" v-model="taskColumn">
            <option
              v-for="column in getBoardColumns(boardId)"
              :key="column.id"
              :value="column.id"
            >
              {{ column.name }}
            </option>
          </select>
        </div>

        <button
          @click="!!taskToEditState ? editTaskInfos() : createNewTask()"
          class="bg-savoy p-2 rounded-lg font-semibold"
        >
          {{ !!taskToEditState ? "Edit" : "Add New" }} Task
        </button>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const toggleFormModal = (isOpen: boolean): void => {
  isFormOpenState.value = isOpen;
  taskToEditState.value = null;
};

//Route
const route = useRoute();
const boardId = Number(route.params.board);

//Store
const store = useKanbanStore();
const { addTaskToColumn, getBoardColumns, editTask } = store;

//Refs
const taskColumn = ref<number>(1);
const taskName = ref<string>("");
const taskDescription = ref<string>("");

//Methods
const createNewTask = (): void => {
  const newTask = {
    name: taskName.value,
    description: taskDescription.value,
  };
  if (useValidator(taskDescription.value, taskName.value)) {
    addTaskToColumn(boardId, taskColumn.value, newTask);
    resetValues();
    toggleFormModal(false);
  }
};

const editTaskInfos = (): void => {
  const editedTask = {
    id: taskToEditState.value!.id,
    name: taskName.value,
    description: taskDescription.value,
  };
  if (useValidator(taskDescription.value, taskName.value)) {
    editTask(
      boardId,
      taskToEditState.value!.columnParentId,
      taskColumn.value,
      editedTask
    );
    resetValues();
    toggleFormModal(false);
  }
};

const resetValues = (): void => {
  taskColumn.value = 1;
  taskName.value = "";
  taskDescription.value = "";
};

watch(taskToEditState, () => {
  if (taskToEditState.value !== null) {
    taskName.value = taskToEditState.value.name;
    taskDescription.value = taskToEditState.value.description;
    taskColumn.value = taskToEditState.value.columnParentId;
  } else {
    resetValues();
  }
});
</script>
