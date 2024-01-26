import { Dispatch, SetStateAction } from "react";
import { urlType } from "./url-type";

export type CommandState = {
  openSetter: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  url: urlType;
};
