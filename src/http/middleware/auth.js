const JsonResponse = require("../../helper/response")
const jwt = require('jsonwebtoken')
const { userGetByID, userIDIsInGroup, userIDIsInPermission } = require("../../services/users")

const isLoggedin = async (req, res, next) => {
    if (!req.headers.authorization) {
        return JsonResponse(res, 401, '', {}, {})
    }

    bearer = req.headers.authorization.split(' ')
    if (bearer.length != 2) {
        return JsonResponse(res, 401, '', {}, {})
    }

    if (bearer[0].toLowerCase() != 'bearer') {
        return JsonResponse(res, 401, '', {}, {})
    }

    decoded = jwt.verify(bearer[1], process.env.NODE_SECRET)
    if (!decoded) {
        return JsonResponse(res, 401, '', {}, {})
    }

    try {
        user = await userGetByID(decoded['id'])
        req.user = user
        return next()
    } catch (err) {
        return JsonResponse(res, 401, '', {}, {})
    }
}

const hasPermissionTo = (permissionName) => {
    return async (req, res, next) => {
        user = req.user
        let isSuperAdmin = await userIDIsInGroup(user.id, 'super_admin')
        if (!isSuperAdmin) {
            let hasPermission = await userIDIsInPermission(user.id, permissionName)
            if (!hasPermission) {
                return JsonResponse(res, 403, '', {}, {})
            }
        }
        return next()
    }
}

module.exports = { isLoggedin, hasPermissionTo }