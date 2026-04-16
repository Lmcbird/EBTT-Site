import wixData from 'wix-data';

$w.onReady(async function () {
    $w("#memberRepeater").collapse();
    try {
        const results = await wixData.query("Bios")
                    .eq("displayOnSite", true)
                    .ascending("name")
                    .find();
        console.log("Query results:", results.items.length, "| First item:", JSON.stringify(results.items[0]));
        if (results.items.length > 0) {
            setupMemberRepeater(results.items);
            $w("#memberRepeater").expand();
        }
    } catch (err) {
        console.error("Fetch failed", err);
    }
});

function setupMemberRepeater(data) {
    $w("#memberRepeater").onItemReady(($item, itemData) => {
        console.log("Item ready:", itemData._id, itemData.name);
        if (itemData.name) {
            $item("#memberName").text = itemData.name || "";
        }
        if (itemData.bio) {
            $item("#memberBio").text = itemData.bio;
            $item("#memberBio").expand();
        } else {
            $item("#memberBio").collapse();
        }
        if (itemData.image) {
            $item("#memberPhoto").src = itemData.image;
            $item("#memberPhoto").tooltip = itemData.name;
        }
    });
    $w("#memberRepeater").data = data;
}