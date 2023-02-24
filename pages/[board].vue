<template>
  <section class="w-full overflow-hidden">
    <Forms
      :is-form-open="isFormOpen"
      :task-to-edit="taskToEdit!"
      @close-form="toggleFormModal(false)"
    />
    <HeaderComponent @open-modal="toggleFormModal(true)" />
    <div class="grid grid-flow-col gap-10 p-5 h-5/6 overflow-x-auto">
      <div
        v-for="column in getBoardColumns(boardId)"
        class="w-80 overflow-y-auto "
        @drop="onDrop($event, column.id)"
        @dragenter.prevent
        @dragover.prevent
      >
        <div class="mb-5 flex gap-2 items-center bg-mauve w-full py-4">
          <span class="text-marengo tracking-widest">{{ column.name.toUpperCase() }} ({{ countTasks(column.id) }})</span>
        </div>

        <div class="flex flex-col gap-5">
          <TaskCard
            v-for="task in getColumnTasks(boardId, column.id)"
            :task-name="task.name"
            draggable="true"
            @click="openEditForm(task, column.id)"
            @dragstart="startDrag($event, task, column.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores/kanban";

//Route
const route = useRoute();
const boardId = Number(route.params.board);

//Store
const store = useKanbanStore();
const { getBoardColumns, getColumnTasks, editTask } = store;

//Refs
const isFormOpen = ref<boolean>(false);
const taskToEdit = ref<TaskToEdit | null>();

//Methods
const openEditForm = (task: Task, columnId: number) => {
  toggleFormModal(true);
  taskToEdit.value = { ...task, columnParentId: columnId };
};

const toggleFormModal = (isOpen: boolean) => {
  isFormOpen.value = isOpen;
  taskToEdit.value = null;
};

const startDrag = (event: DragEvent, item: Task, fromColumnId: number) => {
  event.dataTransfer!.dropEffect = "move";
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("itemID", item.id);
  event.dataTransfer!.setData("fromColumnId", fromColumnId.toString());
};

const onDrop = (event: DragEvent, columnId: number) => {
  const itemID = event.dataTransfer!.getData("itemID");
  const fromColumnId = Number(event.dataTransfer!.getData("fromColumnId"));
  const item = getColumnTasks(boardId, fromColumnId).find(
    (task) => task.id === itemID
  );
  editTask(boardId, fromColumnId, columnId, item!);
};

const countTasks = (columnId: number) => {
  return getColumnTasks(boardId, columnId).length
}
</script>
