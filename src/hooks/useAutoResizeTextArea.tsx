import { useEffect } from "react";

function useAutoResizeTextArea(
  textAreaRef: HTMLTextAreaElement | null,
  inputVal: string
) {
  useEffect(() => {
    if (!textAreaRef) return;

    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    textAreaRef.style.height = "0px";
    const scrollHeight = textAreaRef.scrollHeight;

    // We then set the height directly, outside of the render loop
    // Trying to set this with state or a ref will product an incorrect value.
    textAreaRef.style.height = `${scrollHeight}px`;
  }, [textAreaRef, inputVal]);
}

export default useAutoResizeTextArea;
