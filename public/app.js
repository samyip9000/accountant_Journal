let profitAndLossData = {};

let idSeed = 0;

// when date clicked
function handleDate() {
  let date = document.querySelector("#debitDate").value;
  console.log(date);
  document.querySelector("#creditDate").value = date;
  handleJournalID(date);
}

function handleJournalID(date) {
  //generate journalID
  let idYear = date.slice(0, 4);
  let idMonth = date.slice(5, 7);
  let fullID = "";
  if (idSeed < 10) {
    fullID = "00" + idSeed.toString();
  } else if (idSeed < 100) {
    fullID = "0" + idSeed.toString();
  } else {
    fullID = idSeed;
  }
  let journalID = idYear + idMonth + fullID;
  document.querySelector("#debitJournalId").value = journalID;
  document.querySelector("#creditJournalId").value = journalID;

  console.log(journalID);
}

function handleAmount() {
  let amount = document.querySelector("#debitAmount").value;
  console.log(amount);
  document.querySelector("#creditAmount").value = amount;
}

function handleFileName() {
  console.log(document.querySelector("#myFile").value);
}

const submitForm = document.querySelector(".input-form");
submitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event);
  //if the input is not fill, it return
  //   if (
  //     document.querySelector("#date").value === "" ||
  //     document.querySelector("#debitAccount").value === "" ||
  //     document.querySelector("#debitAmount").value === "" ||
  //     document.querySelector("#myFile").value === "" ||
  //     document.querySelector("#creditAccount").value === "" ||
  //     document.querySelector("#creditAmount").value === "" ||
  //     //if creditAmount and debitAmount are same, it return
  //     document.querySelector("#creditAmount").value ===
  //       document.querySelector("#debitAmount").value
  //   ) {
  //     alert("fail");
  //   }

  //
  //save debit form data
  const debitData = {
    journal_id: document.querySelector("#debitJournalId").value,
    type: "debit",
    date: document.querySelector("#debitDate").value,
    account: document.querySelector("#debitAccount").value,
    amount: document.querySelector("#debitAmount").value,
    //backEndCalculation: document.querySelector("#debitAmount").value,
    user_id: 1
    //myFileVal: document.querySelector("#myFile").value,
  };
  //save credit form data
  const creditData = {
    journal_id: document.querySelector("#creditJournalId").value,
    type: "credit",
    date: document.querySelector("#creditDate").value,
    account: document.querySelector("#creditAccount").value,
    amount: document.querySelector("#creditAmount").value,
    //backEndCalculation: -document.querySelector("#debitAmount").value,
    user_id:1
    //myFileVal: document.querySelector("#myFile").value,
  };

  //create object
  console.log(debitData);
  console.log(creditData);
  //updateidSeed
  idSeed++;

  //handle formdata
 // document.write(formData);
  // fs.writeFileSync('stores/accountData.json', debitData);

  fetch("/api/accountData", {
    body: JSON.stringify({debitData, creditData}),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  })
    .then(function (response) {
      return response;
    })
    .then(function (responseData) {
      console.log(responseData);
    });
  // renderTable();
});

function init() {
  fetch("/api/accountData")
    .then(function (response) {
      return response.json();
    })
    .then(function (responseData) {
      console.log(responseData);
      idSeed = responseData.length / 2 + 1;
      renderTable(responseData);
    });
  renderProfitAndLoss();
}

function renderTable(accountData) {
  for (let i = 0; i < accountData.length - 1; i++) {
    //debit account make new item
    let resultHTML = "";
    if (i === 0 || i % 2 === 0) {
      resultHTML += `
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
                            <li>${accountData[i + 1].id}</li>
                            <li>Credit</li>
                            <li>${accountData[i + 1].date}</li>
                            <li>${accountData[i + 1].account}</li>
                            <li>${accountData[i + 1].amount}</li>
                        </ul>
                    </div>
                    <div class="sheet-item-right">
                        <a class='file' href="/uploaded/${
                          accountData[i].myFileVal
                        }">${accountData[i].myFileVal}</a>
                    </div>
                </div>
            `;
    }
    document.querySelector("#itemContainer").innerHTML += resultHTML;
  }
}

function renderProfitAndLoss() {
  fetch("/api/accountData")
    .then(function (response) {
      return response.json();
    })
    .then(function (responseData) {
      console.log(responseData);
      counterProfitAndLoss(responseData);
      document.querySelector(".loss").innerHTML = "";
      document.querySelector(".profit").innerHTML = "";
      let resultHTMLoss = "";
      let resultHTMProfit = "";
      for (let key in profitAndLossData) {
        let value;
        value = profitAndLossData[key];
        if (value <= 0) {
          resultHTMLoss += `
                    <div class="loss-item">
                        <p>${key}</p>
                        <span>(${value})</span>
                    </div>
                `;
        } else {
          resultHTMProfit += `
                    <div class="profit-item">
                        <p>${key}</p>
                        <span>${value}</span>
                    </div>
                `;
        }
      }

      document.querySelector(".loss").innerHTML += resultHTMLoss;
      document.querySelector(".profit").innerHTML += resultHTMProfit;
    });
}

function counterProfitAndLoss(accountData) {
  //make accountList
  let allAccountArray = [];
  for (let i = 0; i < accountData.length; i++) {
    allAccountArray.push(accountData[i].account);
  }

  let accountList = [...new Set(allAccountArray)];

  for (let i = 0; i < accountData.length; i++) {
    for (let j = 0; j < accountList.length; j++) {
      if (accountList[j] === accountData[i].account) {
        if (profitAndLossData.hasOwnProperty(accountList[j])) {
          profitAndLossData[accountList[j]] +=
            accountData[i].backEndCalculation;
        } else {
          profitAndLossData[accountList[j]] = accountData[i].backEndCalculation;
        }
      }
    }
  }
  console.log(profitAndLossData);
  return profitAndLossData;
}

init();
