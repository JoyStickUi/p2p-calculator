chrome.tabs.query({active: true, currentWindow: true, url: "https://p2p.binance.com/ru/fiatOrder"}, function(tabs) {
    if(tabs[0]){
        var port = chrome.tabs.connect(tabs[0].id);
        
        port.onMessage.addListener(function (msg) {            
            let orders = localStorage.getItem("orders");        
            if(orders) orders = JSON.parse(orders); else orders = [];

            msg = msg.orders;

            for(let i = 0; i < msg.length; ++i){
                if(!orders.find((element, index, array)=>{
                    return element.orderId == msg[i].orderId;
                })){
                    orders.push({
                        fiatAmount: msg[i].fiatAmount,
                        btcAmount: msg[i].btcAmount,
                        orderAction: msg[i].orderAction,
                        orderId: msg[i].orderId,
                        orderStatus: msg[i].orderStatus,
                        orderDate: msg[i].orderDate
                    });
                }
            }
            
            calcPNL(orders);
            localStorage.setItem("orders", JSON.stringify(orders));
        });
    }
  });

let orders = localStorage.getItem("orders");
if(orders){
    orders = JSON.parse(orders);
    calcPNL(orders);
}

//-------------------------------------------------------------------------------------------

function calcPNL(orders){
    let msummary = 0;
    let tsummary = 0;    
    let curDate = 0;

    for(let order of orders){        
        if(order.orderStatus == "Завершено"){

            curDate = (new Date(order.orderDate));
            let num = Number.parseInt(order.fiatAmount.replaceAll(",", "").split(".")[0]);

            //month pnl
            if(
                curDate.getFullYear() == (new Date()).getFullYear() &&
                curDate.getMonth() == (new Date()).getMonth()
            ){
                if(order.orderAction == "Продать"){
                    msummary += num;
                }else{
                    msummary -= num;
                }
            }

            //day pnl            
            if(
                curDate.getDate() == (new Date()).getDate() &&
                curDate.getMonth() == (new Date()).getMonth() &&
                curDate.getFullYear() == (new Date()).getFullYear()
            ){
                if(order.orderAction == "Продать"){
                    tsummary += num;
                }else{
                    tsummary -= num;
                }
            }
        }
    }

    let mpnl = document.getElementById("mPNL");
    let tpnl = document.getElementById("tPNL");
    if(msummary > 0){
        mpnl.style.color = "green";
    }else{
        mpnl.style.color = "red";
    }

    if(tsummary > 0){
        tpnl.style.color = "green";
    }else{
        tpnl.style.color = "red";
    }
    mpnl.innerHTML = msummary + " RUB";
    tpnl.innerHTML = tsummary + " RUB";
}

document.addEventListener("keydown", (event)=>{
    if(event.key == "d"){
        localStorage.clear();
    }
});

//-------------------------------------------------------------------------------------------

document.getElementById("tdf").addEventListener("click", ()=>{
    document.getElementById("tdf").value = "+" + document.getElementById("tid").value;
});