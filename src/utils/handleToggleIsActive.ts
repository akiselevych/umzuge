import { editEmployee } from "reduxFolder/slices/Table.slice"
import { AppDispatch } from "types"
import { IEmployee } from "types/tables"

export function handleToggleIsActive(employee: IEmployee, dispatch: AppDispatch) {
  const data = {
    is_active: !employee.is_active,
  }
  dispatch(editEmployee({ id: +employee.id, data: data }))
}
