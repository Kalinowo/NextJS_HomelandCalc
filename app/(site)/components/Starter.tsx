"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { useState } from "react";

import PostModal from "./PostModal";
import Button from "@/app/components/Button";

interface StarterProps {
  switch: () => void;
  memberLists: any;
  setMemberLists: any;
}

function Starter(props: StarterProps) {
  const [postModal, setPostModal] = useState(false);
  const { data: session } = useSession();

  function openPostModal() {
    setPostModal((prev) => !prev);
  }

  return (
    <>
      {session && (
        <div className="flex w-full flex-center gap-2 my-3">
          <Button type="button" onClick={openPostModal}>
            邀請
          </Button>
          <Button type="button" onClick={props.switch}>
            管理
          </Button>
        </div>
      )}
      {postModal && (
        <>
          <PostModal openPostModal={openPostModal} />
        </>
      )}
    </>
  );
}

export default Starter;
