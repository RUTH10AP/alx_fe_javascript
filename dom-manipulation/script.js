const serverUrl = 'https://jsonplaceholder.typicode.com/posts';  // Simulate server endpoint

// Fetch quotes from the server
async function fetchServerQuotes() {
  try {
    const response = await fetch(serverUrl);
    const data = await response.json();
    // Map server data to a format your app can use
    return data.map(item => ({ text: item.title, category: 'server' }));
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
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
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Quote posted to server.');
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}
async function syncWithServer() {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
  // Fetch server quotes
  const serverQuotes = await fetchServerQuotes();

  // Merge server quotes with local quotes (server takes precedence)
  const allQuotes = [...serverQuotes, ...localQuotes];

  // Remove duplicate quotes (based on text) and keep the server's version in case of conflict
  const uniqueQuotes = Array.from(new Set(allQuotes.map(q => q.text)))
                            .map(text => serverQuotes.find(q => q.text === text) || localQuotes.find(q => q.text === text));

  // Update local storage with the merged quotes
  localStorage.setItem('quotes', JSON.stringify(uniqueQuotes));
  
  // Display quotes (update UI)
  displayQuotes(uniqueQuotes);
}

// Periodically sync with the server (e.g., every 10 seconds)
setInterval(syncWithServer, 10000);
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove the notification after a few seconds
  setTimeout(() => notification.remove(), 5000);
}
async function syncWithServer() {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const serverQuotes = await fetchServerQuotes();
  
  let conflictsResolved = false;

  const allQuotes = [...serverQuotes, ...localQuotes];

  // Handle conflicts by keeping the server's version
  const uniqueQuotes = Array.from(new Set(allQuotes.map(q => q.text)))
                            .map(text => {
                              const serverQuote = serverQuotes.find(q => q.text === text);
                              const localQuote = localQuotes.find(q => q.text === text);
                              
                              if (serverQuote && localQuote && serverQuote.category !== localQuote.category) {
                                conflictsResolved = true;
                                return serverQuote;  // Server data takes precedence
                              }
                              return serverQuote || localQuote;  // Keep either server or local if no conflict
                            });

  if (conflictsResolved) {
    notifyUser('Conflicts detected and resolved. Server data takes precedence.');
  }

  // Save the merged and resolved quotes to local storage
  localStorage.setItem('quotes', JSON.stringify(uniqueQuotes));
  displayQuotes(uniqueQuotes);  // Update the UI
}
