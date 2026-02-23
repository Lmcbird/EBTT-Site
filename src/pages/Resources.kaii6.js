import { getPublicResources } from 'backend/dataService.jsw'

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
		$item("#descriptionText").text = itemData.description; // Display resource description
		if (itemData.file) { // Resource download button functionality
			$item("#downloadButton").label = "Download PDF";
			$item("#downloadButton").link = itemData.file;
		}
		else if (itemData.link) {
			$item("#downloadButton").label = "Open Link";
			$item("#downloadButton").link = itemData.link;
		} else {
			$item("downloadButton").hide();
		}
	});

	$w("#resourceRepeater").data = data;
}

