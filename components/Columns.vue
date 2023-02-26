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
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";
//Route
const route = useRoute();
const boardId = Number(route.params.board);

//Store
const store = useKanbanStore();
const { getBoardColumns, getColumnTasks, editTask, editColumnName } = store;

//Refs
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

//Edit column
const columnIdUnderEdit = ref<number | null>(null);
const columnEditedName = ref<string>("");

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
