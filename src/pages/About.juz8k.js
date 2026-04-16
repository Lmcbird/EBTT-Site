import wixData from 'wix-data';

$w.onReady(async function () {
	$w("#memberRepeater").collapse();
	try {
		const results = await wixData.query("Partners")
					.eq("displayOnSite", true)
					.ascending("name")
					.find();
		if (results.items.length > 0) {
            setupMemberRepeater(results.items);
            $w("#partnersRepeater").expand();
        }
	} catch (err) {
        console.error("Fetch failed", err);
    }
});

function setupMemberRepeater(data) {
    $w("#memberRepeater").onItemReady(($item, itemData) => {
		if (itemData.name) {
			$item("#memberName").text = itemData.name || "";
		}
        if (itemData.bio) {
            $item("#memberBio").text = itemData.bio;
            $item("#memberBio").expand();
        } else {
            $item("#memberBio").collapse();
        }
        if (itemData.logo) {
			$item("#memberPhoto").src = itemData.image;
            $item("#memberPhoto").tooltip = itemData.name;
        }
    });

    $w("#memberRepeater").data = data;
}