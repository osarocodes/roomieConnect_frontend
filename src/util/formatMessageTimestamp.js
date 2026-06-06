export function formatMessageTimestamp(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function formatYearTimestamp(date) {
    return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });
}