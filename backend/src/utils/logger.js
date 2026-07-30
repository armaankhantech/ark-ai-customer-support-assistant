function log(level, message, metadata = {}) {

    const timestamp = new Date().toISOString();

    console.log(
        JSON.stringify({
            timestamp,
            level,
            message,
            ...metadata
        })
    );

}

function info(message, metadata = {}) {

    log("INFO", message, metadata);

}

function warn(message, metadata = {}) {

    log("WARN", message, metadata);

}

function error(message, metadata = {}) {

    log("ERROR", message, metadata);

}

module.exports = {

    info,

    warn,

    error

};