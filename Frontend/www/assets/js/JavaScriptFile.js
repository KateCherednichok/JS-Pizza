import { pizza_info } from "../../../src/Pizza_List.js";

const pizzaList = document.getElementById('pizza-list');
let sumOfOrder=0;
let numberOfOrderedTypes=0;
let types=[];
//localStorage.clear();
const allOrder = localStorage.getItem('pizza')
    ? JSON.parse(localStorage.getItem('pizza'))
    : [
        { kind: pizza_info[0], amount: 1, sizeBig: true},
        { kind: pizza_info[1], amount: 2, sizeBig: true },
        { kind: pizza_info[2], amount: 3, sizeBig: false }
    ];
allOrder.forEach(order => drawBuyList(order));
console.log(allOrder);
pizza_info.forEach(pizza=>draw(pizza));
//drawBuyList(pizza_info[0]);

const allButton = document.getElementById('all');
const vegaButton = document.getElementById('vega');
const meatButton = document.getElementById('meat');
const mushroomsButton = document.getElementById('mushrooms');
const pineappleButton = document.getElementById('pineapple');
const seeFoodButton = document.getElementById('see-food');
let activeButton = allButton;

document.addEventListener('click', function (event){
    let button = event.target;
    if(button === vegaButton||button === meatButton||button === mushroomsButton||button === pineappleButton||button === seeFoodButton||button === allButton){
        if( button!==activeButton) {
            clearWindow();
            activeButton.classList.remove('active');
            button.classList.add('active');
            activeButton = button;
            if (button === vegaButton) {
                createVega();
            } else if (button === meatButton) {
                createMeat();
            } else if (button === mushroomsButton) {
                createMushrooms();
            } else if (button === pineappleButton) {
                createPineapple();
            } else if (button === seeFoodButton) {
                createSeeFood();
            }
            else if (button === allButton){
                pizza_info.forEach(pizza=>draw(pizza));
                changeAmount(8);
            }
        }
    }
    else if(button.classList.contains('buy-small')||button.classList.contains('buy-big')){
        addToOrder(button);
    }
    else if(button.classList.contains('plus')){
        let obj = findPizza(button.parentElement.parentElement.classList);
        addOne(button.previousElementSibling,obj.kind.title,obj.sizeBig);
    }
    else if(button.classList.contains('minus')){
        let classList = button.parentElement.parentElement.classList;
        let obj = findPizza(classList);
        if(obj.amount===1){
            removeOne(obj);
            let toRemove=button.parentElement.parentElement.parentElement;
            toRemove.remove();
            if(checkIfItIsOnlyOne(classList)===undefined){
                numberOfOrderedTypes--;
                changeNumberOfOrderedTypes();
            }
        }
        else {
            removeOnePortion(button.nextElementSibling, obj.kind.title,obj.sizeBig);
        }
    }
    else if(button.classList.contains('remove-all')){
        removeAll();
        console.log(allOrder.length);
    }
    else if(button.classList.contains('remove')){
        let classList = button.parentElement.parentElement.classList;
        let obj = findPizza(classList);
        removeOne(obj);
        let toRemove=button.parentElement.parentElement.parentElement;
        toRemove.remove();
        if(checkIfItIsOnlyOne(classList)===undefined){
            numberOfOrderedTypes--;
            changeNumberOfOrderedTypes();
        }
    }
})

function clearWindow(){
    pizzaList.innerHTML='';
}

function changeAmount(newAmount){
    document.getElementsByClassName('amount-in-this-category')[0].innerHTML=newAmount;
}

function createVega(){
    let amount=0;
    for(let i=0;i<pizza_info.length; i++){
        if(pizza_info[i].type==='Вега піца'){
            amount++;
            draw(pizza_info[i]);
        }
    }
    changeAmount(amount);
}

function createMeat(){
    let amount=0;
    for(let i=0;i<pizza_info.length; i++){
        if(pizza_info[i].type==='М’ясна піца'){
            amount++;
            draw(pizza_info[i]);
        }
    }
    changeAmount(amount);
}

