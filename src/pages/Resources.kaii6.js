import { getPublicResources, searchResources } from 'backend/dataService.jsw';
import { currentMember } from 'wix-members-frontend';

let allResources = []; // Cache the full list for client-side filtering

$w.onReady(async function () {
    $w("#noDataMessage").collapse();
    $w("#resourceRepeater").collapse();

    try {
        allResources = await getPublicResources();

        if (allResources.length > 0) {
            $w("#resourceRepeater").expand();
            setupRepeater(allResources);
        } else {
            $w("#noDataMessage").expand();
        }
    } catch (error) {
        console.error("Data fetch failed:", error);
        $w("#noDataMessage").text = "System error. Please notify the admin.";
        $w("#noDataMessage").expand();
    }

    // Search input handler — filters the cached list as the user types
    $w("#searchInput").onInput(() => {
        const query = $w("#searchInput").value.trim().toLowerCase();

        if (!query) {
            // Empty search: restore full list
            updateRepeater(allResources);
            return;
        }

        const filtered = allResources.filter(item => {
            const inTitle = item.title?.toLowerCase().includes(query);
            const inDescription = item.description?.toLowerCase().includes(query);
            return inTitle || inDescription;
        });

        updateRepeater(filtered);
    });
});

function updateRepeater(data) {
    if (data.length === 0) {
        $w("#resourceRepeater").collapse();
        $w("#noDataMessage").text = "No resources match your search.";
        $w("#noDataMessage").expand();
    } else {
        $w("#noDataMessage").collapse();
        $w("#resourceRepeater").data = data;
        $w("#resourceRepeater").expand();
    }
}

function setupRepeater(data) {
    $w("#resourceRepeater").onItemReady(($item, itemData) => {
        $item("#titleText").text = itemData.title;
        $item("#descriptionText").html = itemData.description;

        if (itemData.file) {
            $item("#button2").label = "Open Resource";
            $item("#button2").link = itemData.file;
            $item("#button2").target = "_blank";
            $item("#button2").show();
        } else if (itemData.link) {
            $item("#button2").label = "Open Link";
            $item("#button2").link = itemData.link;
            $item("#button2").target = "_blank";
            $item("#button2").show();
        } else {
            $item("#button2").hide();
        }
    });

    $w("#resourceRepeater").data = data;
}