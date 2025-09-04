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
function saveInput() {
  // Grab the value from the text box
  let textValue = document.getElementById("userInput").value;
  // Store in a variable
  console.log("You entered:", textValue);
}