function createSeeFood(){
    let amount=0;
    for(let i=0;i<pizza_info.length; i++){
        if(pizza_info[i].type==='Морська піца'){
            amount++;
            draw(pizza_info[i]);
        }
    }
    changeAmount(amount);
}

function createMushrooms(){
    let amount=0;
    for(let i=0;i<pizza_info.length; i++){
        if(pizza_info[i].content.mushroom!==undefined){
            amount++;
            draw(pizza_info[i]);
        }
    }
    changeAmount(amount);
}

function createPineapple(){
    let amount=0;
    for(let i=0;i<pizza_info.length; i++){
        if(pizza_info[i].content.pineapple!==undefined){
            amount++;
            draw(pizza_info[i]);
        }
    }
    changeAmount(amount);
}

function draw(pizzaData) {
    let marks = ``;
    if (pizzaData.is_new) {
        marks += `<span class="new-pizza">Нова</span>`;
    }
    if (pizzaData.is_popular) {
        marks += `<span class="popular">Популярна</span>`;
    }
    let topInfo = `<div style="position: relative">
                        <div style="position: absolute; top: -15px; right: -15px; display: flex; justify-content: flex-end;">${marks}</div>
                       </div>`;
    let sizeAvailable = ``;

    if (pizzaData.small_size !== undefined) {
        sizeAvailable += `<div>
                        <div class="size-p">
                        <img src="assets/images/size-icon.svg"/>${pizzaData.small_size.size}
                        </div>
                        <div class="size-p">
                        <img src="assets/images/weight.svg"/>${pizzaData.small_size.weight}
                        </div>
                        <div class="price-p">
                        ${pizzaData.small_size.price}
                        <p>грн</p>
                        </div>
                        <button class="buy-small">Купити</button>
                       </div>
                    `;
    }
    if (pizzaData.big_size !== undefined) {
        sizeAvailable += `<div>
                        <div class="size-p">
                        <img src="assets/images/size-icon.svg"/>${pizzaData.big_size.size}
                        </div>
                        <div class="size-p">
                        <img src="assets/images/weight.svg"/>${pizzaData.big_size.weight}
                        </div>
                        <div class="price-p">
                        ${pizzaData.big_size.price}
                        <p>грн</p>
                        </div>
                        <button class="buy-big">Купити</button>
                       </div>
                    `;
    }

    pizzaList.innerHTML += `<div class="col-sm-6 col-md-4 resize">
                    <div class="thumbnail pizza-card">
                        ${topInfo}
                        <img src=${pizzaData.icon}>
                        <div class="caption">
                            <h3>${pizzaData.title}</h3>
                            <p class="description">${pizzaData.type}</p>
                            <p class="content">${[].concat(...Object.values(pizzaData.content)).join(", ")}</p>
                            <div class="buy-options">${sizeAvailable}</div>
                        </div>
                    </div>
                </div>`;
}

