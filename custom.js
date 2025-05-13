// Custom JavaScript for CPU usage highlighting
(function() {
    // Function to find and highlight CPU usage values
    function highlightCpuUsage() {
        console.log('Searching for CPU usage values...');
 
        // Look for any text containing "CPU" and then find nearby percentage values
        const allElements = document.querySelectorAll('*');
 
        allElements.forEach(element => {
            // Skip elements without text content
            if (!element.textContent) return;
 
            // Check if this element contains "CPU" text
            if (element.textContent.includes('CPU')) {
                console.log('Found CPU element:', element);
 
                // Look for percentage values in siblings or children
                const siblings = getSiblings(element);
                siblings.forEach(sibling => {
                    checkForPercentage(sibling);
                });
 
                // Also check children of parent
                if (element.parentNode) {
                    Array.from(element.parentNode.children).forEach(child => {
                        checkForPercentage(child);
                    });
                }
            }
        });
 
        // Function to get all siblings of an element
        function getSiblings(element) {
            if (!element.parentNode) return [];
            return Array.from(element.parentNode.children).filter(child => child !== element);
        }
 
        // Function to check if an element contains a percentage and highlight it
        function checkForPercentage(element) {
            if (!element || !element.textContent) return;
 
            // Check if this element or any of its children contain a percentage
            if (element.textContent.includes('%')) {
                console.log('Found potential percentage element:', element);
 
                // Try to find the exact element with just the percentage
                const percentElements = findPercentageElements(element);
                percentElements.forEach(el => {
                    applyHighlighting(el);
                });
            }
        }
 
        // Function to find elements containing just percentage values
        function findPercentageElements(element) {
            const results = [];
 
            // Check if this element itself contains just a percentage
            if (element.childNodes.length === 1 && 
                element.childNodes[0].nodeType === 3 && 
                /^\s*\d+%\s*$/.test(element.textContent)) {
                results.push(element);
                return results;
            }
 
            // Check direct children
            Array.from(element.children).forEach(child => {
                if (child.childNodes.length === 1 && 
                    child.childNodes[0].nodeType === 3 && 
                    /^\s*\d+%\s*$/.test(child.textContent)) {
                    results.push(child);
                }
            });
 
            // If we found direct children with percentages, return them
            if (results.length > 0) return results;
 
            // Otherwise, look for spans that might contain percentages
            const spans = element.querySelectorAll('span');
            spans.forEach(span => {
                if (/^\s*\d+%\s*$/.test(span.textContent)) {
                    results.push(span);
                }
            });
 
            return results;
        }
 
        // Function to apply highlighting based on percentage value
        function applyHighlighting(element) {
            const percentText = element.textContent.trim();
            const percentValue = parseFloat(percentText);
 
            if (isNaN(percentValue)) return;
 
            console.log('Highlighting element with value:', percentValue, element);
 
            // Remove any existing highlighting classes
            element.classList.remove('cpu-value-low', 'cpu-value-medium', 'cpu-value-high');
 
            // Apply appropriate class based on value
            if (percentValue >= 50) {
                element.classList.add('cpu-value-high');
            } else if (percentValue >= 25) {
                element.classList.add('cpu-value-medium');
            } else {
                element.classList.add('cpu-value-low');
            }
        }
    }
 
    // Run the function after a delay to ensure the DOM is loaded
    setTimeout(highlightCpuUsage, 2000);
 
    // Run periodically to catch updates
    setInterval(highlightCpuUsage, 5000);
})();
