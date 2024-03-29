import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppRootStateType, ThunkDispatchType } from "app/store"
import { BaseResponse } from "common/types"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: ThunkDispatchType
  rejectValue: null | BaseResponse
}>()
