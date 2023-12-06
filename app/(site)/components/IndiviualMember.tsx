"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import { useSession } from "next-auth/react";

import {
  renewYesterdayPoint,
  undoPoint,
  removeMember,
  updateName,
} from "@/server/actions";
import { TiHeartFullOutline } from "react-icons/ti";
import { TiArrowBackOutline } from "react-icons/ti";
import { FaUndoAlt } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBin6Fill } from "react-icons/ri";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

interface IndiviualMemberProps {
  member: any;
  index: number;
  switchStatus?: boolean;
}

let date = dayjs(new Date()).tz("Asia/Taipei");

function IndiviualMember(props: IndiviualMemberProps) {
  const [flipCard, setFlipCard] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [updateNameBtn, setUpdateNameBtn] = useState<boolean>(false);
  const { member, index, switchStatus } = props;
  const { data: session } = useSession();

  function flipCardSwitch() {
    setFlipCard((prev) => !prev);
  }

  function manuallySubmit(e: any, type?: string) {
    const form = e.target.form;
    form.requestSubmit();
    if (type) {
      setUpdateNameBtn(false);
    } else {
      setFlipCard((prev) => !prev);
    }
  }

  let today = date.format("YYYY-MM-DD");

  return (
    <>
      {!flipCard && (
        <>
          <div
            className="flex w-full p-2 rounded-lg h-[65px] overflow-auto gap-1"
            style={
              today === member.timeStamp
                ? { background: "rgb(236 252 203)" }
                : { background: "white" }
            }
            onClick={
              today === member.timeStamp || !session || switchStatus
                ? () => {}
                : () => flipCardSwitch()
            }
          >
            <div className="flex w-full items-center space-x-1">
              <div className="hidden border-solid border-2 border-black rounded h-full sm:block">
                <Image
                  className="w-full h-full"
                  src="/defaultDP.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
              </div>
              <div className="text-lg whitespace-nowrap">{member.name}</div>
              {switchStatus && (
                <>
                  <button
                    id="svgBtn"
                    type="button"
                    className="text-2xl hover:text-red-600 cursor-pointer"
                    onClick={() => setUpdateNameBtn(!updateNameBtn)}
                  >
                    <RiPencilFill />
                  </button>
                  {/* 刪除表單 */}
                  <form
                    className="flex text-2xl hover:text-red-600 cursor-pointer"
                    action={removeMember}
                  >
                    <input type="hidden" name="id" value={member.id} />
                    <button id="svgBtn" type="submit">
                      <RiDeleteBin6Fill />
                    </button>
                  </form>
                </>
              )}
            </div>

            <div className="flex w-full items-center justify-center whitespace-nowrap gap-1">
              {session && (
                // undo表單
                <form
                  className="cursor-pointer hover:text-red-600"
                  action={undoPoint}
                >
                  <input type="hidden" name="id" value={member.id} />
                  <input
                    type="hidden"
                    name="undoTodo"
                    value={member.undoTotal}
                  />
                  <input
                    type="hidden"
                    name="undoYesterday"
                    value={member.undoYesterday}
                  />
                  <input
                    type="hidden"
                    name="undoSevendaysum"
                    value={member.undoSevendaysum}
                  />
                  {!switchStatus && member.timeStamp === today && (
                    <button
                      id="svgBtn"
                      type="submit"
                      className="bg-transparent"
                    >
                      <FaUndoAlt />
                    </button>
                  )}
                </form>
              )}
              <div>
                {dayjs().day() === 1 ? "上週貢獻：" : "本週貢獻："}
                {member.sevendaysum.toLocaleString("en-US")}
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div className="flex flex-row w-full items-center justify-end text-2xl">
                <span className="text-pink-800">
                  <TiHeartFullOutline
                    fill="rgb(255, 131, 152)"
                    strokeWidth="2"
                  />
                </span>
                <span>{member.total}</span>
              </div>
              <div className="flex justify-end">
                <div>昨日：{member.yesterday}</div>
              </div>
            </div>
          </div>
          {/* 改名表單 */}
          {switchStatus && (
            <form
              action={updateName}
              className="relative top-[-5px] w-full rounded-b-lg overflow-hidden duration-300"
              style={updateNameBtn ? { height: "30px" } : { height: "0px" }}
            >
              <div className="flex w-full rounded-b-lg bg-black ">
                <input type="hidden" name="id" value={member.id} />
                <input
                  type="text"
                  name="name"
                  value={newName}
                  placeholder="更改名稱"
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border-solid border-2 border-black px-2 rounded-bl-lg"
                />
                <button
                  type="submit"
                  className="relative right-1 border-solid border-2 border-black bg-black text-white rounded-br-lg"
                  onClick={(e) => manuallySubmit(e, "改名")}
                >
                  Enter
                </button>
              </div>
            </form>
          )}
        </>
      )}
      {flipCard && (
        <div
          key={index}
          className="flex w-full bg-violet-200 p-2  rounded-lg h-[65px] overflow-auto gap-1"
        >
          <div className="flex w-full items-center space-x-1 basis-1/4">
            <div className="text-lg">{member.name}</div>
          </div>
          {/* 昨日貢獻表單 */}
          <form
            className="flex w-full basis-3/4 gap-1 items-center"
            action={renewYesterdayPoint}
          >
            <input
              type="number"
              name="yesterdayPoint"
              className="w-[80px] h-[40px] p-2"
              placeholder="昨日貢獻"
              required
            />
            <input
              type="hidden"
              name="id"
              value={member.id}
              placeholder="族員id"
            />
            <input
              type="hidden"
              name="undoTotal"
              value={member.total}
              placeholder="總貢獻"
            />
            <input
              type="hidden"
              name="undoYesterday"
              value={member.yesterday}
              placeholder="昨日貢獻"
            />
            <input
              type="hidden"
              name="undoSevendaysum"
              value={member.sevendaysum}
              placeholder="七日貢獻"
            />
            <input
              type="hidden"
              name="timeStampCheck"
              value={member.timeStamp}
              placeholder="日期確認"
            />
            <input
              type="hidden"
              name="timeStamp"
              value={today}
              placeholder="今天日期"
            />
            <button
              id="svgBtn"
              type="submit"
              onClick={(e) => manuallySubmit(e)}
            >
              Enter
            </button>
            <div
              className="text-3xl scale-x-[-1] cursor-pointer  hover:text-red-600"
              onClick={() => flipCardSwitch()}
            >
              <TiArrowBackOutline />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default IndiviualMember;
