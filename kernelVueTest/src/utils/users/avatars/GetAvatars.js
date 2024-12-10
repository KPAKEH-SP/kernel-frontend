export const getAvatar = (user, ignoreCache = false) => {
    return `/api/users/avatar/get/${user}${ignoreCache ? `?t=${Date.now()}`:""}`
}