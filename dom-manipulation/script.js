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
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
  
    // Clear existing categories
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
    // Populate unique categories
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
  
    displayQuotes(filteredQuotes);
    localStorage.setItem('selectedCategory', selectedCategory);  // Save filter preference
  }
  function displayQuotes(quotesArray) {
    const quoteContainer = document.getElementById('quote-list');
    quoteContainer.innerHTML = '';  // Clear the list
  
    quotesArray.forEach(quote => {
      const li = document.createElement('li');
      li.textContent = `"${quote.text}" - ${quote.category}`;
      quoteContainer.appendChild(li);
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const savedCategory = localStorage.getItem('selectedCategory') || 'all';
    document.getElementById('categoryFilter').value = savedCategory;
    filterQuotes();  // Apply the saved filter
  });
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
  
      saveQuotes();  // Update local storage with new quotes
      displayQuotes(quotes);  // Re-display all quotes
      populateCategories();  // Update category filter
    }
  }
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes = storedQuotes;
    displayQuotes(quotes);
    populateCategories();
  }
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts';  // Simulated API endpoint

async function fetchServerQuotes() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes.map(quote => ({ text: quote.title, category: 'server' }));
  } catch (error) {
    console.error('Error fetching data from server:', error);
  }
}
async function postQuoteToServer(quote) {
    try {
      await fetch(serverUrl, {
        method: 'POST',
        body: JSON.stringify({
          title: quote.text,
          category: quote.category,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Quote successfully posted to server.');
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }
  }
  async function syncWithServer() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
    const serverQuotes = await fetchServerQuotes();
    
    // Merge server quotes with local quotes, preferring server data
    const allQuotes = [...serverQuotes, ...localQuotes];
  
    // Filter out duplicates based on the quote text
    const uniqueQuotes = Array.from(new Set(allQuotes.map(q => q.text)))
      .map(text => allQuotes.find(q => q.text === text));
  
    // Update local storage with synced data
    localStorage.setItem('quotes', JSON.stringify(uniqueQuotes));
  
    displayQuotes(uniqueQuotes);  // Update the UI
  }
  
  // Sync every 10 seconds (you can change the interval as needed)
  setInterval(syncWithServer, 10000);  
  function notifyUser(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
  
    setTimeout(() => notification.remove(), 5000);  // Remove after 5 seconds
  }
  async function syncWithServer() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverQuotes = await fetchServerQuotes();
  
    let conflictsResolved = false;
  
    const allQuotes = [...serverQuotes, ...localQuotes];
  
    const uniqueQuotes = Array.from(new Set(allQuotes.map(q => q.text)))
      .map(text => {
        const serverQuote = serverQuotes.find(q => q.text === text);
        const localQuote = localQuotes.find(q => q.text === text);
        if (serverQuote && localQuote && serverQuote.category !== localQuote.category) {
          conflictsResolved = true;
          return serverQuote;  // Server takes precedence
        }
        return serverQuote || localQuote;  // If only one exists
      });
  
    if (conflictsResolved) {
      notifyUser('Conflicts detected and resolved. Server data takes precedence.');
    }
  
    localStorage.setItem('quotes', JSON.stringify(uniqueQuotes));
    displayQuotes(uniqueQuotes);  // Update the UI
  }
  
  setInterval(syncWithServer, 10000);
  
  