function drawBuyList(element){
    let item = document.createElement('div');
    item.classList.add('items-to-buy');
    let price=0;

    if(element.sizeBig===true) {
        price=element.kind.big_size.price*element.amount;
        item.innerHTML = `
                <div class="item-info big ${element.kind.title}">
                    <label>${element.kind.title} (Велика)
                    </label>
                    <div>
                        <img src="assets/images/size-icon.svg"/> ${element.kind.big_size.size}
                        <img src="assets/images/weight.svg"/>${element.kind.big_size.weight}
                    </div>
                    <div class="last-line">
                        <h4><span>${price}</span> грн</h4>
                        <button class="minus">−</button>
                        <label class="counter">${element.amount}</label>
                        <button class="plus">+</button>
                        <button class="remove">✖</button>
                    </div>
                </div>

                <div class="item-image">
                    <img src="assets/images/pizza_2.jpg"/>
                </div>`;
    }
    else {
        price=element.kind.small_size.price*element.amount;
        item.innerHTML = `
                <div class="item-info small ${element.kind.title}">
                    <label>${element.kind.title} (Мала)
                    </label>
                    <div>
                        <img src="assets/images/size-icon.svg"/> ${element.kind.small_size.size}
                        <img src="assets/images/weight.svg"/>${element.kind.small_size.weight}
                    </div>
                    <div>
                        <h4><span>${price}</span> грн</h4>
                        <button class="minus">−</button>
                        <label class="counter">${element.amount}</label>
                        <button class="plus">+</button>
                        <button class="remove">✖</button>
                    </div>
                </div>

                <div class="item-image">
                    <img src="assets/images/pizza_2.jpg"/>
                </div>`;
    }
    changeSum(price);
    if(!types.includes(element.kind.title)){
        numberOfOrderedTypes++;
        changeNumberOfOrderedTypes();
        types.push(element.kind.title);
    }
    document.getElementsByClassName('buy-list')[0].appendChild(item);
}

function addToOrder(button){
    let typeOfPizza = button.parentElement.parentElement.parentElement.firstElementChild.textContent;
    if(button.classList.contains('buy-small')) {
        let allToBuy=document.getElementsByClassName(typeOfPizza);
        if(allToBuy.length!==0){
            for (let i=0; i<allToBuy.length; i++){
                if(allToBuy[i].classList.contains('item-info')&&
                    allToBuy[i].classList.contains('small')){
                    console.log(allToBuy[i]);
                    addOne(allToBuy[i].children[2].getElementsByClassName('counter')[0], typeOfPizza, false);
                    //Збільшити кількість
                    break;
                }
                else if(i===allToBuy.length-1){
                    console.log('need to be created');
                    drawBuyList(addPizzaInStorage(typeOfPizza, false));
                    // створити новий
                    break;
                }
            }
        }
        else {
            // numberOfOrderedTypes++;
            // changeNumberOfOrderedTypes();
            console.log('need to be created');
            drawBuyList(addPizzaInStorage(typeOfPizza, false));
        }
    }
    else if(button.classList.contains('buy-big')) {
        let allToBuy=document.getElementsByClassName(typeOfPizza);
        if(allToBuy.length!==0) {
            for (let i = 0; i < allToBuy.length; i++) {
                if (allToBuy[i].classList.contains('item-info') &&
                    allToBuy[i].classList.contains('big')) {
                    console.log(allToBuy[i]);
                    addOne(allToBuy[i].children[2].getElementsByClassName('counter')[0], typeOfPizza, true);
                    //Збільшити кількість
                    break;
                } else if(i===allToBuy.length-1){
                    console.log('need to be created');
                    drawBuyList(addPizzaInStorage(typeOfPizza, true));
                    break;
                }
            }
        }
        else {
            // numberOfOrderedTypes++;
            // changeNumberOfOrderedTypes();
            console.log('need to be created');
            drawBuyList(addPizzaInStorage(typeOfPizza, true));
        }
    }
}
//, 'item-info','small'

function findPizza(classes){
    if(classes.length===3){
        let size = classes[1];
        let name = classes[2];
        //console.log(name);
        return findInOrder(name, size);
    }
    else{
        let size = classes[1];
        let name = classes[2]+" "+classes[3];
        return findInOrder(name, size);
    }
}

function findInOrder(name, size){
    let big = false;
    if(size === 'big'){
        big=true;
    }
    for(let i=0; i<allOrder.length; i++){
        if(allOrder[i].kind.title===name&&allOrder[i].sizeBig===big){
            return allOrder[i];
        }
    }
    return undefined;
}

function checkIfItIsOnlyOne(classes) {
    if (classes.length === 3) {
        let name = classes[2];
        return find(name);
    } else {
        let name = classes[2] + " " + classes[3];
        return find(name);
    }
}

