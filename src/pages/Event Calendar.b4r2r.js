import { getApprovedEvents } from 'backend/dataService.jsw';
import { getAllApprovedEvents } from 'backend/dataService.jsw';
import wixLocation from 'wix-location';

let allEvents = [];
let activeFilter = "upcoming";

$w.onReady(async function () {
    $w("#noEventsMessage").collapse();
    $w("#eventRepeater").collapse();

    // filter buttons
    $w("#filterUpcoming").onClick(() => setFilter("upcoming"));
    $w("#filterThisMonth").onClick(() => setFilter("thismonth"));
    $w("#filterPast").onClick(() => setFilter("past"));

    // submit buttons

    $w("#submitEventButton2").onClick(() => {
        wixLocation.to("/event-calendar/event-submission");
    });

    try {
        allEvents = await getApprovedEvents();
        setupRepeater();
        applyFilter("upcoming");
    } catch (err) {
        console.error("Failed to load events:", err);
        $w("#noEventsMessage").text = "System error. Please notify the admin.";
        $w("#noEventsMessage").expand();
    }
});

function setFilter(filter) {
    activeFilter = filter;
    const buttons = {
        upcoming: "#filterUpcoming",
        thismonth: "#filterThisMonth",
        past: "#filterPast"
    };
    Object.entries(buttons).forEach(([key, id]) => {
        if (key === filter) {
            $w(id).style.backgroundColor = "#7a1a1a";
            $w(id).style.color = "#f5e8d0";
        } else {
            $w(id).style.backgroundColor = "#fffdf8";
            $w(id).style.color = "#2a1a0a";
        }
    });
    applyFilter(filter);
}

function applyFilter(filter) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    let filtered;

    switch (filter) {
        case "upcoming":
            filtered = allEvents.filter(e => new Date(e.eventDate) >= now);
            break;
        case "thismonth":
            filtered = allEvents.filter(e => {
                const d = new Date(e.eventDate);
                return d >= startOfMonth && d <= endOfMonth;
            });
            break;
        case "past":
            filtered = allEvents
                .filter(e => new Date(e.eventDate) < now)
                .reverse();
            break;
        default:
            filtered = allEvents;
    }

    updateRepeater(filtered);
}

function setupRepeater() {
    $w("#eventRepeater").onItemReady(($item, itemData) => {
        const date = new Date(itemData.eventDate);

        // Date column
        $item("#eventMonth").text = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
        $item("#eventDay").text = date.getDate().toString();
        $item("#eventDow").text = date.toLocaleString("en-US", { weekday: "short" }).toUpperCase();

        // Event details
        $item("#eventTitle").text = itemData.title || "";
        $item("#eventDescription").html = itemData.description || "";

        // Time — format nicely from the date
        $item("#eventTime").text = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        // Location
        $item("#eventLocation").text = itemData.location || "";

        // External link — show only if present
        if (itemData.externalLink) {
            $item("#eventLink").label = "Details & Registration →";
            $item("#eventLink").link = itemData.externalLink;
            $item("#eventLink").target = "_blank";
            $item("#eventLink").show();
        } else {
            $item("#eventLink").hide();
        }
    });
}

function updateRepeater(data) {
    if (!data || data.length === 0) {
        $w("#eventRepeater").collapse();
        $w("#noEventsMessage").text = activeFilter === "past"
            ? "No past events to display."
            : "No upcoming events at this time. Check back soon!";
        $w("#noEventsMessage").expand();
    } else {
        $w("#noEventsMessage").collapse();
        $w("#eventRepeater").data = data;
        $w("#eventRepeater").expand();
    }
}