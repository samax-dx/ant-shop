import { EditorModalMachine } from "./EditorModalMachine";
import { interpret } from "xstate";

const productEditMachine = interpret(EditorModalMachine);

productEditMachine.start();
export { productEditMachine };
