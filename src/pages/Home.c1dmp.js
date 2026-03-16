import { authentication } from 'wix-members-frontend'
import wixData from 'wix-data';

$w.onReady(function () {
    $w("#signupButton").onClick(async () => {
        $w("#signupButton").disable();
        $w("#signupButton").label = "Processing...";

        const email = $w("#emailInput").value;
        const name = $w("#nameInput").value;
        const role = $w("#roleDropdown").value;
        const contact = $w("#contactCheckbox").checked;

        if (!email || !name || !role) {
            showError("Please fill out all fields before signing up.");
            return;
        }

        try {
            await wixData.insert("Signups", {
                "fullName": name,
                "email": email,
                "role": [role],
                "status": ["Pending"],
                "contact": contact
            });
            await authentication.promptLogin({ mode: "signup" });

            $w("#signupButton").label = "Success!";
            
        } catch (err) {
            console.error("Signup failed:", err);
            showError("Something went wrong. Please try again.");
            $w("#signupButton").enable();
            $w("#signupButton").label = "SIGN UP";
        }
    });
});
