exports.sendResponse = (...args) => {
    const [res, data, statusCode, header] = args;
    res.setHeader('Content-Type', header);
    return res.status(statusCode).json(data);
}