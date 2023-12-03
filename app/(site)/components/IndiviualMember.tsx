"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Button from "@/app/components/Button";
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
  memberLists?: any;
  setMemberLists?: any;
}

let date = dayjs(new Date()).tz("Asia/Taipei");

function IndiviualMember(props: IndiviualMemberProps) {
  const [flipCard, setFlipCard] = useState<boolean>(false);
  const [yesterdayPoint, setYesterdayPoint] = useState<any>("");
  const { member, index, switchStatus, memberLists, setMemberLists } = props;
  const { data: session } = useSession();
  const router = useRouter();

  function flipCardSwitch() {
    setFlipCard((prev) => !prev);
  }

  let today = date.format("YYYY-MM-DD");

  function renewYesterdayPoint(
    yesterdayPoint: any,
    id: String,
    undoTotal: any,
    undoYesterday: any,
    undoSevendaysum: any
  ) {
    let yesterday = parseInt(yesterdayPoint, 10);
    let sevendaysum = yesterday + undoSevendaysum;
    let total = yesterday + undoTotal;

    axios
      .post("/api/yesterday/renew", {
        id,
        total,
        yesterday,
        sevendaysum,
        undoYesterday,
        undoTotal,
        timeStamp: today,
      })
      .then(() => {
        router.refresh();
        setYesterdayPoint("");
        setFlipCard(false);
      });
  }

  function undoPoint(
    id: String,
    undoTotal: any,
    undoYesterday: any,
    undoSevendaysum: any
  ) {
    axios
      .post("/api/yesterday/undo", {
        id,
        undoTotal,
        undoYesterday,
        undoSevendaysum,
      })
      .then(() => {
        router.refresh();
      });
  }

  function removeMember(id: string) {
    axios
      .post("/api/member/remove", {
        id,
      })
      .then(() => {
        const newMemberList = memberLists.filter(
          (member: any) => member.id !== id
        );
        setMemberLists(newMemberList);
        router.refresh();
      });
  }

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
              <span
                className="text-2xl hover:text-red-600 cursor-pointer"
                onClick={() => removeMember(member.id)}
              >
                <RiDeleteBin6Fill />
              </span>
            )}
          </div>

          <div className="flex w-full items-center justify-center whitespace-nowrap gap-1">
            {session && (
              <span
                className="cursor-pointer hover:text-red-600"
                onClick={() =>
                  undoPoint(
                    member.id,
                    member.undoTotal,
                    member.undoYesterday,
                    member.undoSevendaysum
                  )
                }
              >
                <FaUndoAlt />
              </span>
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

          <div className="flex w-full basis-3/4 gap-1 items-center">
            <input
              value={yesterdayPoint}
              className="w-[80px] h-[40px] p-2"
              onChange={(e) => setYesterdayPoint(e.target.value)}
              type="number"
              placeholder="昨日貢獻"
            />
            <Button
              type="button"
              onClick={() =>
                renewYesterdayPoint(
                  yesterdayPoint,
                  member.id,
                  member.total,
                  member.yesterday,
                  member.sevendaysum
                )
              }
            >
              確定
            </Button>
            <div
              className="text-3xl scale-x-[-1] cursor-pointer"
              onClick={() => flipCardSwitch()}
            >
              <TiArrowBackOutline />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default IndiviualMember;
