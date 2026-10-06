import { notFound } from "next/navigation";
import DialoguePrototype from "../../../components/play/DialoguePrototype";

export default function DialoguePrototypePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DialoguePrototype />;
}
