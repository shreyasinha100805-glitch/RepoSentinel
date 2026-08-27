/**
 * Google Cloud Pub/Sub Event Dispatcher for RepoSentinel agent workflow messages.
 */

const eventLogs = [];

async function publishScanEvent(topicName, eventData) {
    const logEntry = {
        topic: topicName,
        timestamp: new Date().toISOString(),
        data: eventData
    };
    eventLogs.push(logEntry);
    if (process.env.DEMO_MODE !== 'true') {
        console.log(`[PubSub Event Published] ${topicName}:`, JSON.stringify(eventData));
    }
    return true;
}

function getEventLogs() {
    return eventLogs;
}

module.exports = {
    publishScanEvent,
    getEventLogs
};
