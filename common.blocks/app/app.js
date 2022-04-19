chrome.runtime.onConnect.addListener(function(port) {
    let fiatAmount = document.querySelectorAll('div.css-y28y57 > p.css-1jq4ozh, div.css-y28y57 > p.css-liog5w');
    let btcAmount = document.querySelectorAll('div.css-w3963p > p.css-6hm6tl');            
    let orderAction = document.querySelectorAll('div.css-1w7386o > .css-1hnat5q, div.css-1w7386o > div.css-liog5w');
    let orderDate = document.querySelectorAll('div.css-1w7386o > div.css-fhtmef');
    let orderId = document.querySelectorAll('div.css-1f9551p > a.gjmJkE');
    let orderStatus = document.querySelectorAll('div.css-j4h787 > p.css-1jq4ozh');

    let orders = [];

    for(let i = 0, j = 1; i < fiatAmount.length; ++i, j+=2){
        orders.push({
            fiatAmount: fiatAmount[i].textContent.split(" ")[0],
            btcAmount: btcAmount[j].textContent.split(" ")[0],
            orderAction: orderAction[i].textContent,
            orderId: orderId[i].textContent,
            orderDate: orderDate[i].textContent,
            orderStatus: orderStatus[i].textContent
        });
    }            

    port.postMessage({"orders": orders});
});