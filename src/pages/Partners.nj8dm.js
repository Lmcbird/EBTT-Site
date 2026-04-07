import wixData from 'wix-data';

$w.onReady(async function () {
    $w("#partnersRepeater").collapse();

    try {
        const results = await wixData.query("Partners")
            .eq("displayOnSite", true)
            .ascending("title")
            .find();

        if (results.items.length > 0) {
            setupPartnersRepeater(results.items);
            $w("#partnersRepeater").expand();
        }

    } catch (err) {
        console.error("Partners fetch failed", err);
    }
});

function setupPartnersRepeater(data) {
    $w("#partnersRepeater").onItemReady(($item, itemData) => {

        $item("#partnerName").text = itemData.title || "";

        if (itemData.description) {
            $item("#partnerDescription").text = itemData.description;
            $item("#partnerDescription").expand();
        } else {
            $item("#partnerDescription").collapse();
        }

        // Include partner logo - uncomment if necessary
        // if (itemData.logo) {
        //     $item("#partnerLogo").src = itemData.logo;
        //     $item("#partnerLogo").tooltip = itemData.title;
        // }

        if (itemData.website) {
            $item("#partnerWebsite").label = "Visit →";
            $item("#partnerWebsite").link = itemData.website;
            $item("#partnerWebsite").target = "_blank";
            $item("#partnerWebsite").expand();
        } else {
            $item("#partnerWebsite").collapse();
        }
    });

    $w("#partnersRepeater").data = data;
}