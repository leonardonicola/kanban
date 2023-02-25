export const isTaskFormOpen = () => useState<boolean>('isTaskFormOpen', () => false)
export const taskToEdit = () => useState<TaskToEdit | null>('taskToEdit', () => null)
export const isBoardFormOpen = () => useState<boolean>('isBoardFormOpen', () => false)