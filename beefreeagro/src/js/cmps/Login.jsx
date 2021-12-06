import Homepage from './Homepage';
import { useEffect, useState } from "react";
import {userService} from "../services/user.service"
import userimg from '../../assets/img/userimg.png'
import emailround from '../../assets/img/emailround.png'
import passwordIcon from '../../assets/img/passwordIcon.png'
import username from '../../assets/img/username.png'
import showPassword from '../../assets/img/showPassword.png'
import unshowpassword from '../../assets/img/unshowpassword.png'
export const Login = () => {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isShowingPassword, setShowingPassword] = useState(false);
    const [user, setUser] = useState();

    useEffect( async ()=> {
        const user = userService.getLoggedinUser()
        if(user) {
            setUser(user)
        } else {
            const token = userService.getToken()
            const user = await userService.getUserDetails(token)
            setUser(user)
        }
        setIsLoading(false)
    },[])
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if(isSignup) {
            const user = await userService.signup({ email, displayName, password })
            setUser(user)
            setSignUp(false)
        } else {
            const user = await userService.login({ email, password })
            setUser(user)
        }
        setEmail('')
        setDisplayName('')
        setPassword('')
    }
    if (isLoading) return <div className="loader flex auto-center"></div>
    return (
        <div>
        {!user ? <div className="login-page flex auto-center column">
            <form onSubmit={handleSubmit} className='flex column auto-center'>
            <img src={userimg} alt="" className='user-img'/>
                <label>
                        <img src={emailround} alt="" />
                        <input type="email" value={email} placeholder="Email" onChange={(ev) => setEmail(ev.target.value)}/>
                </label>
                {isSignup && <label>
                    <img src={username} alt="" />
                    <input type="text" value={displayName} placeholder="Username" onChange={(ev) => setDisplayName(ev.target.value)}/>

                </label>}
                <label>
                    <img src={passwordIcon} alt="" />
                    <input type={isShowingPassword ? 'text' : 'password'} required value={password} placeholder="Password" onChange={(ev) => setPassword(ev.target.value)}/>
                    <img className='btn eye-pass' src={isShowingPassword ? showPassword : unshowpassword} alt="" onClick={(ev) => {
                        ev.preventDefault()
                        setShowingPassword(!isShowingPassword)
                    }}/>
                </label>
             <div>
                    {!isSignup && <p>Don't have an account ? <span className='signup-btn btn' onClick={() => setSignUp(!isSignup)}> Sign Up Now</span></p>}
                    {isSignup && <p>Have an account ?<span className='signup-btn btn' onClick={() => setSignUp(!isSignup)}> Sign In Now</span></p>}
            </div>
                <div>
                    <button className='login-btn' type='submit'>{isSignup ? 'Signup' : 'Login'}</button>
                </div>
            </form>
            </div> : <Homepage user={user} setUser={setUser}/>}
        </div>
    )
}