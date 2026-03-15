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

        try {
            await wixData.insert("Sign-ups", {
                "fullName": name,
                "email": email,
                "role": role,
                "contact": contact
            });
            await authentication.promptRegister({
                contactInfo: {
                    firstName: name,
                    labels: [role] 
                }
            });

            $w("#signupButton").label = "Success!";
            
        } catch (err) {
            console.error("Signup failed:", err);
            showError("Something went wrong. Please try again.");
            $w("#signupButton").enable();
            $w("#signupButton").label = "SIGN UP";
        }
    });
});
