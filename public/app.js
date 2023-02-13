let accountData = [
    {
        id:202301001,
        type:"debit",
        date:20230101,
        account:"sale",
        amount:200,
        myFileVal:"file.pdf" 
    },
        {
        id:202301001,
        type:"credit",
        date:20230101,
        account:"HSBC",
        amount:200,
        myFileVal:"file.pdf" 
    },
        {
        id:202301002,
        type:"debit",
        date:20230105,
        account:"promotion",
        amount:1200,
        myFileVal:"receipt.pdf" 
    }
];

let typeVal = "";
let dateVal = "";
let accountVal = "";
let amountVal = 0;
let myFileVal = "";
let idSeed = 0;
let accountID = 0;
let idList = ["202301001","202301002"];


function handleAccountTitle(id){
    console.log(id)
    if(id === "debit"){
        //change title
        document.querySelector(`label[for="account"]`).innerHTML = `Debit Account`;
        //show new account
        document.querySelector("#newAccountID").classList.remove("hidden");
        document.querySelector("#account").innerHTML = accountID;
        //hide exist account
        document.querySelector("#existAccountID").classList.add("hidden");
    } else if(id === "credit"){
        //change title
        document.querySelector(`label[for="account"]`).innerHTML = `Credit Account`;
        //hide new account
        document.querySelector("#newAccountID").classList.add("hidden");
        //add exist ID option
        let idOption = "";
        for (let i = 0; i < idList.length; i++) {
            idOption+= `<option value="${idList[i]}">`
        }
        document.querySelector("#existAccountID").classList.remove("hidden");
        //show exist ID
        document.querySelector(`datalist[id="existAccountID]`);
    }
}

function submitVal(e){
    e.preventdefault();

    if (document.querySelector('input[name="type"]').checked === false){
        return;
    }
    //save form data
    typeVal = document.querySelector('input[name="type"]:checked').id 
    dateVal = document.querySelector("#date").value;
    accountVal = document.querySelector("#account").value;
    amountVal = document.querySelector("#amount").value;
    myFileVal = document.querySelector("#myFile").value;

    console.log(typeVal)
    console.log(dateVal)
    console.log(accountVal)
    console.log(amountVal)
    console.log(myFileVal)

    //generate accountID
    let idYear = dateVal.slice(0,4);
    let idMonth = dateVal.slice(5,7);
    idSeed++;
    let fullID = "";
    if(idSeed<10){
        fullID = "00"+idSeed.toString();
    }else if(idSeed<100){
        fullID = "0"+idSeed.toString();
    }else{
        fullID=idSeed;
    }
    let accountID = idYear + idMonth + fullID;
    idList.push(accountID);
    let idList = [];
    console.log(accountID);
    //create object
    inputData = {
        id:accountID,
        type:typeVal,
        date:dateVal,
        account:accountVal,
        amount:amountVal,
        myFileVal:myFileVal
    }
    accountData.push(inputData);
    console.log(accountData);
}


// function init(){
//     getAllData();
// };

// function getAllData(){
//     fetch("/data").then(function(response){
//         return response.json();
//     }).then(function(responseData){
//         console.log(responseData);
//         stockData = responseData;
//     })
// }

function renderTable(){
    for (let i = 0; i < accountData.length; i++) {
        //debit account make new item
        let resultHTML = "";
        if(accountData[i].type ==="debit"){
            resultHTML+=`
            <div class="sheet-item" id="${accountData[i].id}">
                <div class="sheet-item-left">
                    <ul class="debit-item">
                        <li>${accountData[i].type}</li>
                        <li>${accountData[i].id}</li>
                        <li>${accountData[i].date}</li>
                        <li>${accountData[i].account}</li>
                        <li>${accountData[i].amount}</li>
                    </ul>
                    <ul class="credit-item" id="credit${accountData[i].id}">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div class="sheet-item-right">
                    ${accountData[i].myFileVal}
                </div>
            </div>
            `;
            document.querySelector("#itemContainer").innerHTML+=resultHTML;
        }
        if(accountData[i].type ==="credit"){
            resultHTML+=`
                <li>${accountData[i].type}</li>
                <li>${accountData[i].id}</li>
                <li>${accountData[i].date}</li>
                <li>${accountData[i].account}</li>
                <li>${accountData[i].amount}</li>
            `;
            // document.getElementById(`credit${accountData[i].id}]`).innerHTML+=resultHTML;
        }
    }
}
// init();
