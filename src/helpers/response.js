exports.sendResponse = (...args) => {
    const [res, data, statusCode, header, setCookie, options] = args;
    res.setHeader('Content-Type', header);

    // If there is cookie set in response
    if(setCookie) {
        return res.status(statusCode).cookie('token', data.token, options).json(data);
    }
    return res.status(statusCode).json(data);
}