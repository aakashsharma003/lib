import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className={"flex justify-center item-center "}>
      <SignIn />
    </div>
  );
}
