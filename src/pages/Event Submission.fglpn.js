import { submitEvent } from 'backend/dataService.jsw';
import { sendApprovalEmail } from 'backend/emailService.jsw';

$w.onReady(function () {
    $w("#successMessage").collapse();

    $w("#submitEventButton").onClick(async () => {
        $w("#submitEventButton").disable();
        $w("#submitEventButton").label = "Submitting...";

        const title = $w("#eventNameInput").value;
        const description = $w("#eventDescInput").value;
        const date = $w("#eventDateInput").value;
        const time = $w("#eventTimeInput").value;
        const location = $w("#eventLocationInput").value;
        const contactName = $w("#contactNameInput").value;
        const contactEmail = $w("#contactEmailInput").value;
        const externalLink = $w("#eventLinkInput").value;

        // Add this temporarily
        console.log("title:", title);
        console.log("description:", description);
        console.log("date:", date);
        console.log("time:", time);
        console.log("location:", location);
        console.log("contactName:", contactName);
        console.log("contactEmail:", contactEmail);

        // Validation
        if (!title || !description || !date || !time || !location || !contactName || !contactEmail) {
            showMessage("Please fill out all required fields.");
            $w("#submitEventButton").enable();
            $w("#submitEventButton").label = "Submit Event Request";
            return;
        }

        if (!isValidEmail(contactEmail)) {
            showMessage("Please enter a valid email address.");
            $w("#submitEventButton").enable();
            $w("#submitEventButton").label = "Submit Event Request";
            return;
        }

        const eventData = {
            title,
            description,
            eventDate: `${date}T${time}`,
            location,
            contactName,
            contactEmail,
            externalLink: externalLink || null
        };

        try {
            const result = await submitEvent(eventData);

            if (!result.success) {
                showMessage("Submission failed. Please try again or contact us directly.");
                $w("#submitEventButton").enable();
                $w("#submitEventButton").label = "Submit Event Request";
                return;
            }

            await sendApprovalEmail(eventData, result.id);

            // Collapse the form elements and show success
            $w("#submitEventButton").collapse();
            showMessage("Thank you! Your event has been submitted and is pending review. We'll be in touch within 2–3 business days.");

        } catch (err) {
            console.error("Submission error:", err);
            showMessage("Something went wrong on our end. Please try again or contact us directly.");
            $w("#submitEventButton").enable();
            $w("#submitEventButton").label = "Submit Event Request";
        }
    });
});

function showMessage(msg) {
    $w("#successMessage").text = msg;
    $w("#successMessage").expand();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}