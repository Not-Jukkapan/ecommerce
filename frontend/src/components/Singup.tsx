import { useState } from "react";
import { signup } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Singup() {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('') 
    const navigate = useNavigate()
    const testClick = async () => {
        const response = await signup({
            name, email, password
        });
        if (response.status === 200) {
            alert('Happy')
            navigate('/login')
        } else {
            setErrorMessage(response.error)
        }
    };
    return (
        <div className="flex flex-col border-red-800 border px-16 py-8 w-3/5">
            <div className=" ">Singup hehe</div>
            <form className="space-y-2 flex flex-col  px-4 py-2 " action="">
                <div className="flex justify-between">
                    <label htmlFor="name">name</label>
                    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="max-w-[20rem] flex-1 border focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-md" />
                </div>
                <div className="flex justify-between">
                    <label htmlFor="email">email</label>
                    <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-[20rem] flex-1 border focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-md" />
                </div>
                <div className="flex justify-between">
                    <label htmlFor="password">password</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="max-w-[20rem] flex-1 border focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-md" />
                </div>
            </form>
            <button className="rounded mx-4 px-4 py-2 border border-gray-200 bg-gray-100" onClick={testClick}>Test</button>
            {errorMessage && (
                <div className="text-red-400 text-center">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default Singup;
