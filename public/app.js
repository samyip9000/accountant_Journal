app.js;
let accountData = [
  {
    id: 202301001,
    type: "debit",
    date: 20230101,
    account: "Sale",
    amount: 200,
    myFileVal: "202301001receipt.png",
  },
  {
    id: 202301001,
    type: "credit",
    date: 20230101,
    account: "HSBC",
    amount: 200,
    myFileVal: "202301001receipt.png",
  },
  {
    id: 202301002,
    type: "debit",
    date: 20230102,
    account: "Promotion",
    amount: 1200,
    myFileVal: "202301002receipt.png",
  },
  {
    id: 202301002,
    type: "debit",
    date: 20230102,
    account: "Heng Seng Bank",
    amount: 1200,
    myFileVal: "202301002receipt.png",
  },
];

let creditAccountList = ["Total", "HSBC", "Heng Seng Bank"];

let idSeed = 1;
let idList = ["202301001", "202301002"];

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

  idList.push(journalID);
  console.idList;
  idSeed++;
}

function handleAmount() {
  let amount = document.querySelector("#debitAmount").value;
  console.log(amount);
  document.querySelector("#creditAmount").value = amount;
}

function submitVal(e) {
  e.preventdefault();
  //if the input is not fill, it return
  if (
    document.querySelector("#date").value === "" ||
    document.querySelector("#debitAccount").value === "" ||
    document.querySelector("#debitAmount").value === "" ||
    document.querySelector("#myFile").value === "" ||
    document.querySelector("#creditAccount").value === "" ||
    document.querySelector("#creditAmount").value === ""
  ) {
    return;
  }
  //save debit form data
  debitData = {
    id: document.querySelector("#debitJournalId").value,
    type: "debit",
    date: document.querySelector("#date").value,
    account: document.querySelector("#debitAccount").value,
    amount: document.querySelector("#debitAmount").value,
    myFile: document.querySelector("#myFile").value,
  };
  //save credit form data
  creditData = {
    id: document.querySelector("#creditJournalId").value,
    type: "credit",
    date: document.querySelector("#date").value,
    account: document.querySelector("#creditAccount").value,
    amount: document.querySelector("#creditAmount").value,
    myFile: document.querySelector("#myFile").value,
  };

  //create object
  accountData.push(debitData);
  accountData.push(creditData);
  console.log(accountData);

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

function init() {
  renderTable();
  counterProfitAndLoss();
}

function renderTable() {
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

function counterProfitAndLoss() {
  //total P&L
  let totalProfitAndLoss = 0;
  for (let i = 0; i < accountData.length; i++) {
    if (i === 0 || i % 2 === 0) {
      totalProfitAndLoss += accountData[i].amount;
    }
  }
  document.querySelector("#totalProfitAndLoss").innerHTML = totalProfitAndLoss;

  //Credit Account P&L
  for (let i = 0; i < creditAccountList.length; i++) {
    let creditAccount = creditAccountList[i];
  }
}

init();
