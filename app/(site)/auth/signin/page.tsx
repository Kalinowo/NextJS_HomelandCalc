"use client";
import React, { useState, useRef } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Button from "@/app/components/Button";

export default function SignIn() {
  const [showError, setShowError] = useState("");
  const { data: session, status } = useSession();

  const userNameRef = useRef<any>();
  const passwordRef = useRef<any>();

  const router = useRouter();

  async function onSubmit(e: any) {
    e.preventDefault();
    const res = await signIn("credentials", {
      name: userNameRef.current.value,
      hashedPassword: passwordRef.current.value,
      callbackUrl: "/",
      redirect: false,
    }).then((res: any) => {
      if (res) {
        //待修改, 讓error顯示到畫面上
        if (res.error) {
          setShowError(res.error);
        } else {
          router.push("/");
        }
      }
    });
  }

  function adminCreateAcc() {
    axios
      .post("/api/account/new", {
        name: userNameRef.current.value,
        hashedPassword: passwordRef.current.value,
      })
      .then(() => {
        console.log("成功");
      });
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="m-5 text-5xl">For Admin Only</div>
      <div className="text-xl">狀態：{session ? "登入中" : "未登入"}</div>
      <div>
        <div className="w-full flex flex-center flex-col">
          <div className="flex flex-col flex-center border-solid border-2 border-black rounded bg-slate-400">
            <form
              className="flex flex-col p-5 gap-2 "
              onSubmit={(e) => onSubmit(e)}
            >
              <div className="text-center text-3xl">會員登入</div>
              <div>
                <label htmlFor="username" className="text-xl">
                  Username:
                </label>
                <input
                  ref={userNameRef}
                  type="text"
                  id="username"
                  className="w-full rounded p-1"
                  placeholder="使用者名稱"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="text-xl">
                  Password:
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  id="password"
                  className="w-full rounded p-1"
                  placeholder="密碼"
                  required
                />
              </div>
              {showError && (
                <div className="text-red-300 font-bold text-center">
                  {showError}
                </div>
              )}
              <div className="flex mt-2">
                <Button
                  type="submit"
                  flexBasis="100%"
                  disabled={session ? true : false}
                >
                  Login
                </Button>
              </div>
            </form>
            <div className="flex justify-center items-center cursor-pointer">
              {session && session.user.id === "6569adb745bb0414761ee004" && (
                <div
                  className="hover:text-red-300"
                  onClick={() => adminCreateAcc()}
                >
                  管理員創建帳號
                </div>
              )}
            </div>
            <div className="flex justify-center gap-1 my-5">
              <Button
                type="button"
                onClick={() => {
                  signIn("google", { redirect: false });
                }}
                disabled={session ? true : false}
              >
                Google Login
              </Button>
              <Button
                type="button"
                onClick={() => signOut()}
                disabled={session ? false : true}
              >
                Signout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
