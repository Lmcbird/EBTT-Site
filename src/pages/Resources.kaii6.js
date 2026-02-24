import { getPublicResources } from 'backend/dataService.jsw'
import wixLocation from 'wix-location';

$w.onReady(async function () { // On page load
	$w("#noDataMessage").collapse();
	$w("#resourceRepeater").collapse();

	try {
		const allResources = await getPublicResources();

		if (allResources && allResources.length > 0) { // Data is present, populate resource repeater
			$w("#resourceRepeater").expand();
			setupRepeater(allResources);
		}
		else { // No data found, display #noDataMessage
			$w("#noDataMessage").expand();
		}
	}
	catch (error) {
		console.error("Data fetch failed:", error);
		$w("#noDataMessage").text = "System error. Please notify the admin.";
		$w("#noDataMessage").expand();
	}
});

function setupRepeater(data) {
	$w("#resourceRepeater").onItemReady(($item, itemData) => {
		$item("#titleText").text = itemData.title; // Display resource title
		$item("#descriptionText").html = itemData.description; // Display resource description
		if (itemData.file) { // Data is a file: View PDF
            $item("#button2").label = "Open Resource"; 
            $item("#button2").link = itemData.file;
            $item("#button2").target = "_blank"; 
            $item("#button2").show();
        }
		else if (itemData.link) { // Data is a link to external site
			$item("#button2").hide()
			$item("#button2").label = "Open Link";
			$item("#button2").link = itemData.link;
			$item("#button2").show();
		} else {
			$item("#button2").hide();
		}
	});

	$w("#resourceRepeater").data = data;
}

