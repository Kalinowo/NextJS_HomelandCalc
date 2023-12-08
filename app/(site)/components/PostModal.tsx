"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/app/components/Button";
import { FaTimes } from "react-icons/fa";
import { addMember } from "@/server/actions";

import ActionSubmit from "../actionComponents/ActionSubmit";

interface PostModalProps {
  openPostModal: () => void;
}

const PostModal = (props: PostModalProps) => {
  const { data: session } = useSession();
  const { openPostModal } = props;

  return (
    <>
      <div className="flex justify-center items-center w-[300px] h-auto bg-white border-solid border-2 border-black p-5 rounded-md">
        <form className="w-full flex flex-col gap-2" action={addMember}>
          <input
            type="hidden"
            name="family"
            value={session?.user.name}
            placeholder="家族名稱"
            className="p-2 w-full outline-none border-none rounded-md"
            readOnly
          />
          <div className="flex flex-row relative border-solid border-2 border-black rounded-md">
            <input
              type="text"
              name="name"
              placeholder="族員名稱"
              className="p-2 w-full outline-none border-none rounded-md"
            />
            <div className="relative right-1 flex items-center h-[40px]">
              <FaTimes className="cursor-pointer hover:text-red-500" />
            </div>
          </div>
          <div className="flex flex-row relative border-solid border-2 border-black rounded-md">
            <input
              type="text"
              name="total"
              placeholder="總貢獻"
              className="p-2 w-full outline-none border-none rounded-md"
            />
            <div className="relative right-1 flex items-center h-[40px]">
              <FaTimes className="cursor-pointer hover:text-red-500" />
            </div>
          </div>
          <div className="flex flex-row relative border-solid border-2 border-black rounded-md">
            <input
              type="text"
              name="yesterday"
              placeholder="昨日貢獻"
              className="p-2 w-full outline-none border-none rounded-md"
            />
            <div className="relative right-1 flex items-center h-[40px]">
              <FaTimes className="cursor-pointer hover:text-red-500" />
            </div>
          </div>
          <div className="flex gap-1">
            <ActionSubmit />
            <Button type="button" onClick={openPostModal} flexBasis="40%">
              取消
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostModal;
