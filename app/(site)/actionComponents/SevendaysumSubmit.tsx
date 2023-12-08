import { useFormStatus } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SevendaysumSubmit() {
  const { pending } = useFormStatus();
  return (
    <>
      <input
        type="number"
        name="yesterdayPoint"
        className="w-[80px] h-[40px] p-2"
        placeholder="昨日貢獻"
        disabled={pending}
        required
      />
      <button id="svgBtn" type="submit" className="hover:text-red-400">
        {pending ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          "Enter"
        )}
      </button>
    </>
  );
}
