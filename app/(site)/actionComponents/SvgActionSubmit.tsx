import { useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { RiDeleteBin6Fill } from "react-icons/ri";

interface ActionSubmit {
  defaultButton: React.ReactNode;
}

export default function SvgActionSubmit(props: ActionSubmit) {
  const { defaultButton } = props;
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <AiOutlineLoading3Quarters className="animate-spin" />
      ) : (
        <>{defaultButton}</>
      )}
    </>
  );
}
