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
  