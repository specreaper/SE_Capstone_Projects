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
		// Creates a table
        const table = document.createElement("table");
        table.border = "1";
			
        // Creates table headers
        const headerRow = document.createElement("tr");
        ["Student Name", "Homepage", "Page Link", "Raw File", "Commit History Link", "Valid?"].forEach(text => {
        	const th = document.createElement("th");
        	 th.textContent = text;
        	headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
		
		// Loops through each student
        data.forEach((student,index) => {
			const row = document.createElement("tr");
			//Creates a delay
			const delay = index * 5000;
            

            // Grabs Student names from the json file and put them in the table
            const nameCell = document.createElement("td");
            nameCell.textContent = student.name;
            row.appendChild(nameCell);
		
			// Grabs Students github usernames from the json file 
			// Then creates a github homepage link with it and puts it in the table
            let gitrepoUrl = "https://github.com/" + student.githubUSER;
            const repoCell = document.createElement("td");
            const repoLink = document.createElement("a");
            repoLink.href = gitrepoUrl;
            repoLink.textContent = gitrepoUrl;
            repoLink.target = "_blank";
            repoCell.appendChild(repoLink);
        	row.appendChild(repoCell);
		
			// Grabs Students github usernames from the json file
			// Also grabs the file name from the input in the website
			// Then creates a link to the website you are looking for and puts it in the table
            let fileUrl = "https://" + student.githubUSER + ".github.io/" + fileName;
            let fileExists = false;
            fetch(fileUrl, { method: "GET" })
            .then(res => {
				const fileExists = res.ok;
				const linkCell = document.createElement("td");
				// Checks for if the file exsists
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

				// Grabs Students github usernames from the json file
				// Also grabs the file name from the input in the website
				// Then creates a link to the raw code you are looking for and puts it in the table
				let rawURL = "https://raw.githubusercontent.com/" + student.githubUSER + 
				"/" + student.githubUSER + ".github.io/refs/heads/main/" + fileName;
				const rawCell = document.createElement("td");
				// Checks for if the file exsists
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
            
				// Grabs Students github usernames from the json file
				// Also grabs the file name from the input in the website
				// Then creates a link to the history of the code you are looking for and puts it in the table
        		let commitUrl = "https://github.com/" + student.githubUSER + 
				"/" + student.githubUSER + ".github.io/commits/main/" + fileName;
            	const commitCell = document.createElement("td");
            	// Checks for if the file exsists
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

				// Grabs Students github usernames from the json file
				// Also grabs the file name from the input in the website
				// Then creates a link to the website you are looking for 
				// Next it puts that website through a validator 
				// Finally it puts in the table whether the website is valid or not 
				setTimeout(() => {
            	const validCell = document.createElement("td");
            	// Checks for if the file exsists
				if (fileExists) {
					try{
						fetch("https://validator.w3.org/nu/?out=json&doc=" + encodeURIComponent(fileUrl), {
							method: "GET",
						})
                    	.then(response => response.json())
                    	.then(data => {
							validCell.textContent = data.messages.length === 0 ? "Yes" : "No";
						})
                	}
                	catch {
						validCell.textContent = "N/A";
                	}
					row.appendChild(validCell);
				}
				},delay);
				console.log(`Will validate ${student.name} in ${delay} ms`);
			});
            table.appendChild(row);
		});
		//uploads table
		resultsDiv.appendChild(table);
	});
}
function splitAt80(text) {
	// when we render the text in the PDF, we want to wrap at 80 characters.
	// this is an alternative to jsPDF's splitTextToSize, which calculates 
	// wrap based on the page's size in mm and the font's width/kerning tables.
	// This version is way simpler, and relies on using monospace font.
	// and I'll manually calibrate font size and margin to make sure that
	// 80 characters fits in the PDF.
  const result = [];
  const lines = text.split(/\r?\n/); // preserve existing line breaks

  for (const line of lines) {
    if (line.length <= 80) {
      result.push(line);
    } else {
      // Wrap this line into 80-char chunks
      const chunks = line.match(/.{1,80}/g) || [];
      result.push(...chunks);
    }
  }

  return result;
}

