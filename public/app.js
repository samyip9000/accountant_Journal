let accountData = [
    {
        "id":202301001,
        "type":"debit",
        "date":20230101,
        "account":"HSBC",
        "amount":100000,
        "backEndCalculation":100000,
        "myFileVal":"202301001receipt.png" 
    },
        {
        "id":202301001,
        "type":"credit",
        "date":20230101,
        "account":"Share Capital",
        "amount":100000,
        "backEndCalculation":-100000,
        "myFileVal":"202301001receipt.png" 
    },
    {
        "id":202301002,
        "type":"debit",
        "date":20230102,
        "account":"HSBC",
        "amount":80000,
        "backEndCalculation":80000,
        "myFileVal":"202301002receipt.png" 
    },
    {
        "id":202301002,
        "type":"credit",
        "date":20230102,
        "account":"Loan",
        "amount":80000,
        "backEndCalculation":-80000,
        "myFileVal":"202301002receipt.png" 
    },
    {
        "id":202301003,
        "type":"debit",
        "date":20230103,
        "account":"HSBC",
        "amount":40000,
        "backEndCalculation":40000,
        "myFileVal":"202301003receipt.png" 
    },
    {
        "id":202301003,
        "type":"credit",
        "date":20230103,
        "account":"Sales",
        "amount":40000,
        "backEndCalculation":-40000,
        "myFileVal":"202301003receipt.png" 
    },
    {
        "id":202301004,
        "type":"debit",
        "date":20230104,
        "account":"Inventory",
        "amount":20000,
        "backEndCalculation":20000,
        "myFileVal":"202301004receipt.png" 
    },
    {
        id:202301004,
        type:"credit",
        date:20230104,
        account:"HSBC",
        amount:20000,
        backEndCalculation:-20000,
        myFileVal:"202301004receipt.png" 
    },
    {
        id:202301004,
        type:"debit",
        date:20230105,
        account:"Cost of goods sold",
        amount:10000,
        backEndCalculation:10000,
        myFileVal:"202301005receipt.png" 
    },
    {
        id:202301004,
        type:"credit",
        date:20230105,
        account:"Inventory",
        amount:10000,
        backEndCalculation:-10000,
        myFileVal:"202301005receipt.png" 
    },
    {
        id:202301005,
        type:"debit",
        date:20230106,
        account:"Rent",
        amount:10000,
        backEndCalculation:10000,
        myFileVal:"202301006receipt.png" 
    },
    {
        id:202301005,
        type:"credit",
        date:20230106,
        account:"HSBC",
        amount:10000,
        backEndCalculation:-10000,
        myFileVal:"202301006receipt.png" 
    },
    {
        id:202301006,
        type:"debit",
        date:20230107,
        account:"Payroll",
        amount:8000,
        backEndCalculation:8000,
        myFileVal:"202301007receipt.png" 
    },
    {
        id:202301006,
        type:"credit",
        date:20230107,
        account:"HSBC",
        amount:8000,
        backEndCalculation:-8000,
        myFileVal:"202301007receipt.png" 
    }
];
let profitAndLossData={};

let creditAccountList=["Total" ,"HSBC", "HengSengBank"];

let idSeed = (accountData.length)/2+1;
let idList = ["202301001","202301002"];

// when date clicked
function handleDate(){
    let date = document.querySelector("#debitDate").value;
    console.log(date);
    document.querySelector("#creditDate").value = date;
    handleJournalID(date);
}

function handleJournalID(date){
    //generate journalID
    let idYear = date.slice(0,4);
    let idMonth = date.slice(5,7);
    let fullID = "";
    if(idSeed<10){
        fullID = "00"+idSeed.toString();
    }else if(idSeed<100){
        fullID = "0"+idSeed.toString();
    }else{
        fullID=idSeed;
    }
    let journalID = idYear + idMonth + fullID;
    document.querySelector("#debitJournalId").value = journalID;
    document.querySelector("#creditJournalId").value = journalID;

    console.log(journalID);

    idList.push(journalID);
    console.idList;
}

