"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import { RiPencilFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";

import { weeklyReset } from "@/server/weeklyreset";
import { replaceName } from "@/server/actions";

import SvgActionSubmit from "../actionComponents/SvgActionSubmit";
import IndiviualMember from "./IndiviualMember";
import Starter from "./Starter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

let date = dayjs(new Date()).tz("Asia/Taipei");

interface ListOfMembersProps {
  members: any;
  timeStamp: Array<any>;
}

function ListOfMembers(props: ListOfMembersProps) {
  const { members, timeStamp } = props;
  const { data: session, status, update } = useSession();
  const [selectFamily, setSelectFamily] = useState<string>("");
  const [replaceFamilyName, setReplaceFamilyName] = useState<string>("");
  const [manageSwitch, setManageSwitch] = useState<boolean>(false);
  const [faimlyNameSwitch, setFamilyNameSwitch] = useState<boolean>(false);

  useEffect(() => {
    const checkTimeStamp = async () => {
      if (timeStamp.length) {
        if (
          timeStamp[0].timeStamp !== date.weekday(2).format("YYYY-MM-DD") &&
          date.day() !== 0 &&
          date.day() !== 1
        ) {
          console.log("1");
          await weeklyReset(timeStamp[0].timeStamp);
        } else {
          console.log("2");
          return;
        }
      } else {
        return;
      }
    };
    checkTimeStamp();
  }, []);

  let familyCount = Array.from(
    new Set(members.map((member: any) => member.family))
  );

  function turnManageSwitch() {
    setManageSwitch((prev) => !prev);
  }

  if (status === "loading") {
    return <div>Loading data...</div>;
  }

  return (
    <>
      <Starter switch={turnManageSwitch} />
      {session && (
        <>
          <div className="flex text-3xl my-2 font-bold">
            <div className="relative">
              {session.user.name}
              <form
                className="absolute top-0 right-0 duration-100 overflow-hidden"
                style={faimlyNameSwitch ? { width: "200px" } : { width: "0px" }}
                action={async (formData) => {
                  await replaceName(formData)
                    .then(() => {
                      update({ name: replaceFamilyName });
                      setFamilyNameSwitch(false);
                    })
                    .catch((err) => console.log(err));
                }}
              >
                <input type="hidden" name="name" value={session.user.name} />
                <div className="flex border-solid border-2 border-black bg-white overflow-hidden w-full">
                  <input
                    type="text"
                    name="replaceName"
                    value={replaceFamilyName}
                    onChange={(e: any) => setReplaceFamilyName(e.target.value)}
                    className="w-full outline-none px-1"
                  />
                  <button
                    id="svgBtn"
                    type="submit"
                    className="border-left-solid border-l-2 border-black px-1 hover:text-red-400"
                  >
                    <SvgActionSubmit defaultButton={<FaCheck />} />
                  </button>
                </div>
              </form>
            </div>
            <button
              id="svgBtn"
              type="button"
              className="text-2xl hover:text-red-400 cursor-pointer"
              onClick={() => setFamilyNameSwitch(!faimlyNameSwitch)}
            >
              <RiPencilFill />
            </button>
          </div>

          <div className="flex flex-col gap-2 w-full px-4 py-2 border-solid border-2 border-black bg-red-50 rounded-xl">
            {members
              .filter((member: any) => member.family === session?.user.name)
              .map((member: any, index: number) => (
                <div key={member.id}>
                  <IndiviualMember
                    member={member}
                    index={index}
                    switchStatus={manageSwitch}
                  />
                </div>
              ))}
          </div>
        </>
      )}
      {!session && (
        <div className="flex w-full flex-col justify-center items-center">
          <div className="flex flex-col w-full justify-center items-center my-3 gap-1">
            {familyCount.map((family: any, index: number) => (
              <div
                key={index}
                className="w-full cursor-pointer hover:bg-slate-300 text-center rounded-md text-lg"
                style={
                  selectFamily === family
                    ? { background: "rgb(203 213 225)" }
                    : {}
                }
                onClick={() => setSelectFamily(family)}
              >
                {family}
              </div>
            ))}
          </div>
          {!(members.length === 0) && (
            <div className="flex flex-col gap-2 w-full px-4 py-2 border-solid border-2 border-black bg-red-50 rounded-xl">
              {members
                .filter((member: any) => member.family === selectFamily)
                .map((member: any, index: number) => (
                  <div key={index}>
                    <IndiviualMember member={member} index={index} />
                  </div>
                ))}
            </div>
          )}
          {members.length === 0 && <div>No Data Yet</div>}
        </div>
      )}
    </>
  );
}

export default ListOfMembers;
