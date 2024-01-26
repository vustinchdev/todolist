import { FC, memo, useCallback, useEffect } from "react"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { Task } from "./Task/Task"
import { TaskDomain, tasksThunks } from "../model/tasks/tasksSlice"
import { TodolistDomain, FilterValues } from "../model/todolists/todolistsSlice"
import { EditableSpan, AddItemForm, ButtonWithMemo } from "common/components"
import { TaskStatuses } from "common/enums"
import { useAppDispatch } from "common/hooks"

type TodoLisPropsType = {
  todolist: TodolistDomain
  demo?: boolean
  tasks: TaskDomain[]
  removeTask: (todolistId: string, taskId: string) => void
  changeFilter: (todolistId: string, value: FilterValues) => void
  addTask: (todolistId: string, title: string) => void
  changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
  removeTodolist: (todolistId: string) => void
  changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
  changeTodolistTitle: (todolistId: string, title: string) => void
}

export const TodoList: FC<TodoLisPropsType> = memo(({ demo = false, ...props }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(tasksThunks.setTasks(props.todolist.id))
  }, [])

  const onAllClickHandler = useCallback(
    () => props.changeFilter(props.todolist.id, "all"),
    [props.changeFilter, props.todolist.id],
  )
  const onActiveClickHandler = useCallback(
    () => props.changeFilter(props.todolist.id, "active"),
    [props.changeFilter, props.todolist.id],
  )
  const onCompledClickHandler = useCallback(
    () => props.changeFilter(props.todolist.id, "completed"),
    [props.changeFilter, props.todolist.id],
  )

  const removeTodolist = () => {
    props.removeTodolist(props.todolist.id)
  }

  const addTask = useCallback(
    (newTitle: string) => {
      props.addTask(props.todolist.id, newTitle)
    },
    [props.addTask, props.todolist.id],
  )

  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.todolist.id, title)
    },
    [props.changeTodolistTitle, props.todolist.id],
  )

  let tasksForTodoList = props.tasks
  if (props.todolist.filter === "completed") {
    tasksForTodoList = props.tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  if (props.todolist.filter === "active") {
    tasksForTodoList = props.tasks.filter((t) => t.status === TaskStatuses.New)
  }

  return (
    <div className="todolist">
      <h3>
        <EditableSpan
          title={props.todolist.title}
          onClick={changeTodolistTitle}
          disabled={props.todolist.entityStatus === "loading"}
        />
        <IconButton aria-label="delete" onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm onClick={addTask} disabled={props.todolist.entityStatus === "loading"} />
      <ul>
        {tasksForTodoList?.map((t) => {
          return (
            <Task
              key={t.id}
              task={t}
              todolistId={props.todolist.id}
              removeTask={props.removeTask}
              changeTaskTitle={props.changeTaskTitle}
              changeTaskStatus={props.changeTaskStatus}
            />
          )
        })}
      </ul>
      <ButtonWithMemo
        variant={props.todolist.filter === "all" ? "outlined" : "contained"}
        color="success"
        onClick={onAllClickHandler}
        title="All"
      />
      <ButtonWithMemo
        variant={props.todolist.filter === "active" ? "outlined" : "contained"}
        color="primary"
        onClick={onActiveClickHandler}
        title="Active"
      />
      <ButtonWithMemo
        variant={props.todolist.filter === "completed" ? "outlined" : "contained"}
        color="error"
        onClick={onCompledClickHandler}
        title="Completed"
      />
    </div>
  )
})
