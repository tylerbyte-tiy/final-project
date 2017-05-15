//BUDGET CONTROLLER
const budgetController = (function(){

	const Expense = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};


	const Income = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};

	const calculateTotal = function(type) {

		let sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.value;
		});
		data.totals[type] = sum;
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
		percentage: -1
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

		deleteItem: function(type, id) {


			const ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}

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
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budgetValue',
		incomeLabel: '.budgetIncomeValue',
		expensesLabel: '.budget__expenses--value',
		container: '.container',
		dateLabel: '.budgetTitle--month'
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

		addListItem: function(obj,type) {

			let html, newHtml,element, fields, fieldsArr;

			if (type == 'income') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-times" aria-hidden="true"></i></button></div></div></div>';
			} else if (type === 'expense') {
				element = DOMstrings.expensesContainer;

				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-times" aria-hidden="true"></i></button></div></div></div>'
			};
			// Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			// Insert the HTML
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {

			const el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
      console.log("A list item has been deleted!");
		},

		clearFields: function() {

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

			let now, year, month;

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

		document.addEventListener('keypress', function(event){

			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

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

	const ctrlDeleteItem = function(event) {
    console.log("I just clicked the delete button");
		let itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

		if (itemID) {

			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// Delete item from the data structure
			budgetCtrl.ctrlDeleteItem(type, ID);
			// Delete the item from the UI
			UICtrl.deleteListItem(itemID);
			// Update and show the new budget
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
