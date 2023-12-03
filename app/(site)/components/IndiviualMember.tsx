"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import { useSession } from "next-auth/react";
import Button from "@/app/components/Button";

import { renewYesterdayPoint, undoPoint, removeMember } from "@/server/actions";
import { TiHeartFullOutline } from "react-icons/ti";
import { TiArrowBackOutline } from "react-icons/ti";
import { FaUndoAlt } from "react-icons/fa";
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
  const { member, index, switchStatus } = props;
  const { data: session } = useSession();

  function flipCardSwitch() {
    setFlipCard((prev) => !prev);
  }

  let today = date.format("YYYY-MM-DD");

  return (
    <>
      {!flipCard && (
        <div
          className="flex w-full p-2  rounded-lg h-[65px] overflow-auto gap-1"
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
            <div className="relative text-lg whitespace-nowrap">
              {member.name}
            </div>
            {switchStatus && (
              //刪除表單
              <form
                className="text-2xl hover:text-red-600 cursor-pointer"
                action={removeMember}
              >
                <input type="hidden" name="id" value={member.id} />
                <button id="svgBtn" type="submit">
                  <RiDeleteBin6Fill />
                </button>
              </form>
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
                <input type="hidden" name="undoTodo" value={member.undoTotal} />
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
                <button id="svgBtn" type="submit" className="bg-transparent">
                  <FaUndoAlt />
                </button>
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
                <TiHeartFullOutline fill="rgb(255, 131, 152)" strokeWidth="2" />
              </span>
              <span>{member.total}</span>
            </div>
            <div className="flex justify-end">
              <div>昨日：{member.yesterday}</div>
            </div>
          </div>
        </div>
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
              name="timeStamp"
              value={today}
              placeholder="日期"
            />
            <Button type="submit">確定</Button>
            <div
              className="text-3xl scale-x-[-1] cursor-pointer"
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
