function saveInput() {
  	// Grab the value from the text box
  	let fileName = document.getElementById("userInput").value.trim();
  	// Store in a variable
	if (!fileName) {
    		alert("Please enter a file name.");
    		return;
  	}
	
	 // Clear old results if table already exists
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
	

	// Load StudentDatabase.json
	fetch("StudentDatabase.json")
	.then(response => response.json())
	.then(data => {
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
        	for (const student of data) {
                	const row = document.createElement("tr");

                	// Student name
                	const nameCell = document.createElement("td");
                	nameCell.textContent = student.name;
                	row.appendChild(nameCell);
		
			//Gitrepo link
                	let gitrepoUrl = "https://github.com/" + student.githubUSER;
                	const repoCell = document.createElement("td");
                	const repoLink = document.createElement("a");
                	repoLink.href = gitrepoUrl;
                	repoLink.textContent = gitrepoUrl;
                	repoLink.target = "_blank";
                	repoCell.appendChild(repoLink);
        		row.appendChild(repoCell);
		
			// File link
                	let fileUrl = "https://" + student.githubUSER + ".github.io/" + fileName;
                	let fileExists = false;
                	try {
                        	const res = fetch(fileUrl, { method: "GET" });
                        	fileExists = res.response.ok;
                	} catch (err) {
                        	console.warn("Error checking file:", err);
                	}

                	const linkCell = document.createElement("td");
                	if (fileExists) {
                        	const fileLink = document.createElement("a");
                        	fileLink.href = fileUrl;
                        	fileLink.textContent = fileUrl;
                        	fileLink.target = "_blank";
                        	linkCell.appendChild(fileLink);
                	} else {
                        	linkCell.textContent = "Couldn't Find File";
                	}
                	row.appendChild(linkCell);
		
			//Commit history link
        		let commitUrl = "https://github.com/" + student.githubUSER + "/" + student.githubUSER + ".github.io/commits/main/" + fileName;
                	const commitCell = document.createElement("td");
                	if (fileExists) {
                        	const commitLink = document.createElement("a");
                        	commitLink.href = commitUrl;
                        	commitLink.textContent = commitUrl;
                        	commitLink.target = "_blank";
                        	commitCell.appendChild(commitLink);
                	} else {
                        	commitCell.textContent = "History Doesn't Exist For This File";
                	}
        		row.appendChild(commitCell);

			// Validation cell
                	const validCell = document.createElement("td");
                	if (fileExists) {
				try{
					fetch("https://html5.validator.nu/?out=json&doc=", {
						method: "POST",
                                                headers: {
							"Content-Type": "text/html; charset=utf-8"
                                                }})
                                        .then(response => response.json())
                                        .then(data => {
						renderValidationResults(data);
					})
                                        .catch(error => {
						console.warn(error);
                                                validCell.textContent = "no";
                                        })
                                }
                                catch {
					validCell.textContent = "N/A";
                                }
				row.appendChild(validCell);

			}
			console.log(row);
                	table.appendChild(row);
		}
		resultsDiv.appendChild(table);
	});
}

