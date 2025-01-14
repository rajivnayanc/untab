export default {
  'tab': {
    displayName: 'Tab',
    keys: [ 't', 'tab' ],
    item: [
      {
        key: 'back',
        title: 'Back navigate',
        url: '',
        category: 'Current Tab',
      },
      {
        key: 'forward',
        title: 'Forward navigate',
        url: '',
        category: 'Current Tab',
      },
      {
        key: 'close',
        title: 'Close Tab',
        url: '',
        category: 'Current Tab',
      },
    ],
    handler(item) {
      switch(item.key) {
        case 'back':
          chrome.tabs.goBack();
          break;
        case 'forward':
          chrome.tabs.goForward();
          break;
        case 'close':
          chrome.tabs.query({ active: true, currentWindow: true }, (results) => {
            chrome.tabs.remove(results[0].id);
          });
          break;
      }
    }
  },
  'google-search': {
    displayName: 'Google search',
    match: /\s*(.*?)/,
    keys: [ 'g', 'google' ],
    item: {
      favicon: 'https://www.google.com/favicon.ico',
      title: 'Search Google for $1',
      url: 'https://www.google.com/search?q=$1',
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  },
  'duckduckgo-search': {
    displayName: 'DuckDuckGo search',
    match: /\s*(.*?)/,
    keys: [ 'd', 'duckduckgo' ],
    item: {
      favicon: 'https://duckduckgo.com/favicon.ico',
      title: 'Search DuckDuckGo for $1',
      url: 'https://duckduckgo.com?q=$1',
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  },
  'open-url': {
    match: /^(https?:\/\/)?([\w]+\.)+[A-Za-z]{2,24}(\/[\w\/&.=?-]*)?$/,
    async item(query) {
      const url = /^https?:\/\//.exec(query) ? query : `https://${query}`;
      return {
        favicon: `chrome://favicon/${url}`,
        title: `Open ${query} in new tab`,
        url,
      }
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  },
  'history': {
    async item(query) {
      const histories = await new Promise(resolve => 
        chrome.history.search({ text: query, maxResults: 40 }, resolve)
      );
      
      return histories.map(({ title, url }) => ({
        title,
        url,
        favicon: `chrome://favicon/${url}`,
        category: 'History',
      }));
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  },
  'bookmarks': {
    async item(query) {
      const bookmarkTreeNodes = await new Promise(resolve => 
        chrome.bookmarks.search(query, resolve)
      );

      return bookmarkTreeNodes
        .filter(({ url }) => !!url) // We avoid adding the bookmarkTreeNode to the list if it is a folder
        .map(({ title, url }) => ({
          title,
          url,
          favicon: `chrome://favicon/${url}`,
          category: 'Bookmarks'
        }));
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  }
};
