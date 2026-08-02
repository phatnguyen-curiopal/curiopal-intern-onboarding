function requestLogger (req, res, next) {
    const time = new Date();

    res.on("finish", () => {
        console.log(`${time} ${req.method} ${req.originalUrl} ${req.statusCode}`);
    });

    next();
}

module.exports = requestLogger;