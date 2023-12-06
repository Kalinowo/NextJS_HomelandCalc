"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import IndiviualMember from "./IndiviualMember";
import Starter from "./Starter";

interface ListOfMembersProps {
  members: any;
}

function ListOfMembers(props: ListOfMembersProps) {
  const { members } = props;
  const { data: session, status } = useSession();
  const [selectFamily, setSelectFamily] = useState<string>("");
  const [manageSwitch, setManageSwitch] = useState<boolean>(false);

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
          <div className="text-3xl my-2 font-bold">{session.user.name}</div>
          <div className="flex flex-col gap-2 w-full px-4 py-2 border-solid border-2 border-black bg-red-50 rounded-xl">
            {members
              .filter((member: any) => member.family === session?.user.name)
              .map((member: any, index: number) => (
                <div key={index}>
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
