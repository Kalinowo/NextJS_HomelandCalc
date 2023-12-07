import { useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Button from "@/app/components/Button";

export default function ActionSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" flexBasis="60%" disabled={pending}>
      {pending ? (
        <AiOutlineLoading3Quarters className="animate-spin" />
      ) : (
        "Login"
      )}
    </Button>
  );
}