function find(name){
    for(let i=0; i<allOrder.length; i++){
        if(allOrder[i].kind.title===name){
            return allOrder[i];
        }
    }
    for (let i=0; i<types.length; i++){
        if(types[i]===name){
            types.splice(i,1);
            break;
        }
    }
    return undefined;
}

function changeSum(addedSum){
    sumOfOrder+=addedSum;
    //console.log(sumOfOrder);
    document.getElementsByClassName('number')[0].innerHTML=sumOfOrder;
}

function addOne(amount, typeOfPizza, big){
    let oldAmount = amount.innerHTML;
    oldAmount++;
    amount.innerHTML=oldAmount;
    changeAmountInStorage(typeOfPizza, oldAmount, big);
    let price=0;
    if(big) {
        price = findInOrder(typeOfPizza, 'big').kind.big_size.price;
    }
    else {
        price = findInOrder(typeOfPizza, 'small').kind.small_size.price;
    }
    changeSum(price);
    let old = amount.previousElementSibling.previousElementSibling.firstElementChild.innerHTML;
    old = parseInt(old);
    amount.previousElementSibling.previousElementSibling.firstElementChild.innerHTML=old+price;
}

function removeOnePortion(amount, typeOfPizza, big){
    let oldAmount = amount.innerHTML;
    oldAmount--;
    amount.innerHTML=oldAmount;
    changeAmountInStorage(typeOfPizza, oldAmount, big);
    let price=0;
    if(big) {
        price = 0-findInOrder(typeOfPizza, 'big').kind.big_size.price;
    }
    else {
        price = 0-findInOrder(typeOfPizza, 'small').kind.small_size.price;
    }
    changeSum(price);
    let old = amount.previousElementSibling.previousElementSibling.firstElementChild.innerHTML;
    old = parseInt(old);
    amount.previousElementSibling.previousElementSibling.firstElementChild.innerHTML=old+price;
}


function findInPizzaInfo(name){
    for(let i=0; i<pizza_info.length; i++){
        if(pizza_info[i].title===name){
            return pizza_info[i];
        }
    }
    return undefined;
}



function changeAmountInStorage(name, newAmount, size) {
    for (let i = 0; i < allOrder.length; i++) {
        if (allOrder[i].kind.title === name&&allOrder[i].sizeBig===size) {
            allOrder[i].amount = newAmount;
            localStorage.setItem("pizza", JSON.stringify(allOrder));
            console.log(allOrder);
            break;
        }
    }
}

function addPizzaInStorage(name, big) {
    let pizza=findInPizzaInfo(name);
    if(pizza!==undefined) {
        let p = {
            kind: pizza,
            amount: 1,
            sizeBig: big
        };
        allOrder.push(p);
        localStorage.setItem("pizza", JSON.stringify(allOrder));
        return p;
    }
    return undefined;
}

function removeAll(){
    allOrder.splice(0, allOrder.length);
    localStorage.setItem("pizza", JSON.stringify(allOrder));
    document.getElementsByClassName('buy-list')[0].innerHTML='';
    sumOfOrder=0;
    changeSum(0);
    numberOfOrderedTypes=0;
    types.splice(0,types.length);
    changeNumberOfOrderedTypes();
}

function removeOne(element){
    let amount = element.amount;
    console.log(element);
    let pricePerItem = 0;
    if(element.sizeBig){
        pricePerItem = element.kind.big_size.price;
    }
    else {
        pricePerItem = element.kind.small_size.price;
        console.log(pricePerItem);
    }
    console.log(pricePerItem);
    let toRemove = 0-(amount*pricePerItem);
    changeSum(toRemove);
    for(let i = 0; i < allOrder.length; i++) {
        if (allOrder[i]===element) {
            allOrder.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("pizza", JSON.stringify(allOrder));
}



function changeNumberOfOrderedTypes(){
    document.getElementsByClassName('amount-of-different-types')[0].innerHTML=numberOfOrderedTypes;
}


