// Array to store quotes (each quote has text and category)
let quotes = JSON.parse(localStorage.getItem('quotes') || '[]'); // Load quotes from local storage or initialize an empty array

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the DOM to display the random quote and its category
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (randomQuote) {
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- Category: ${randomQuote.category}</em></p>`;
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote)); // Store the last viewed quote in sessionStorage
    } else {
        quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    }
}

// Function to add a new quote to the array and update local storage
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Basic validation to ensure fields are not empty
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please fill out both fields.");
        return;
    }

    // Create a new quote object
    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    // Add the new quote to the quotes array
    quotes.push(newQuote);
    saveQuotes(); // Save the updated quotes array to local storage

    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert("Quote added successfully!");

    // Display the new random quote
    showRandomQuote();
}

// Save quotes array to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load the last viewed quote from session storage (optional)
function loadLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><p><em>- Category: ${lastQuote.category}</em></p>`;
    }
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes); // Add imported quotes to the existing array
        saveQuotes(); // Save the updated quotes array to local storage
        alert('Quotes imported successfully!');
        showRandomQuote(); // Update the displayed quote
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the app when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote(); // Show a random quote on page load
    loadLastViewedQuote(); // Load the last viewed quote from session storage (if any)
});
