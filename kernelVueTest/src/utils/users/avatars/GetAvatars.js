export const getAvatar = (user, ignoreCache = false) => {
    return `http://localhost:8080/api/users/avatar/get/${user}${ignoreCache ? `?t=${Date.now()}`:""}`
}