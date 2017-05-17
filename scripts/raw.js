"use strict"

//BUDGET CONTROLLER
const budgetController = (function(){

	const Income = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};

	const Expense = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};

	const data = {
		allItems: {
			expense: [],
			income: []
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget: 0,
	};

	const calculateTotal = function(type) {

		let sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.value;
		});
		data.totals[type] = sum;
	};

	return {
		addItem: function(type, des, val) {

			let newItem, ID;
			// create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}


			//Create new item
			if (type === 'expense') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'income') {
				newItem = new Income(ID, des, val);
			}

			// Push it into data structure
			data.allItems[type].push(newItem);
			return newItem;
		},

		calculateBudget: function() {

			// calculate total income and expenses
			calculateTotal('expense');
			calculateTotal('income');
			// calculate the budget: income - expenses
			data.budget = data.totals.income - data.totals.expense
		},

		getBudget: function() {

			return {
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExpense: data.totals.expense,
			}
		}
	};

})();

// UI CONTROLLER
const UIController = (function() {

	const DOMstrings = {
		inputType: '.addType',
		inputDescription: '.addDescription',
		inputValue: '.addValue',
		inputBtn: '.addBtn',
		incomeContainer: '.incomeList',
		expensesContainer: '.expensesList',
		budgetLabel: '.budgetValue',
		incomeLabel: '.budgetIncomeValue',
		expensesLabel: '.budgetExpensesValue',
		container: '.container',
		dateLabel: '.budgetTitleMonth'
	};

	const formatNumber = function(num, type) {

		num = Math.abs(num);
		num = num.toFixed(2);

		const numSplit = num.split('.');

		let int = numSplit[0];

		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		};

		const dec = numSplit[1];

		return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;

	};

	const nodeListForEach = function(list, cb) {

		for (let i = 0; i < list.length; i++) {
			cb(list[i], i);
		};
	};

	return {
		getInput: function() {

			return {
				type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {

			let html, newHtml, element;

			if (type == 'income') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="itemDescription">%description%</div><div class="right clearfix"><div class="itemValue">%value%</div></div></div>';
			} else if (type === 'expense') {
				element = DOMstrings.expensesContainer;

				html = '<div class="item clearfix" id="expense-%id%"><div class="itemDescription">%description%</div><div class="right clearfix"><div class="itemValue">%value%</div></div></div>'
			};
			// Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			// Insert the HTML
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: function() {

			let fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {

			let type;

			obj.budget > 0 ? type = 'income' : type = 'expense';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExpense, 'expense');
		},

		displayMonth: function() {

			let now, year, month, months;

			now = new Date();

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			month = now.getMonth();

			year = now.getFullYear();

			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

		},

		changedType: function() {

			const fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function(current, index) {
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	}

})();



//GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

	const setupEventListeners = function() {

		const DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		// Press enter to to add income/expense -->
		document.addEventListener('keypress', function(event){

			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
		// toggle green and red checkmark
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};
	const updateBudget = function() {

		// Calculate budget
		budgetCtrl.calculateBudget();
		// Return the budget
		const budget = budgetCtrl.getBudget();
		// Display the budget on UI
		UICtrl.displayBudget(budget);
    console.log("The budget has been updated!");
	};


	const ctrlAddItem = function() {

		let input, newItem;
		// Get field input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// add item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// add the item to UI
			UICtrl.addListItem(newItem, input.type);
			// clear the fields
			UICtrl.clearFields();
			// calculate and update budget
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
