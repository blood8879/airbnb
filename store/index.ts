import { HYDRATE, createWrapper, MakeStore } from "next-redux-wrapper";
import { configureStore, combineReducers, AnyAction, CombinedState } from "@reduxjs/toolkit";
import {
    TypedUseSelectorHook,
    useSelector as useReduxSelector,
}  from "react-redux";
import user from "./user";
import common from "./common";
import auth from "./auth";
import registerRoom from "./registerRoom";
import searchRoom from "./searchRoom";
import room from "./room";

const rootReducer = combineReducers({
    common: common.reducer,
    user: user.reducer,
    auth: auth.reducer,
    registerRoom: registerRoom.reducer,
    searchRoom: searchRoom.reducer,
    room: room.reducer,
});

// interface IState {
//     user: 
// }

// const rootReducer = (state: IState | undefined, action: AnyAction): CombinedState<IState> => {
//     switch(action.type) {
//         case HYDRATE:
//             return { ...action.payload}
//         default: {
//             const combineReducer = combineReducers({
//                 common: common.reducer,
//                 user: user.reducer,
//                 auth: auth.reducer
//             });
//             return combineReducer(state, action)
//         }
//     }
// }

// 스토어의 타입
export type RootState = ReturnType<typeof rootReducer>;

let initialRootState: RootState;

const reducer = (state: any, action: any) => {
    if (action.type === HYDRATE) {
        if (state === initialRootState) {
            return {
                ...state,
                ...action.payload
            };
        }
        return state;
    }
    return rootReducer(state, action);
};

// 타입 지원되는 커스텀 useSelector 만들기
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

const initStore: MakeStore = () => {
    const store = configureStore({
        reducer,
        devTools: true,
    });
    initialRootState = store.getState();
    return store;
};

export const wrapper = createWrapper(initStore);