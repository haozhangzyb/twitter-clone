import { type FC } from "react";
import Button from "./Button";

const NewTweetForm: FC = ({}) => {
  return (
    <form className="flex gap-2 border-b border-b-slate-600 px-4 py-2">
      <div>Avatar Here</div>
      <div className="flex w-full flex-col gap-4">
        <textarea
          className="flex-grow resize-none overflow-hidden border-b border-b-slate-600 bg-transparent p-4 text-lg font-semibold outline-none"
          placeholder="What's happening?"
        />
        <Button className="self-end">Submit</Button>
      </div>
    </form>
  );
};

export default NewTweetForm;
