import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useKanbanStore = defineStore("kanban", {
  state: (): State => ({
    boards: [
      {
        id: 1,
        name: "Studies",
        columns: [
          {
            id: 1,
            name: "Todo",
            tasks: [
              {
                id: "52a96e6f-1213-46f6-8ae3-6a8fb00b126e",
                name: "Título incrível",
                description: "Top 10 descrições do anime",
              },
            ],
          },
          {
            id: 2,
            name: "In Progress",
            tasks: [],
          },
          {
            id: 3,
            name: "Done",
            tasks: [],
          },
        ],
      },
    ],
  }),
  getters: {
    getBoardColumns:
      (state) =>
      (boardId: number): Column[] => {
        const findBoard = state.boards.find((board) => board.id === boardId);
        return findBoard!.columns;
      },
    getColumnTasks() {
      return (boardId: number, columnId: number): Task[] => {
        const column = this.getBoardColumns(boardId).find(
          (column) => column.id === columnId
        );
        return column!.tasks;
      };
    },
  },
  actions: {
    addTaskToColumn(
      boardId: number,
      columnId: number,
      taskInfos: Omit<Task, "id">
    ) {
      const newTask = { id: uuidv4(), ...taskInfos };
      this.boards
        .find((board) => board.id === boardId)!
        .columns.find((column) => column.id === columnId)!
        .tasks.push(newTask);
    },
    removeTaskFromColumn(boardId: number, columnId: number, editedTask: Task) {
      const boardTasks = this.getColumnTasks(boardId, columnId);
      const filteredTasks = boardTasks.filter(
        (task) => task.id !== editedTask.id
      );
      //Removing task from original column
      this.boards
        .find((board) => board.id === boardId)!
        .columns.find((column) => column.id === columnId)!.tasks =
        filteredTasks;
    },
    createNewBoard(boardName: string) {
      const boardTemplate: Board = {
        id: this.boards.length + 1,
        name: boardName,
        columns: [
          { id: 1, name: "Todo", tasks: [] },
          { id: 2, name: "In Progress", tasks: [] },
          { id: 3, name: "Done", tasks: [] },
        ],
      };
      //Modifing state
      this.boards.push(boardTemplate);
    },
    editTask(
      boardId: number,
      columnId: number,
      newColumnId: number,
      editedTask: Task
    ) {
      const boardTasks = this.getColumnTasks(boardId, columnId);

      //If it has a new status, remove from original column and add to new column
      if (newColumnId !== columnId) {
        this.removeTaskFromColumn(boardId, columnId, editedTask);
        this.addTaskToColumn(boardId, newColumnId, editedTask);
      } else {
        const modifiedTasks = boardTasks.map((task) =>
          task.id === editedTask.id ? editedTask : task
        );

        //Modifing state
        this.boards
          .find((board) => board.id === boardId)!
          .columns.find((column) => column.id === columnId)!.tasks =
          modifiedTasks;
      }
    },
    createNewColumn(boardId: number, columnName: string) {
      this.boards
        .find((board) => board.id === boardId)!
        .columns.push({
          id: this.getBoardColumns(boardId).length + 1,
          name: columnName,
          tasks: [],
        });
    },
    editColumnName(boardId: number, columnId: number, columnName: string){
      this.boards
        .find((board) => board.id === boardId)!
        .columns.find((column) => column.id === columnId)!.name = columnName
    }
  },
});
