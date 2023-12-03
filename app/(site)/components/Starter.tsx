"use client";
import { useSession } from "next-auth/react";
import React, { useState, useRef } from "react";

import PostModal from "./PostModal";
import Button from "@/app/components/Button";

interface StarterProps {
  switch: () => void;
}

function Starter(props: StarterProps) {
  const [postModal, setPostModal] = useState(false);
  const { data: session } = useSession();

  const modalRef = useRef<HTMLInputElement>(null);

  function openPostModal() {
    setPostModal((prev) => !prev);
  }

  function closePostModal(e: any) {
    if (modalRef.current === e.target) {
      openPostModal();
    }
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
          <div
            ref={modalRef}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-10"
            onClick={(e) => closePostModal(e)}
          >
            <PostModal openPostModal={openPostModal} />
          </div>
        </>
      )}
    </>
  );
}

export default Starter;
