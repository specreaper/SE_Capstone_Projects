async function saveInput() {
  	// Grab the value from the text box
  	let fileName = document.getElementById("userInput").value.trim();
  	// Store in a variable
	if (!fileName) {
    		alert("Please enter a file name.");
    		return;
  	}
	// Load StudentDatabase.json
	const response = await fetch("StudentDatabase.json");
	const students = await response.json();
}
// Hosted file case: Use URL-based validation
fetch("https://html5.validator.nu/?out=json&doc=" + encodeURIComponent(loc), { 
	method: "GET"
})
	.then(response => response.json())
	.then(data => {
		renderValidationResults(data);
	})
	.catch(error => {
		console.warn(error);
		renderErrorFooter();
	});
}

