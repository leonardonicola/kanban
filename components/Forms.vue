<template>
  <transition name="fade">
    <div
      class="center-fixed w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
      v-if="props.isFormOpen"
    >
      <div
        class="w-full h-5/6 md:w-1/3 md:h-4/5 flex flex-col p-8 bg-neutral-800 rounded-xl gap-10 relative m-10"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-neutral-900 p-3"
          @click="emits('closeForm')"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2 v-if="!!props.taskToEdit">Edit task</h2>
        <h2 v-else>Add new task</h2>

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
          v-if="!!props.taskToEdit"
          @click="editTaskInfos"
          class="bg-savoy p-2 rounded-lg font-semibold"
        >
          Edit Task
        </button>
        <button
          v-else
          @click="createNewTask"
          class="bg-savoy p-2 rounded-lg font-semibold"
        >
          Create Task
        </button>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
import { XMarkIcon } from "@heroicons/vue/24/outline";

//Emits and Props
const emits = defineEmits(["closeForm"]);
const props = defineProps<{
  isFormOpen: boolean;
  taskToEdit: TaskToEdit | null;
}>();

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
  if (isInputsValid()) {
    addTaskToColumn(boardId, taskColumn.value, newTask);
    resetValues();
    emits("closeForm");
  }
};

const editTaskInfos = (): void => {
  const editedTask = {
    id: props.taskToEdit!.id,
    name: taskName.value,
    description: taskDescription.value,
  };
  if (isInputsValid()) {
    editTask(
      boardId,
      props.taskToEdit!.columnParentId,
      taskColumn.value,
      editedTask
    );
    resetValues();
    emits("closeForm");
  }
};

const resetValues = (): void => {
  taskColumn.value = 1;
  taskName.value = "";
  taskDescription.value = "";
};

const isInputsValid = (): boolean => {
  if (taskName.value.match(/^$/) || taskDescription.value.match(/^$/))
    return false;
  else return true;
};

//Hooks
onBeforeUpdate(() => {
  //If it received a task to edit, then populate the refs with it values
  if (props.taskToEdit) {
    taskName.value = props.taskToEdit.name;
    taskDescription.value = props.taskToEdit.description;
    taskColumn.value = props.taskToEdit.columnParentId;
  } else {
    resetValues();
  }
});
</script>
