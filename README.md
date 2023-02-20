**Accountant's journal**

An app for accountant to enter their journal and prepare for a full set of financial statements.

The attachment next to the jorunal allows manager to easily review the journal's supportings.  Easier retrieval of the supporting for auditors.


**How to use**
1) Enter the date for the document.   (Credit line is automatically the same)
2) Enter the account for the entry: (e.g. Debit Rent, Credit HSBC)
3) Enter the amount.  (Credit line is automatically the same)
4) The inputted data is shown below the input interface.


Note: 
Journal ID is automatically generated.

**Architecture:** 

**Frontend:** 
Handlebars
Passport authentication
User data entry - POST request
Display of data from database - GET request
Javascript to do the subtotal calculation

**Backend:**
Express application broken into modules.
Database: Postgres



Further features we'll add if we have time:
1) A full page for Profit and Loss account and Balance Sheet
2) The journal can be deleted after posting.
3) The journal is editable after posting
4) Document can be uploaded next to the journal.



**Project is done by:**

Harry Shing
Sam Yip

