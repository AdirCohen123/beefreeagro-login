import { auth } from "../../firebase"
import { httpService } from './http.service';
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const TOKEN_KEY = 'token'
export const userService = {
    login, 
    signup,
    getLoggedinUser,
    logout,
    getToken,
    getUserDetails
}

async function login(credentials) {
    const {email, password} = credentials
    return await _signIn(email, password)
}
async function signup(credentials) {
    const {email, displayName,password} = credentials
    await auth.createUserWithEmailAndPassword(email,password)
    .then(credential => {
        if (credential) {
            credential.user.updateProfile({
                displayName: displayName
            })
        }
    })
    return await _signIn(email, password)
}

async function _signIn(email, password) {
    const user = await auth.signInWithEmailAndPassword(email, password)
    const token = user.user.multiFactor.user.stsTokenManager.accessToken
    _saveLocalToken(token)
    return await getUserDetails(token)
}


async function getUserDetails(token) {
    if(!token) return
    const data ={
        userToken: token
    };
    const user = await httpService.post('getUserDetails',data);
    _saveLocalUser(user)
    return user;
}

function _saveLocalToken(token) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
    return token
}

function getToken() {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null')
}

function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}
function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    localStorage.removeItem(TOKEN_KEY)
}








