<template>
  <div
    v-for="column in getBoardColumns(boardId)"
    :key="column.id"
    class="w-80 overflow-y-auto select-none"
    @drop="onDrop($event, column.id)"
    @dragenter.prevent
    @dragover.prevent
  >
    <div
      :class="columnIdUnderEdit === column.id ? '' : 'hover:bg-charcoal'"
      class="flex justify-between gap-2 items-center w-full py-4 mb-5 pl-2 bg-mauve rounded-xl transition-colors ease-out cursor-pointer"
      @click.self="toggleColumnForm(column.id, column.name)"
    >
      <form
        @submit.prevent="changeColumnName(column.id)"
        v-if="columnIdUnderEdit === column.id"
        class="flex w-full gap-2"
      >
        <input
          type="text"
          required
          autofocus
          class="text-marengo tracking-widest"
          v-model="columnEditedName"
        />
        <input type="submit" name="submit" value="✓" />
      </form>
      <p
        v-else
        @click.self="toggleColumnForm(column.id, column.name)"
        class="text-marengo"
      >
        {{ column.name.toUpperCase() }} ({{ countTasks(column.id) }})
      </p>
    </div>

    <TransitionGroup tag="div" name="tasks" class="flex flex-col gap-5">
      <TaskCard
        v-for="task in getColumnTasks(boardId, column.id)"
        :key="task.id"
        :task-name="task.name"
        draggable="true"
        @click="openEditForm(task, column.id)"
        @dragstart="startDrag($event, task, column.id)"
      />
    </TransitionGroup>
  </div>

  <div
    class="w-80 h-full flex flex-col items-center justify-center rounded-xl cursor-pointer bg-gradient-to-b from-charcoal"
    @click.self="() => (isCreatingColumn = true)"
  >
    <h2
      class="text-2xl font-bold text-marengo hover:text-indigo-600 transition-colors"
      @click.self="() => (isCreatingColumn = true)"
    >
      + New Column
    </h2>
    <transition name="fade">
      <div
        v-if="isCreatingColumn"
        class="mt-10 flex flex-col justify-center text-base font-semibold"
      >
        <input
          type="text"
          v-model="newColumnName"
          @keyup.enter="createColumn"
          autofocus
        />
        <div class="flex justify-between gap-5 mt-4">
          <button class="rounded-xl bg-savoy px-4" @click="createColumn">
            Add Column
          </button>
          <button @click="() => (isCreatingColumn = false)">
            <XMarkIcon class="w-10 h-10" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useKanbanStore } from "~~/stores/kanban";
//Route
const route = useRoute();
const boardId = Number(route.params.board);

//Store
const store = useKanbanStore();
const {
  getBoardColumns,
  getColumnTasks,
  editTask,
  createNewColumn,
  editColumnName,
} = store;

//Refs
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

//Edit column
const columnIdUnderEdit = ref<number | null>(null);
const columnEditedName = ref<string>("");

//Create column
const isCreatingColumn = ref<boolean>(false);
const newColumnName = ref<string>("");

//Methods
const toggleColumnForm = (columnId: number | null, columnOgName: string) => {
  columnIdUnderEdit.value = columnId;
  columnEditedName.value = columnOgName;
};

const changeColumnName = (columnId: number) => {
  if (useValidator(columnEditedName.value)) {
    editColumnName(boardId, columnId, columnEditedName.value);
    toggleColumnForm(null, "");
  }
};

const openEditForm = (task: Task, columnId: number): void => {
  isFormOpenState.value = true;
  taskToEditState.value = { ...task, columnParentId: columnId };
  columnIdUnderEdit.value = null;
};

const createColumn = (): void => {
  if (useValidator(newColumnName.value)) {
    createNewColumn(boardId, newColumnName.value);
    newColumnName.value = "";
    isCreatingColumn.value = false;
  }
};

const startDrag = (
  event: DragEvent,
  item: Task,
  fromColumnId: number
): void => {
  event.dataTransfer!.dropEffect = "move";
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("itemID", item.id);
  event.dataTransfer!.setData("fromColumnId", fromColumnId.toString());
};

const onDrop = (event: DragEvent, columnId: number): void => {
  const itemID = event.dataTransfer!.getData("itemID");
  const fromColumnId = Number(event.dataTransfer!.getData("fromColumnId"));
  const item = getColumnTasks(boardId, fromColumnId).find(
    (task) => task.id === itemID
  );
  editTask(boardId, fromColumnId, columnId, item!);
};

const countTasks = (columnId: number): number => {
  return getColumnTasks(boardId, columnId).length;
};
</script>
