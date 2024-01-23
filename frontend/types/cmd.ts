import { Dispatch, SetStateAction } from "react";

export type CommandState = {
  openSetter: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};