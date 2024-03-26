const responses = {
    401: "Unauthorized",
    403: "Forbidden Access",
    404: "Data Not Found",
    500: "Internal Server Error",
}

const JsonResponse = (res, status, message, data, meta) => {
    if (message === "") {
        if (status in responses) {
            message = responses[status];
        }
    }
    return res.status(status).json({ message: message, data: data, meta: meta });
}

module.exports = JsonResponse;