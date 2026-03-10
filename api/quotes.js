export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const tickers = [
    'ABBV', 'ENB', 'REP.MC', 'SHEL', 'BASF.DE', 'T', 'BHP',
    'VOD', 'VZ', 'NEE', 'IBE.MC', 'INGA.AS', 'AZN', 'TD',
    'AEP', 'ENEL.MI', 'WES', 'BNS', 'HRZN', 'TTE'
  ];

  const symbols = tickers.join('%2C');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketChangePercent,trailingAnnualDividendYield`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();
    const quotes = data.quoteResponse?.result || [];
    
    const result = {};
    quotes.forEach(q => {
      result[q.symbol] = {
        price: q.regularMarketPrice,
        priceChange: q.regularMarketChangePercent,
        yield: (q.trailingAnnualDividendYield || 0) * 100
      };
    });
    
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
