console.log("app.js is hooked up!");

const balance = (function() {
  var input = [];
  var inputString = "";

  const incomeTotal = function(a, b, c, d, e) {
    let incSum = a+b+c+d+e;
    return incSum;
  };

  const expensesTotal = function(a, b, c, d, e) {
    let expSum = a+b+c+d+e;
    return expSum;
  };

  const balance = function(incomeTotal, expensesTotal) {
    let bal = incomeTotal - expensesTotal;
    return bal;
  }
})

balance();
// --------------------------
// Or maybe this is the way to do it?


function addListenerForIncomeSum() {
  const sumButton =document.querySelector("#totalIncome");
  button.addEventListener("click", function() {
    incomeTotal();
  })
}

function addListenerForExpensesSum() {
  const sumButton =document.querySelector("#totalExpenses");
  button.addEventListener("click", function() {
    expensesTotal();
  })
}

function addListenerForBalance() {
  const sumButton =document.querySelector("#balance");
  button.addEventListener("click", function() {
    expensesTotal();
  })
}
