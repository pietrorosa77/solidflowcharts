import { IChart } from "../../definitions";
import { cloneDeep, isEqual, merge } from "lodash";

type UndoRedoState = {
  past: IChart[];
  present: IChart;
  future: IChart[];
};
export class UndoRedoManager {
  current: UndoRedoState;

  constructor(initialState: IChart) {
    this.current = {
      past: [],
      present: initialState,
      future: [],
    };
  }

  reducer = (
    oldState: UndoRedoState,
    action: {
      type: "undo" | "redo" | "save" | "reset";
      payload?: IChart;
      merge?: boolean;
    },
  ): UndoRedoState => {
    const { past, present, future } = oldState;
    let ret = {
      ...oldState,
    };

    switch (action.type) {
      case "undo":
        if (past.length > 0) {
          const previous = past[past.length - 1];
          const newPast = past.slice(0, past.length - 1);
          ret = {
            past: newPast,
            present: previous,
            future: [present, ...future],
          };
        }
        break;

      case "redo":
        if (future.length > 0) {
          const next = future[0];
          const newFuture = future.slice(1);

          ret = {
            past: [...past, present],
            present: next,
            future: newFuture,
          };
        }

        break;

      case "save":
        if (!present || !isEqual(action.payload, present)) {
          if (!action.merge) {
            ret = {
              past: [...past, present],
              present: action.payload as IChart,
              future: [],
            };
          } else {
            ret.present = merge(ret.present, action.payload as IChart);
          }
        }
        break;

      case "reset":
        ret = {
          past: [],
          present: action.payload as IChart,
          future: [],
        };
        break;
    }

    return ret;
  };

  save(currentState: IChart, action: string): IChart {
    const normalState = cloneDeep(currentState);
    this.current = this.reducer(this.current, {
      type: "save",
      payload: normalState as any,
      merge: action === "onNodeSizeChanged",
    }) as UndoRedoState;
    return this.current.present;
  }

  canUndo(): boolean {
    return this.current.past.length > 0;
  }

  canRedo(): boolean {
    return this.current.future.length > 0;
  }

  undo() {
    this.current = this.reducer(this.current, { type: "undo" });
    return cloneDeep(this.current.present);
  }

  redo() {
    this.current = this.reducer(this.current, { type: "redo" });
    return cloneDeep(this.current.present);
  }
}
