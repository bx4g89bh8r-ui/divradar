export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300');

  const tickers = 'ABBV,ENB,SHEL,T,BHP,VOD,VZ,NEE,AZN,TD,AEP,WES,BNS,HRZN,TTE,BASF.DE,REP.MC,IBE.MC,INGA.AS,ENEL.MI';

  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${tickers}&range=1d&interval=1d`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await r.json();
    
    const result = {};
    const sparks = data.spark?.result || [];
    sparks.forEach(item => {
      if (item?.symbol && item?.response?.[0]) {
        const meta = item.response[0].meta;
        result[item.symbol] = {
          price: meta?.regularMarketPrice || 0,
          priceChange: meta?.regularMarketChangePercent || 0,
          yield: 0
        };
      }
    });
    
    res.status(200).json(result);
  } catch(e) {
    res.status(200).json({});
  }
}


