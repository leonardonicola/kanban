interface Base {
  id: number;
  name: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
}

interface Column extends Base {
  tasks: Task[];
}

interface Board extends Base {
  columns: Column[];
}

interface TaskToEdit extends Task{
  columnParentId: number
}
