export function timeAgo(timestamp) {
    const diffMs = Date.now() - new Date(timestamp).getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30.44 * day;
    const year = 365.25 * day;

    const minutes = Math.floor(diffMs / minute);
    const hours = Math.floor(diffMs / hour);
    const days = Math.floor(diffMs / day);
    const months = Math.floor(diffMs / month);
    const years = Math.floor(diffMs / year);

    if (minutes < 1) {
        return "just now";
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    if (days < 30) {
        return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    if (months < 12) {
        return `${months} month${months !== 1 ? "s" : ""} ago`;
    }

    return `${years} year${years !== 1 ? "s" : ""} ago`;
}