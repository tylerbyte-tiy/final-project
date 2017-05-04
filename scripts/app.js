const balance = (function() {
  var input = [];
  var inputString = "";

  const incomeTotal = function(a, b, c, d, e) {
    let inSum = a+b+c+d+e;
    return inSum;
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
