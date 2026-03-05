import wixData from 'wix-data';

$w.onReady(async function () {
	$w("#noPartnersMessage").collapse();
	$w("#partnersRepeater").collapse();
    try {
        const results = await wixData.query("Partners")
            .eq("displayOnSite", true)
            .find();

        if (results.items.length > 0) {
            setupPartnersRepeater(results.items);
			$w("#partnersRepeater").show();
        } else { // Hide if empty
            $w("#noPartnersMessage").show();
        }
    } catch (err) {
        console.error("Partners fetch failed", err);
    }
});

function setupPartnersRepeater(data) {
    $w("#partnersRepeater").onItemReady(($item, itemData) => {
        $item("#partnerName").text = itemData.title; // Display Partner name 
        
        if (itemData.logo) { // Load Partner logo
            $item("#partnerLogo").src = itemData.logo;
            $item("#partnerLogo").tooltip = itemData.title;
        }

        if (itemData.website) { // Link the logo and a button to the partner's site 
            $item("#partnerLogo").link = itemData.website;
            $item("#partnerLogo").target = "_blank";
            
            $item("#partnerWebsite").link = itemData.website;
            $item("#partnerWebsite").target = "_blank";
            $item("#partnerWebsite").show();
        } else {
            $item("#partnerWebsite").hide();
        }	
    });

	$w("#partnersRepeater").data = data;
}