function StudentWebsiteContentList() {
  	// Grab the value from the text box
  	let fileName = document.getElementById("userInput1").value.trim();
	let githubToken = document.getElementById("userInput2").value.trim();
  	// Store in a variable
	if (!fileName) {
    	alert("Please enter a file name.");
    	return;
  	}
	
	// Create PDF
	const { jsPDF } = window.jspdf;
	const doc = new jsPDF({
		orientation: "portrait",
		format: [216, 279]
	});
	doc.setFont('Courier', 'normal');

	 // Clear old results if table already exists
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		
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
				let pageNum = 1;
				const name = student.name;
				const githubUSER = student.githubUSER;
				let rawUrl = "https://raw.githubusercontent.com/" + student.githubUSER 
				+ "/" + student.githubUSER + ".github.io/refs/heads/main/" + fileName;
				let commitUrl = "https://api.github.com/repos/" + student.githubUSER 
				+ "/" + student.githubUSER + ".github.io/commits?path=" + fileName + "&sha=main&per_page=100";
				let commitLength = "N/A";
				let lastCommit = "N/A";
				

				// Gets how many commits were made using the github token provided
      			return fetch(commitUrl, {
					headers: {
						"Authorization": "token " + githubToken
					}
				})
				.then(res => {
					if (!res.ok) {
						console.warn("Couldn't fetch commits for" + student.githubUSER);
						return [];
					}
					return res.json();
				})
				.then( commits => {
					if(commits.length > 0){
						commitLength = commits.length;
						const lastCommitDate = new Date(commits[0].commit.committer.date);
  
						const day = lastCommitDate.getDate();
						const month = monthNames[lastCommitDate.getMonth()]; // Months are 0-indexed
						const year = lastCommitDate.getFullYear();
						const hours = lastCommitDate.getHours();
						const minutes = lastCommitDate.getMinutes().toString().padStart(2, '0');

  						lastCommit = `${month} ${day}, ${year} ${hours}:${minutes}`;

					}
					// Gets raw file
					return fetch(rawUrl);
				})
				.then(res => {
					if (res.ok) {
						return res.text();
					} else {
						return "Couldn't Find File";
					}
				})
				.then(fileContent => {
					// Adding in name on the PDF
					var currentdate = new Date(); 
					var datetime =   
									monthNames[currentdate.getMonth()]  + " "
									+ currentdate.getDate() + ", "
									+ currentdate.getFullYear() + " "  
									+ currentdate.getHours() + ":"  
									+ currentdate.getMinutes();

					doc.setFontSize(14);
    				doc.text(name + " | " + fileName + " | Retrieved: " + datetime, 10, 15);
    				doc.text("Number of Commits: " + commitLength + " | Last Commit: " 
						+ lastCommit , 10, 20);

					// Sets up variables 
					doc.setFontSize(10);
					const marginLeft = 20;
					const marginTop = 30;
					const marginBottom = 10;
					let y = marginTop; 

					//calculate document margins
    				const pageHeight = doc.internal.pageSize.getHeight();  // total page height
					
					//this this only necessary if we use splitTextToSize
					// which is also commented out below
					//const pageWidth = doc.internal.pageSize.getWidth() - (marginLeft*2);
    				
					// Replace tabs with spaces for all files
    				fileContent = fileContent.replace(/\t/g, "    ");

    				// Get file extension
    				const ext = fileName.split(".").pop().toLowerCase();

    				if (["js", "ts", "java", "c", "cpp"].includes(ext)) {
        				// Remove single-line and block comments
        				fileContent = fileContent
            			.replace(/\/\/.*$/gm, "//COMMENT HIDDEN")
            			.replace(/\/\*[\s\S]*?\*\//g, "/* COMMENT HIDDEN */");
    				} else if (["html", "htm"].includes(ext)) {
        				// Strip HTML comments
        				fileContent = fileContent.replace(/<!--[\s\S]*?-->/g
							, "<!-- COMMENT HIDDEN -->");
    				} else if (["css"].includes(ext)) {
        				// Remove CSS comments
        				fileContent = fileContent.replace(/\/\*[\s\S]*?\*\//g
							, "/* COMMENT HIDDEN */");
    				}

    				// Split the content into wrapped lines
    				//const lines = doc.splitTextToSize(fileContent, pageWidth);
					
					const lines = splitAt80(fileContent);

    				// Writing text line by line
    				lines.forEach(line => {
						if (line.length > 0){
							// Checks for if the text is too close to bottom
							if (y > pageHeight - (marginBottom)) { 
								// creates new page and resets Y for new page
								doc.addPage();
								y = marginTop; 
								pageNum++;
								doc.setFontSize(14);
								doc.text(name + " | " + fileName, 10, 15);
								doc.text("Page " + pageNum, 10, 20);
								doc.setFontSize(10);
							}
							// prints out single line and moves down for line spacing
							doc.text(line, marginLeft, y);
							y += 7;  
						}
    				});

    			 	//Page break unless last student
    				if (index < data.length - 1) {
    					doc.addPage();
						index++;
					}		
				});
			});
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
};
