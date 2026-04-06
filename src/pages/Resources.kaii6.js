import { getPublicResources, searchResources } from 'backend/dataService.jsw';
import { currentMember } from 'wix-members-frontend';

let allResources = [];

$w.onReady(async function () {
    $w("#noDataMessage").collapse();
    $w("#resourceRepeater").collapse();

    try {
        allResources = await getPublicResources();

        if (allResources.length > 0) {
            populateCategories(allResources);
            setupRepeater(allResources);
            $w("#resourceRepeater").expand();
        } else {
            $w("#noDataMessage").expand();
        }
    } catch (error) {
        console.error("Data fetch failed:", error);
        $w("#noDataMessage").text = "System error. Please notify the admin.";
        $w("#noDataMessage").expand();
    }

    
    $w("#searchInput").onInput(() => applyFilters());
    $w("#categoryDropdown").onChange(() => applyFilters());
    $w("#sortDropdown").onChange(() => applyFilters());
});

function populateCategories(data) {
    const categories = [...new Set(
        data.map(r => r.category).filter(Boolean)
    )].sort();

    $w("#categoryDropdown").options = [
        { label: "All Categories", value: "" },
        ...categories.map(c => ({ label: c, value: c }))
    ];
    $w("#categoryDropdown").value = "";

    $w("#sortDropdown").options = [
        { label: "A → Z", value: "az" },
        { label: "Z → A", value: "za" },
        { label: "Newest first", value: "newest" },
        { label: "Oldest first", value: "oldest" }
    ];
    $w("#sortDropdown").value = "az";
}

function applyFilters() {
    const query = $w("#searchInput").value.trim().toLowerCase();
    const category = $w("#categoryDropdown").value;
    const sort = $w("#sortDropdown").value;

    let filtered = allResources.filter(item => {
        const matchesSearch = !query ||
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query);
        const matchesCategory = !category || item.category === category;
        return matchesSearch && matchesCategory;
    });

    filtered = sortResources(filtered, sort);
    updateRepeater(filtered);
}

function sortResources(data, sort) {
    switch (sort) {
        case "az":
            return [...data].sort((a, b) => a.title.localeCompare(b.title));
        case "za":
            return [...data].sort((a, b) => b.title.localeCompare(a.title));
        case "newest":
            return [...data].sort((a, b) => new Date(b._createdDate) - new Date(a._createdDate));
        case "oldest":
            return [...data].sort((a, b) => new Date(a._createdDate) - new Date(b._createdDate));
        default:
            return data;
    }
}

function updateRepeater(data) {
    if (data.length === 0) {
        $w("#resourceRepeater").collapse();
        $w("#noDataMessage").expand();
    } else {
        $w("#noDataMessage").collapse();
        $w("#resourceRepeater").data = data;
        $w("#resourceRepeater").expand();
    }
}

function setupRepeater(data) {
    $w("#resourceRepeater").onItemReady(($item, itemData) => {

        $item("#titleText").text = itemData.title || "";
        $item("#descriptionText").html = itemData.description || "";

        if (itemData.category) {
            $item("#categoryTag").text = itemData.category;
    
            const styles = {
                "Essay":    { color: "#1a2e5a", bg: "#e8f0ff" },
                "Article":  { color: "#5a3a00", bg: "#fef3d8" },
                "Pamphlet": { color: "#2a5a2a", bg: "#e8f5e8" },
                "PDF":      { color: "#6b1414", bg: "#fde8e8" }
            };

            const s = styles[itemData.category] || { color: "#555555", bg: "#eeeeee" };
            $item("#categoryTag").style.color = s.color;
            $item("#category").style.backgroundColor = s.bg;
            $item("#category").show();
        } else {
            $item("#category").hide();
        }

        if (itemData.file) {
            $item("#button2").label = "Open →";
            $item("#button2").link = itemData.file;
            $item("#button2").target = "_blank";
            $item("#button2").show();
        } else if (itemData.link) {
            $item("#button2").label = "Open →";
            $item("#button2").link = itemData.link;
            $item("#button2").target = "_blank";
            $item("#button2").show();
        } else {
            $item("#button2").hide();
        }
    });

    $w("#resourceRepeater").data = data;
}