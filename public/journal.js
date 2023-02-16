// $(() => {
//   // Add an event listener on the add button, such then when we press the button we grab the value from our text box and then send that value to our server in our post request, then we receive the new data from our server and reload all of our notes.
//   $("#user_input").submit((e) => {
//     e.preventDefault();

//     if ($("#debitAccount").val() === "") {
//       return;
//     }
//     var val = $("#debitAccount").val();
//     $("#debitAccount").val("");
//     axios
//       .post("/api/journal_db/", {
//         debitAccount: val,
//       })
//       .then((res) => {
//         reloadNotes(res.data);
//       })
//       .catch((err) => {
//         window.location.reload();
//       });
//   });
// });
