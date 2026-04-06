import wixData from 'wix-data';

$w.onReady(async function () {
    $w("#noPartnersMessage").collapse();
    $w("#partnersRepeater").collapse();

    try {
        const results = await wixData.query("Partners")
            .eq("displayOnSite", true)
            .ascending("title")
            .find();

        if (results.items.length > 0) {
            setupPartnersRepeater(results.items);
            $w("#partnersRepeater").expand();
        } else {
            $w("#noPartnersMessage").expand();
        }
    } catch (err) {
        console.error("Partners fetch failed", err);
        $w("#noPartnersMessage").expand();
    }
});

function setupPartnersRepeater(data) {
    $w("#partnersRepeater").onItemReady(($item, itemData) => {

        $item("#partnerName").text = itemData.title || "";

        if (itemData.description) {
            $item("#partnerDescription").text = itemData.description;
            $item("#partnerDescription").show();
        } else {
            $item("#partnerDescription").hide();
        }

        if (itemData.logo) {
            $item("#partnerLogo").src = itemData.logo;
            $item("#partnerLogo").tooltip = itemData.title;
        }

        if (itemData.website) {
            $item("#partnerWebsite").label = "Visit Website →";
            $item("#partnerWebsite").link = itemData.website;
            $item("#partnerWebsite").target = "_blank";
            $item("#partnerWebsite").show();
        } else {
            $item("#partnerWebsite").hide();
        }
    });

    $w("#partnersRepeater").data = data;
}