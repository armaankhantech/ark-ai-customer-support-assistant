function shouldUseRag(intent) {

    const ragIntents = [
    "architecture",
    "rag",
    "context_engineering",
    "memory",
    "handbook"
];

    return ragIntents.includes(intent);

}

module.exports = shouldUseRag;