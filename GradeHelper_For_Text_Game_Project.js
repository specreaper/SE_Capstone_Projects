function StudentLinkTable() {
  	// Grab the value from the text box
  	let fileName = document.getElementById("userInput").value.trim();
	let validate = document.getElementById("validate").checked;
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
				if(validate){
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
			}else{
				const validCell = document.createElement("td");
				row.appendChild(validCell);
				validCell.textContent = "Skipping Validation";
			}
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
function extractRelevantFunction(fileContent, fileName) {
    const ext = fileName.split(".").pop().toLowerCase();
    
    // Only process JavaScript/TypeScript files
    if (!["js", "ts"].includes(ext)) {
        return "// No valid code file (only JS/TS supported for function extraction)";
    }
    
    // Remove comments first to avoid false positives
	let cleanCode = fileContent
            			.replace(/\/\/.*$/gm, "//COMMENT HIDDEN")
            			.replace(/\/\*[\s\S]*?\*\//g, "/* COMMENT HIDDEN */");
    
    // Strategy: Find all functions, then filter for those with processInput() and a non-"input" variable in an if
    const functions = [];
    
    // Regex to find functions (covers function declarations, arrow functions, and method definitions)
    // This regex is simplified - handles function name(params) { ... } and const name = (params) => { ... }
    const funcRegex = /(?:function\s+(\w+)\s*\([^)]*\)\s*\{|(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>\s*\{)/g;
    
    let match;
    let lastIndex = 0;
    
    // First, find all function boundaries
    const functionBoundaries = [];
    let braceCount = 0;
    let inFunction = false;
    let functionStart = -1;
    let functionName = "";
    
    for (let i = 0; i < cleanCode.length; i++) {
        // Look for function start
        if (!inFunction) {
            // Check for function declaration
            const funcDeclMatch = cleanCode.substring(i).match(/^(?:function\s+(\w+)\s*\([^)]*\)\s*\{|(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>\s*\{)/);
            if (funcDeclMatch && funcDeclMatch.index === 0) {
                functionName = funcDeclMatch[1] || funcDeclMatch[2] || "anonymous";
                functionStart = i;
                inFunction = true;
                braceCount = 1;
                i += funcDeclMatch[0].length - 1;
                continue;
            }
        } else {
            if (cleanCode[i] === '{') braceCount++;
            if (cleanCode[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    // Found complete function
                    const functionBody = cleanCode.substring(functionStart, i + 1);
                    functionBoundaries.push({
                        name: functionName,
                        start: functionStart,
                        end: i + 1,
                        body: functionBody
                    });
                    inFunction = false;
                }
            }
        }
    }
    
    // Filter functions that contain processInput() AND an if statement with a non-"input" variable
    const relevantFunctions = functionBoundaries.filter(func => {
        let body = func.body;
        
        // Must contain processInput() call
        if (!body.includes('processInput(') && !body.includes('processInput()')) {
            return false;
        }
        
        // Must contain an if statement that checks a variable that's not exactly "input"

		//remove string literals
		body = body.replace(/'[^'\\]*(\\.[^'\\]*)*'/g, '""')
						.replace(/"[^"\\]*(\\.[^"\\]*)*"/g, '""')
						.replace(/`[^`\\]*(\\.[^`\\]*)*`/g, '``');

        const ifPattern = /if\s*\(([^)]+)\)/g;
        let ifMatch;
        let hasValidIf = false;
        
        while ((ifMatch = ifPattern.exec(body)) !== null) {
            const condition = ifMatch[1];
            // Look for variable names in the condition (simple pattern - not perfect but works for most cases)
            const varPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
            let varMatch;
            while ((varMatch = varPattern.exec(condition)) !== null) {
                const varName = varMatch[0];
                // Exclude common keywords and "input" itself
                const keywords = ['if', 'else', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'toLowerCase', 'stoLowerCase'];
                if (!keywords.includes(varName) && varName !== 'input') {
					console.log("found valid if statement with condition: "+ varName);
                    hasValidIf = true;
                    break;
                }
            }
            if (hasValidIf) break;
        }
        
        return hasValidIf;
    });
    
    // If we found relevant functions, pick one (prefer one with a real name, not anonymous)
    let selectedFunction = null;
    if (relevantFunctions.length > 0) {
        // Prefer named functions over anonymous
        const namedFunctions = relevantFunctions.filter(f => f.name !== 'anonymous' && f.name !== '');
        selectedFunction = namedFunctions.length > 0 ? namedFunctions[0] : relevantFunctions[0];
        
        // Extract just this function with original formatting (preserve original indentation)
        const originalCode = cleanCode.substring(selectedFunction.start, selectedFunction.end);
        return `// Selected one function from your code. The full file is likely much longer.\n${originalCode}`;
    }
    
    // Fallback: Find any function containing processInput() even without the if condition
    const fallbackFunctions = functionBoundaries.filter(func => 
        func.body.includes('processInput(') || func.body.includes('processInput()')
    );
    
    if (fallbackFunctions.length > 0) {
        const fallback = fallbackFunctions[0];
        const originalCode = cleanCode.substring(fallback.start, fallback.end);
        return `// Could not find any functions that included an if statement and a global variable.`+
		`\n// Here's a function that includes processInput().`+
		`\n// This is just one function, your full file is likely much longer.`+
		`\n// Feel free to use Chris's sample code instead`+
		`\n// Function: ${fallback.name}\n${originalCode}`;
    }
    
    /* Last resort: Just show a snippet with context around processInput
    const processInputIndex = cleanCode.indexOf('processInput');
    if (processInputIndex !== -1) {
        const start = Math.max(0, processInputIndex - 500);
        const end = Math.min(cleanCode.length, processInputIndex + 1000);
        const snippet = cleanCode.substring(start, end);
        return `// Could not isolate full function. Showing context around processInput():\n${snippet}\n// ... (truncated)`;
    }
	*/
    
    return `// Chris's parser was not able to select a single function to extract.` +
	`\n// Please use Chris's sample code instead.`
}

// Modified version of your main function
function StudentWebsiteContentList() {
    // Grab the value from the text box
    let fileName = document.getElementById("userInput1").value.trim();
    let githubToken = document.getElementById("userInput2").value.trim();
    let breaks = document.getElementById("breaks").checked;
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
        let y = 30;
        let totalPages = 0;
        
        for (const student of data) {
            chain = chain.then(() => {
                // Creating shortcuts
                let pageNum = 1;
				let index = 0;
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
                .then(commits => {
                    if(commits.length > 0){
                        commitLength = commits.length;
                        const lastCommitDate = new Date(commits[0].commit.committer.date);
  
                        const day = lastCommitDate.getDate();
                        const month = monthNames[lastCommitDate.getMonth()];
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
                        return "No file in repo called: " + fileName
                    }
                })
                .then(fileContent => {
                    
                    console.log("Searching relevant function for: " + student.name);

					let extractedCode = fileContent;

					if(fileContent != ("No file in repo called: " + fileName)){
						// Extract the relevant function
                    	extractedCode = extractRelevantFunction(fileContent, fileName);
					}
                    
                    
                    // Add header
                    var currentdate = new Date(); 
                    var datetime = monthNames[currentdate.getMonth()] + " "
                                    + currentdate.getDate() + ", "
                                    + currentdate.getFullYear() + " "  
                                    + currentdate.getHours() + ":"  
                                    + currentdate.getMinutes();
                    
                    if(breaks){
                        doc.setFontSize(14);
                        doc.text(name + " | " + fileName + " | Retrieved: " + datetime, 10, 15);
                        doc.text("Commits: " + commitLength + " | Last Commit: " + lastCommit, 10, 20);
                        doc.setFontSize(10);
                        y = 35;
                    } else {
                        doc.setFontSize(10);
                        doc.text(name + " | " + fileName + " | Retrieved: " + datetime, 10, y);
                        doc.text("Commits: " + commitLength + " | Last Commit: " + lastCommit, 10, y+7);
                        y += 18;
                    }
                    
                    const marginLeft = 20;
					const marginTop = 30;
                    const marginBottom = 10;
                    const pageHeight = doc.internal.pageSize.getHeight();
                    
                    // Split the extracted code into lines
                    const lines = splitAt80(extractedCode);
                    
                    // Writing text line by line
    				lines.forEach(line => {
						if (line.length > 0){
							// Checks for if the text is too close to bottom
							if (y > pageHeight - (marginBottom)) { 
								// creates new page and resets Y for new page
								doc.addPage();
								y = marginTop;
								pageNum++;
								if(breaks){
									doc.setFontSize(14);
								
									doc.text(name + " | " + fileName, 10, 15);
									doc.text("Page " + pageNum, 10, 20);
								}
								doc.setFontSize(10);
							}
							// prints out single line and moves down for line spacing
							doc.text(line, marginLeft, y);
							y += 7;  
						}
    				});

					//Checks if student had a odd number of pages
					//If so it adds a mostly blank page 
					if (pageNum % 2 == 1 && breaks){
						doc.addPage();
						doc.text("*Notice* this page is has been left blank on purpose!", 10, 20);
					}

    			 	//Page break unless last student
    				if (index < data.length - 1 && breaks) {
    					doc.addPage();
						index++;
					}else{
						doc.text("----------------", marginLeft, y);
						y += 7;
					}		
				});
            });
        }
        
        // After all students processed then makes the PDF
        chain.then(() => {
            const pdfBlob = doc.output("blob");
            const url = URL.createObjectURL(pdfBlob);
            const linkDiv = document.getElementById("downloadLink");
            linkDiv.innerHTML = "";
            const a = document.createElement("a");
            a.href = url;
            a.download = "StudentFunctions_" + fileName + ".pdf";
            a.textContent = "Download PDF (Extracted Functions)";
            linkDiv.appendChild(a);
            
            resultsDiv.innerHTML = "PDF with extracted functions ready!";
        });
    });
};


