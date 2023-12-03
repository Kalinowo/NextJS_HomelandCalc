"use client";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";

import axios from "axios";
import Button from "@/app/components/Button";
import { FaTimes } from "react-icons/fa";

interface PostModalProps {
  openPostModal: () => void;
}

const PostModal = (props: PostModalProps) => {
  const { data: session } = useSession();
  const { openPostModal } = props;
  const modalRef = useRef<HTMLInputElement>(null);
  const [memberName, setMemberName] = useState<string>("");
  const [memberTotal, setMemberTotal] = useState<any>("");
  const [memberYesterday, setMemberYesterday] = useState<any>("");

  function closePostModal(e: any) {
    if (modalRef.current === e.target) {
      openPostModal();
    }
  }

  const postMember = (e: any) => {
    e.preventDefault();
    let total = parseInt(memberTotal, 10);
    let yesterday = parseInt(memberYesterday, 10);
    axios
      .post("/api/member/new", {
        name: memberName,
        family: session?.user?.name,
        total,
        yesterday,
      })
      .then(() => {
        console.log("成功");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div
        ref={modalRef}
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-10"
        onClick={(e) => closePostModal(e)}
      >
        <div className="">
          <div className="flex justify-center items-center w-[300px] h-auto bg-white border-solid border-2 border-black p-5 rounded-md">
            <form className="w-full flex flex-col gap-2" onSubmit={postMember}>
              <div className="flex flex-row relative border-solid border-2 border-black rounded-md">
                <input
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  type="text"
                  placeholder="族員名稱"
                  className="p-2 w-full outline-none border-none rounded-md"
                />
                <div className="relative right-1 flex items-center h-[40px]">
                  <FaTimes
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => setMemberName("")}
                  />
                </div>
              </div>
              <div className="flex flex-row relative border-solid border-2 border-black rounded-md">
                <input
                  value={memberTotal}
                  onChange={(e) => setMemberTotal(e.target.value)}
                  type="text"
                  placeholder="總貢獻"
                  className="p-2 w-full outline-none border-none rounded-md"
                />
                <div className="relative right-1 flex items-center h-[40px]">
                  <FaTimes
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => setMemberTotal("")}
                  />
                </div>
              </div>
              <div className="flex flex-row relative border-solid border-2 border-black rounded-md">
                <input
                  value={memberYesterday}
                  onChange={(e) => setMemberYesterday(e.target.value)}
                  type="text"
                  placeholder="昨日貢獻"
                  className="p-2 w-full outline-none border-none rounded-md"
                />
                <div className="relative right-1 flex items-center h-[40px]">
                  <FaTimes
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => setMemberYesterday("")}
                  />
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  type="submit"
                  flexBasis="60%"
                  onClick={() => postMember}
                >
                  確定
                </Button>
                <Button type="button" onClick={openPostModal} flexBasis="40%">
                  取消
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModal;
