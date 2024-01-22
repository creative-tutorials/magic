import { Dispatch, SetStateAction } from "react";

export type CommandState = {
  openSetter: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};
export type OptionalCommandState = Omit<CommandState, "isOpen">;
