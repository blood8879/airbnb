import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import rooms from "../pages/api/rooms";
import { RoomState } from "../types/reduxState";
import { RoomType } from "../types/room";

const initialState: RoomState = {
    rooms: [],
    detail: null,
};

const room = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRooms(state, action: PayloadAction<RoomType[]>) {
            state.rooms = action.payload
        },
        // 상세 숙소 변경하기
        setDetailRoom(state, action: PayloadAction<RoomType>) {
            state.detail = action.payload;
        },
    },
});

export const roomActions = { ...room.actions };

export default room;