function handleAmount(){
    let amount = document.querySelector("#debitAmount").value;
    console.log(amount);
    document.querySelector("#creditAmount").value = amount;
}

function submitVal(e){
    e.preventdefault();
    //if the input is not fill, it return
    if (document.querySelector("#date").value === ""||
        document.querySelector("#debitAccount").value === ""||
        document.querySelector("#debitAmount").value === ""||
        document.querySelector("#myFile").value === ""||
        document.querySelector("#creditAccount").value === ""||
        document.querySelector("#creditAmount").value === ""||
        //if creditAmount and debitAmount are same, it return
        document.querySelector("#creditAmount").value===document.querySelector("#debitAmount").value
        ){
        return;
    }
    //save debit form data
    debitData = {
        id: document.querySelector("#debitJournalId").value,
        type:"debit",
        date: document.querySelector("#date").value,
        account: document.querySelector("#debitAccount").value,
        amount:document.querySelector("#debitAmount").value,
        backEndCalculation:document.querySelector("#debitAmount").value,
        myFile:document.querySelector("#myFile").value
    }
    //save credit form data
    creditData = {
        id: document.querySelector("#creditJournalId").value,
        type:"credit",
        date: document.querySelector("#date").value,
        account: document.querySelector("#creditAccount").value,
        amount:document.querySelector("#creditAmount").value,
        backEndCalculation: -document.querySelector("#debitAmount").value,
        myFile:document.querySelector("#myFile").value
    }
    
    //create object
    accountData.push(debitData);
    accountData.push(creditData);
    console.log(accountData);

    //updateidSeed
    idSeed++;

    //handle upload file
    var formData = new FormData();
    formData.append("file", $("#fileInput")[0].files[0]);
    console.log(formData);

    $.ajax({
        url: "/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
        console.log(response);
        fileList.append(
            `<a class='file' href="/uploaded/${response}">${response}</a><br /><button class="delete" data-name="${response}">Delete ${response}</button><br />`
        );
        },
    });

    renderTable();
}


function init(){
    renderTable();
};

function renderTable(){
    for (let i = 0; i < accountData.length-1; i++) {
        //debit account make new item
        let resultHTML = "";
        if(i === 0 ||i%2===0){  
            resultHTML+=`
                <div class="sheet-item">
                    <div class="sheet-item-left">
                        <ul class="debit-item">
                            <li>${accountData[i].id}</li>
                            <li>Debit</li>
                            <li>${accountData[i].date}</li>
                            <li>${accountData[i].account}</li>
                            <li>${accountData[i].amount}</li>
                        </ul>
                        <ul class="credit-item">
                            <li>${accountData[i+1].id}</li>
                            <li>Credit</li>
                            <li>${accountData[i+1].date}</li>
                            <li>${accountData[i+1].account}</li>
                            <li>${accountData[i+1].amount}</li>
                        </ul>
                    </div>
                    <div class="sheet-item-right">
                        <a class='file' href="/uploaded/${accountData[i].myFileVal}">${accountData[i].myFileVal}</a>
                    </div>
                </div>
            `;
        }
        document.querySelector("#itemContainer").innerHTML+=resultHTML;
    }
}

function renderProfitAndLoss(){

}

function counterProfitAndLoss(){
    
    //make accountList
    let allAccountArray =[];
    for (let i = 0; i < accountData.length; i++) {
        allAccountArray.push(accountData[i].account);
    }
    
    let accountList = [...new Set(allAccountArray)];;

    for (let i = 0; i < accountData.length; i++) {
        for (let j = 0; j < accountList.length; j++) {
            if(accountList[j]===accountData[i].account){
                if(profitAndLossData.hasOwnProperty(accountList[j])){
                    profitAndLossData[accountList[j]]+=accountData[i].backEndCalculation;
                } else{
                    profitAndLossData[accountList[j]]=accountData[i].backEndCalculation;
                }
            }
        }
    }
    console.log(profitAndLossData);
}

init();
