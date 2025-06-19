export type Section = {
    name: string,
    func: () => void
}

export type TopProps = {
    header: string,
    sections: Section[],
    logoutFunc: () => void,
    accountFunc: () => void
}

export default function Top(props: TopProps){
    return (
        <>
            <header className="bg-blue-500 text-white text-4xl p-5">
                {props.header}
            </header>
            <nav className="bg-blue-200 flex">
                {
                    props.sections.map(
                        i => <div onClick={i.func} className="p-2 text-2xl hover:bg-blue-500 hover:text-white hover:cursor-pointer">
                            {i.name}
                        </div>
                    )
                }
                <div className="ml-auto flex">
                    <div
                        onClick = {props.logoutFunc} 
                        className="p-2 text-2xl hover:bg-blue-500 hover:text-white hover:cursor-pointer">
                            Log out
                    </div>
                    <img
                        onClick = {props.accountFunc}
                        src="/images/avatar.png"
                        className="w-12 h-12"
                    />
                    <div></div>
                </div>
            </nav>
        </>
    )
}