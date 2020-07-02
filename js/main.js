// Controls, calculates and stores the budeget 

var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
   
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercent = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercent = function() {
        return this.percentage;
    };

    var data = {
        allItems:{
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type) {

        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });

        data.totals[type] = sum;
    };

    return {
        addItem: function(type, description, value) {
            var id, newItem

            // Create an id
            if (data.allItems[type].length > 0 ){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on type 'inc' or 'exp'
            if(type === 'exp') {
                newItem = new Expense(id, description, value);
            } else if (type === 'inc') {
                newItem = new Income(id, description, value);
            }

            // Push data into the data structure
            data.allItems[type].push(newItem);

            return newItem;
        },
        deleteItem: function(type, id) {
            var ids, index;
    
            ids = data.allItems[type].map(function(cur) {
                return cur.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },
        calculateBudget: function() {
            // 1. Calculate total income and expense
                calculateTotal('inc');
                calculateTotal('exp');
            // 2. Calculate the budget: income - expense
                 data.budget = data.totals.inc - data.totals.exp;
            // 3. Calculate the percentage of income that was spent
            // exp / inc * 100
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercent(data.totals.inc);
            });
        },
        getPercentages: function() {
            var allPercentage = data.allItems.exp.map(function(cur){
                return cur.getPercent();
            });
            return allPercentage;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);
        }
    }



})();

// Controls the User Interface

var UIController = (function(){

    var DOMStrings = {
        inputMode: '#changeMode',
        inputDescription: '#add__description',
        inputValue: '#add__value',
        inputBtn: '#add__btn',
        showResult: '#results',
        displayBudget: '#current_budget',
        displayIncome: '#inc',
        displayExpense: '#exp',
        displayPercentage: '.percentage',
        container: '.main'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputMode).className,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            element = DOMStrings.showResult;

            // Create HTML strings

            if (type === 'inc') {
                html ='<div class="income" id="inc-%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__delete"><button><svg height="365.696pt" viewBox="0 0 365.696 365.696" width="365.696pt" xmlns="http://www.w3.org/2000/svg"><path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/></svg></button></div></div>';
            } else if (type === 'exp') {
                html ='<div class="expense" id="exp-%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__percentage">--</div><div class="item__delete"><button><svg height="365.696pt" viewBox="0 0 365.696 365.696" width="365.696pt" xmlns="http://www.w3.org/2000/svg"><path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/></svg></button></div></div>'
            }

            // Replace placeholder text with actual data (obj.data refers constructors from budget controller. In the app controller newItem variable stores the return newitem from the budgetController)

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert HTML into the DOM
            document.querySelector(DOMStrings.showResult).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItems: function(selectID) {
            var el = document.getElementById(selectID);
            el.parentNode.removeChild(el);
        },
        changeMode: function() {
           var change = document.querySelector(DOMStrings.inputMode);
            if (change.classList.contains('inc')) {
                change.classList.remove('inc');
                change.classList.add('exp');
            } else {
                change.classList.remove('exp');
                change.classList.add('inc');
            }

        },
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.displayBudget).textContent = "£ " + obj.budget;
            document.querySelector(DOMStrings.displayIncome).textContent = "£ " + obj.totalInc;
            document.querySelector(DOMStrings.displayExpense).textContent = "£ "+ obj.totalExp;

            if (obj.percentage > 0){
                document.querySelector(DOMStrings.displayPercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.displayPercentage).textContent = '---';
            }
            
            

        },
        clearFields: function() {
            var fields, fieldsArr, defaultMode;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(cur){
                cur.value = '';
            });

            // optional: Can be removed
            defaultMode = document.querySelector(DOMStrings.inputMode);

            if (defaultMode.className === 'exp') {
                defaultMode.classList.remove('exp');
                defaultMode.classList.add('inc');
            }

            fieldsArr[0].focus();

        },
        getDOMStrings: function() {
            return DOMStrings;
        }
    }

})();

// Sets off events which used by the budegetController and UIController

var appController = (function(bdCtlr,uiCtlr){

    var setupEventListeners = function () {

        var DOM = uiCtlr.getDOMStrings();

        var changeQuery = document.querySelector(DOM.inputMode);
        changeQuery.addEventListener('click', function(){
            uiCtlr.changeMode();
        });

        // Submit/Add button click event
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }   
        });

        // Delete event 
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updatedBudget = function() {

        var budget;

        // 1. Calculate the budget
            bdCtlr.calculateBudget();
        // 2. Return the budget
             budget = bdCtlr.getBudget();
        // 3. Display the budget on the UI
            uiCtlr.displayBudget(budget);
    };

    var updatePercentages = function() {
        bdCtlr.calculatePercentages();
        var percent = bdCtlr.getPercentages();
        console.log(percent);
    }

    var ctrlAddItem = function () {

        // 1. Get the field input data
        var input = uiCtlr.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            var newItem = bdCtlr.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            uiCtlr.addListItem(newItem, input.type);
            uiCtlr.clearFields();
            // 4. Calculate the budget
            updatedBudget();
            // 5. Display the budget on the UI
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, id;
        itemID = e.target.parentNode.parentNode.id;
    
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            // Delete event from data structure
            bdCtlr.deleteItem(type, id);
            uiCtlr.deleteListItems(itemID);
        }
        updatedBudget();
        updatePercentages();
        
    };

    
    return {
        init:function() {
            console.log('The app has started');
            uiCtlr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });          
            setupEventListeners();
        }
    };
    

})(budgetController, UIController);

appController.init();
