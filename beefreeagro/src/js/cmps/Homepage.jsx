import { userService } from "../services/user.service";
const Homepage = ({ user, setUser}) => {

    return (
        <div className='home-page flex auto-center column'>
            <h1>Welcome</h1>
            <h1>{user.displayName}</h1>
            <button className='logout-btn' onClick={() => {
                userService.logout()
                setUser()
            }}>logout</button>
        </div>
    )
}

export default Homepage