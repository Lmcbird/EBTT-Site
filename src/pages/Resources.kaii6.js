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
		if (itemData.file) { // Data is a file
			// Resource view button functionality
			$item("#button2").label = "View PDF";
            $item("#button2").link = itemData.file;
            $item("#button2").target = "_blank"; // Open in a new tab
            $item("#button2").show();
			// Resource download button functionality
			$item("#downloadButton").label = "Download PDF";
			$item("#downloadButton").onClick(() => {
				const downloadURL = itemData.file.split('?')[0] + "?download=true";
				wixLocation.to(downloadURL);
			});
			$item("#downloadButton").show();
		}
		else if (itemData.link) { // Data is a link to external site
			$item("#button2").hide()
			$item("#downloadButton").label = "Open Link";
			$item("#downloadButton").link = itemData.link;
			$item("#downloadButton").show();
		} else {
			$item("#button2").hide();
			$item("#downloadButton").hide();
		}
	});

	$w("#resourceRepeater").data = data;
}

