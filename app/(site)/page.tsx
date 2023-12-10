import { Suspense } from "react";
import Members from "./components/Member";

export const revalidate = 0;

export default async function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading data...</div>}>
        <Members />
      </Suspense>
    </>
  );
}
