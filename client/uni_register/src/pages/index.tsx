import Link from "next/link";
export default function Home() {
  return (
    <div className="w-screen h-screen bg-[url('/images/backgroundImg1.png')] bg-cover bg-center">
      <div className="text-center text-4xl text-white">
        <div style={{"backgroundColor": "rgba(0, 0, 0, 0.5)"}} className="py-5">
          <h1 className="text-6xl">Welcome to UniRegister</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-10">
        <Link href="/signin" className="bg-sky-500 text-white p-5 m-2 w-70 rounded-xl hover:bg-pink-500">
          Sign in
        </Link>
        <Link href="/signup" className="bg-sky-500 text-white p-5 m-2 w-70 rounded-xl hover:bg-pink-500" >
          Sign up
        </Link>
        </div>
      </div>
      </div>
  );
}
