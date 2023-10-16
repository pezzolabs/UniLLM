import { Message as AIMessage } from "ai";
import cn from "classnames";

interface Props {
  message: AIMessage;
}

export const Message = ({ message }: Props) => {
  const { role, content } = message;

  return (
    <div
      className={cn(
        "first:mt-4 flex flex-col mb-4 mx-4",
        role === "assistant" ? "" : "items-end",
      )}
    >
      <div className="inline-block max-w-[70%]">
        <div
          className={cn(
            "mb-1 ml-1 uppercase text-sm text-stone-200 font-semibold flex flex-col",
            role === "assistant" ? "" : "items-end",
          )}
        >
          {role === "user" ? "You" : "Assistant"}
        </div>
        <div
          className={cn(
            "rounded-xl p-4 text-stone-900 shadow-sm inline-block",
            role === "user" ? "bg-green-200" : "bg-stone-200",
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
