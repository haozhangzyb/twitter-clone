import { useRef, type FC, useState } from "react";
import Button from "./Button";
import { useSession } from "next-auth/react";
import Avatar from "./Avatar";
import useAutoResizeTextArea from "~/hooks/useAutoResizeTextArea";

const NewTweetForm: FC = ({}) => {
  const { data: sessionData } = useSession();

  const [inputVal, setInputVal] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextArea(textAreaRef.current, inputVal);

  if (!sessionData) return null;

  return (
    <form className="flex gap-2 border-b border-b-slate-600 px-4 py-2">
      <Avatar src={sessionData.user.image} />
      <div className="flex w-full flex-col gap-4">
        <textarea
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          ref={textAreaRef}
          className="flex-grow resize-none overflow-hidden border-b border-b-slate-600 bg-transparent p-4 text-lg font-semibold outline-none"
          placeholder="What's happening?"
        />
        <Button className="self-end">Submit</Button>
      </div>
    </form>
  );
};

export default NewTweetForm;
