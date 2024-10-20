// Array to store quotes (each quote has text and category)
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Perseverance" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Happiness" }
];

// Function to display a random quote
function showRandomQuote() {
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the DOM to display the random quote and its category
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- Category: ${randomQuote.category}</em></p>`;
}

// Function to add a new quote to the array and update the DOM
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

    // Optionally, clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Optionally, display a success message or update the UI to reflect the new quote
    alert("Quote added successfully!");

    // You can call showRandomQuote here if you want to display the newly added quote immediately
    showRandomQuote();
}

// On page load, show a random quote initially
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
});
