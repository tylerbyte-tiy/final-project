var budgetController = (function() {
  var data = {
    allItems: {
      income: [],
      expense: []
    },
    totals: {
      income: 0,
      expense: 0
    },
    budget: 0
  };
  var income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };
  return {
    addItem: function(type, des, val) {
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id +1;
      } else {
        ID = 0;
      }

      if (type === 'expense') {
        newItem =new Expense(ID, des, val);
      } else if (type === 'income') {
        newItem = new Income(ID, des, val)
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;

      var ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function() {
      calculateTotal('expense');
      calculateTotal('income');
      data.budget = data.totals.income - data.totals.expense;
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense
      }
    }

  };
})();

var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    container: '.container',
    dateLabel: '.budget__title--month'
  };
  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];

    if (int.length > 3) {
      int = int.subtr(0, int.length -3) + ',' + int.substr(int.length - 3, 3);
    };
    dec = numSplit[1];

    return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
  };
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    };
  };

  return {
    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

      addListItem: function(obj, type) {
        var html, newHtml, element, fields, fieldsArr;

        if (type == 'income') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'expense') {
				element = DOMstrings.expensesContainer;
				 html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>' +
        // <div class="item__percentage">21%</div>
        '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			};
      newHtml = html.replace('%id%', obj.id);
      newHtml = html.replace('%description%', obj.description);
      newHtml = html.replace('%value%', formatNumber(obj.value, type));
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields: function() {
      fields = document.querySelectorAll(DOMstrings.ininputDescription + ',' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'income' : type = 'expense';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber (obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber (obj.totalIncome, 'income');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber (obj.totalExpenses, 'expense');
    },
    displayMonth: function() {
      var now, year, month;
      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      year = now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent = month[month] + ' ' + year;
    },
    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

        nodeListForEach(fields, function(current, index) {
          current.classList.toggle('red-focus')
        });
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
    }
})();

var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };
  var updateBudget = function() {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };
  var ctrlAddItem = function() {
    var input, newItem;
    input = UICtrl.getInput();

    if (input.description !== "" && isNaN(input.value) && input.value > 0) {
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      UICtrl.clearFields();
      updateBudget();
    }
  };
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      budgetCtrl.deleteItem(type, ID);
      UICtrl.deleteListItem(itemID);
      updateBudget();
    }
  };
  return {
    init: function() {
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0
      });
      setupEventListeners();
    }
  }
})(budgetController, UIController);
controller.init();
