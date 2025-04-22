import Link from "next/link";
export default function Home() {
  return (
    <div className="text-2xl text-black flex flex-col justify-center items-center p-10">
        <h1 className="text-8xl text-sky-500 text-center">Sign up</h1>
        <form className="mt-10">
            <label>
                Email<br/>
                <input type="text"/>
            </label><br/>
            <label>
                Phone<br/>
                <input type="text"/>
            </label><br/>
            <label>
                First name<br/>
                <input type="text"/>
            </label><br/>
            <label>
                Last name<br/>
                <input type="text"/>
            </label><br/>
            <label>
                Username<br/>
                <input type="text"/>
            </label><br/>
            <label>
                Password<br/>
                <input type="password"/>
            </label><br/>
            <label>
                Sign up as a student?<br/>
                Yes <input type="checkbox"/>
            </label><br/>
            <input data-testid="button" type="submit" value="Sign up" className="bg-sky-500 text-white p-5 m-2 w-70 rounded-xl hover:bg-pink-500"/>
            <br/>
        </form>

    </div>
  );
}