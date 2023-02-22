import { defineStore } from "pinia";

export const useStore = defineStore("kanban", () => {
  const boards = [
    {
      id: 1,
      name: "Studies",
      columns: [
        {
          id: 1,
          name: "Todo",
          tasks: [
            {
              id: 1,
              name: "Study Nuxt.js",
              description: "Study some shit bitch",
            },
          ],
        },
      ],
    },
  ].map((board) => ({
    ...board,
    ref: ref(board),
  }));
});
