function saveInput() {
  	// Grab the value from the text box
  	let fileName = document.getElementById("userInput").value.trim();
  	// Store in a variable
	if (!fileName) {
    		alert("Please enter a file name.");
    		return;
  	}
	// Load StudentDatabase.json
	const response = fetch("StudentDatabase.json");
	const students = response.json();
	
	// Clear old results if table already exists
	const resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML = "";

	// Create a table
  	const table = document.createElement("table");
  	table.border = "1";

	// Table headers
	const headerRow = document.createElement("tr");
	["Student Name", "Gitrepo Link", "File Link", "Commit History Link", "Valid?"].forEach(text => {
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
                const b = document.createElement("a");
                b.href = gitrepoUrl;
		b.textContent = gitrepoUrl;
		b.target = "_blank";
		repoCell.appendChild(b);
                row.appendChild(repoCell);

		// File link
		let fileUrl = "https://" + student.githubUSER + ".github.io/" + fileName;
    		let fileExists = false;
    		try {
      			const res = fetch(fileUrl, { method: "GET" });
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
		
		//Commit history link
                let commitUrl = "https://github.com/" + student.githubUSER + "/" + student.githubUSER + ".github.io/commits/main/" + fileName;
		const commitCell = document.createElement("td");
                if (fileExists) {
			const c = document.createElement("a");
                	c.href = commitUrl;
                	c.textContent = commitUrl;
                	c.target = "_blank";
                	commitCell.appendChild(c);
		} else {
			commitCell.textContent = "History Doesn't Exist For This File";
		}
                row.appendChild(commitCell);
		
		// Validation cell
    		const validCell = document.createElement("td");
    		if (fileExists) {
      			try {
        			//const validateRes = await fetch("https://html5.validator.nu/?out=json&doc=" + encodeURIComponent(fileUrl), { method: "GET" });
				const validateRes = fetch("https://html5.validator.nu/?out=json&doc=" + encodeURIComponent(fileUrl), { method: "GET", 
						headers: { "User-Agent": "Mozilla/5.0"} });
				const data = validateRes.json();
        			validCell.textContent = data.messages.length === 0 ? "yes" : "no";
      			} catch (err) {
        			console.warn("Validation error:", err);
        			validCell.textContent = "no";
      			}
    			} else {
      				validCell.textContent = "N/A";
    			}
    			row.appendChild(validCell);
    			table.appendChild(row);
	}
	resultsDiv.appendChild(table);
}

