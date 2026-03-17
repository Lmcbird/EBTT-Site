import wixData from 'wix-data';

$w.onReady(function () {
    // This tells the repeater: "Every time a row loads, prepare the buttons"
    $w("#awaitingApproval").onItemReady(($item, itemData) => {
        
        // APPROVE BUTTON
        $item("#approveButton").onClick(async () => {
            $item("#approveButton").label = "...";
            await updateMemberStatus(itemData._id, ["Approved"]);
            await approveMemberInWix(itemData.email);
            $w("signupsDataset").refresh();
        });

        // REJECT BUTTON
        $item("#rejectButton").onClick(async () => {
            $item("#rejectButton").label = "...";
            await updateMemberStatus(itemData._id, ["Rejected"]);
        });
    });
});

// This helper function does the actual work in the database
async function updateMemberStatus(id, newStatus) {
    try {
        const item = await wixData.get("Signups", id);
        item.status = newStatus;
        await wixData.update("Signups", item);
        $w("#signupsDataset").refresh();
        
    } catch (err) {
        console.error("Failed to update status", err);
    }
}