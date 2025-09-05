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
	
	// Clear old results if table already exists
	const resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML = "";

	// Create a table
  	const table = document.createElement("table");
  	table.border = "1";

	// Table headers
	const headerRow = document.createElement("tr");
	["Student Name", "Gitrepo Link", "File Link", "Valid?"].forEach(text => {
    		const th = document.createElement("th");
    		th.textContent = text;
    		headerRow.appendChild(th);
  	});
  	table.appendChild(headerRow);
	
	// Loop through each student
  	for (const student of students) {
    		const row = document.createElement("tr");
	
		// Student name
    		const nameCell = document.createElement("td");
    		nameCell.textContent = student.name;
    		row.appendChild(nameCell);
		
		//Gitrepo link
		let gitrepoUrl = "https://github.com/" + student.githubUSER;
		const repoCell = document.createElement("td");
                repoCell.textContent = gitrepoUrl;
                row.appendChild(repoCell);

		// File link
		let fileUrl = "https://" + student.githubUSER + ".github.io/" + fileName;
    		let fileExists = false;
    		try {
      			const res = await fetch(fileUrl, { method: "HEAD" });
      			fileExists = res.ok;
    		} catch (err) {
      			console.warn("Error checking file:", err);
    		}
		const linkCell = document.createElement("td");
    		if (fileExists) {
      			const a = document.createElement("a");
      			a.href = fileUrl;
      			a.textContent = fileUrl;
      			a.target = "_blank";
      			linkCell.appendChild(a);
    		} else {
      			linkCell.textContent = "Couldn't Find File";
    		}
    		row.appendChild(linkCell);
		
		// Validation cell
    		const validCell = document.createElement("td");
    		if (fileExists) {
      			try {
        			const validateRes = await fetch("https://html5.validator.nu/?out=json&doc=" + encodeURIComponent(fileUrl), { method: "GET" });
				const data = await validateRes.json();
        			validCell.textContent = data.messages.length === 0 ? "yes" : "no";
      			} catch (err) {
        			console.warn("Validation error:", err);
        			validCell.textContent = "no";
      			}
    			} else {
      				validCell.textContent = "n/a";
    			}
    			row.appendChild(validCell);
    			table.appendChild(row);
	}
	resultsDiv.appendChild(table);
}

