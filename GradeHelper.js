function StudentLinkTable() {
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
        ["Student Name", "Homepage", "Page Link", "Raw File", "Commit History Link"].forEach(text => {
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
		
			//Homepage
            let gitrepoUrl = "https://github.com/" + student.githubUSER;
            const repoCell = document.createElement("td");
            const repoLink = document.createElement("a");
            repoLink.href = gitrepoUrl;
            repoLink.textContent = gitrepoUrl;
            repoLink.target = "_blank";
            repoCell.appendChild(repoLink);
        	row.appendChild(repoCell);
		
			// Page Link
            let fileUrl = "https://" + student.githubUSER + ".github.io/" + fileName;
            let fileExists = false;
            fetch(fileUrl, { method: "GET" })
            .then(res => {
				const fileExists = res.ok;
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

				//Raw File
				let rawURL = "https://raw.githubusercontent.com/" + student.githubUSER + "/" + student.githubUSER + ".github.io/refs/heads/main/" + fileName;
				const rawCell = document.createElement("td");
				if (fileExists) {
                	const rawLink = document.createElement("a");
                	rawLink.href = rawURL;
                	rawLink.textContent = rawURL;
                	rawLink.target = "_blank";
                	rawCell.appendChild(rawLink);
            	} else {
                	rawCell.textContent = "Raw File Does Not Exist";
            	}
        		row.appendChild(rawCell);
            
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
			})
			console.log(row);
            table.appendChild(row);
		}
		resultsDiv.appendChild(table);
	});
}
function StudentWebsiteContentList() {
  	// Grab the value from the text box
  	let fileName = document.getElementById("userInput").value.trim();
  	// Store in a variable
	if (!fileName) {
    	alert("Please enter a file name.");
    	return;
  	}
	
	// Create PDF
	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();

	 // Clear old results if table already exists
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
		
	// Load StudentDatabase.json
	fetch("StudentDatabase.json")
	.then(response => response.json())
	.then(data => {
		// Process each student sequentially
		let chain = Promise.resolve();
		
		// Loop through each student
        for (const student of data) {
			chain = chain.then(() => {
				// Creating shortcuts
				let index = 0;
				const name = student.name;
				const githubUSER = student.githubUSER;
				let rawUrl = "https://raw.githubusercontent.com/" + student.githubUSER + "/" + student.githubUSER + ".github.io/refs/heads/main/" + fileName;
			
				// Adding in name on the PDF
				doc.setFontSize(14);
    			doc.text("Student: " + name, 10, 20);
				
				// Try fetching raw file
    			let fileContent = "";
            	return fetch(rawUrl, { method: "GET" })
            	.then(res => {
            	    if (res.ok) {
            	        return res.text();
					} else {
            	        return "Couldn't Find File";
            	    }
				})
				.then(fileContent => {
					// Add raw code (split long text so it fits page)
    				doc.setFontSize(10);
    				const pageWidth = doc.internal.pageSize.getWidth() - 80;
    				const lines = doc.splitTextToSize(fileContent, pageWidth);
    				doc.text(lines, 40, 70);

					// Page break unless last student
    				if (index < data.length - 1) {
    					doc.addPage();
						index++;
					}
				})
			})
		}
		// After all students processed then makes the PDF
		chain.then(() => {
			const pdfBlob = doc.output("blob");
			const url = URL.createObjectURL(pdfBlob);
			const linkDiv = document.getElementById("downloadLink");
			linkDiv.innerHTML = ""; // clear old link
			const a = document.createElement("a");
			a.href = url;
			a.download = "StudentFiles_" + fileName + ".pdf";
			a.textContent = "Download PDF";
			linkDiv.appendChild(a);

			resultsDiv.innerHTML = "PDF with raw file content ready!";
		});
	});
}
