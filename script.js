// Initialize the balance if it doesn't exist
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

if (getCookie('UsingMedkit')) {
    console.log("UsingMedkit Exists");
} else {
    setCookie('UsingMedkit', 'false', 365); // 365 days, this will last for a year
}


function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

let balance = parseInt(getCookie("balance")) || 100; // Default balance: 100 coins
document.getElementById('balance').textContent = balance;

function getInventory() {
    const inventory = getCookie('inventory');
    return inventory ? JSON.parse(inventory) : {}; // Return parsed object or empty object if none found
}

// Function to save the inventory to the cookie
function setInventory(inventory) {
    setCookie('inventory', JSON.stringify(inventory), 7); // Save as a JSON string for 7 days
}

// Function to add an item to the inventory (example: 'Medkit')
function addItemToInventory(item) {
    let inventory = getInventory(); // Get current inventory

    // If the item already exists, increase the quantity, otherwise add it with quantity 1
    if (inventory[item]) {
        inventory[item]++;
    } else {
        inventory[item] = 1;
    }

    setInventory(inventory); // Save updated inventory to cookie
}

// Function to remove an item from the inventory
function removeItemFromInventory(item) {
    let inventory = getInventory();

    // If the item exists, decrease quantity or delete it
    if (inventory[item]) {
        inventory[item]--;
        if (inventory[item] <= 0) {
            delete inventory[item];
        }
    }

    setInventory(inventory); // Save updated inventory to cookie
}

// Update cookie and balance display
function updateBalance(amount) {
    balance += amount;
    setCookie("balance", balance, 7); // Store balance for 7 days
    document.getElementById('balance').textContent = balance;
}

// Coin Flip Game
function coinFlip() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Choose Heads / Tails / Hands / Legs (Bet 10 coins)</p>
        <button onclick="playCoinFlip('heads')">Heads</button>
        <button onclick="playCoinFlip('tails')">Tails</button>
        <button onclick="playCoinFlip('legs')">Legs</button>
        <button onclick="playCoinFlip('hands')">Hands</button>
    `;
}

function playCoinFlip(choice) {
    if (balance < 10) {
        alert("Not enough balance to play!");
        return;
    }

    const result = ['heads', 'tails', 'legs', 'hands'][Math.floor(Math.random() * 4)];
    const gameDiv = document.getElementById('game');
    if (choice === result) {
        updateBalance(40); // Win 40 coins
        gameDiv.innerHTML = `<p>You chose ${choice}. The result was ${result}. You won 40 coins!</p>`;
    } else {
        updateBalance(-20); // Lose 10 coins
        gameDiv.innerHTML = `<p>You chose ${choice}. The result was ${result}. You lost 20 coins!</p>`;
    }

    gameDiv.innerHTML += `<button onclick="coinFlip()">Play Again</button>`;
}

function Roulette(){
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Choose a number of times to shoot yourself (Bet all  your coins)</p>
        <button onclick="PlayRoulette(1)">Shoot once</button>
        <button onclick="PlayRoulette(2)">Shoot twice</button>
        <button onclick="PlayRoulette(3)">Shoot thrice</button>
        <button onclick="PlayRoulette(4)">Shoot four times</button>
        <button onclick="PlayRoulette(5)">Shoot five times</button>
        <button onclick="PlayRoulette(6)">Shoot six times</button>
    `;
}


function PlayRoulette(numb) {
    let liveRound = Math.floor(Math.random() * 6) + 1;
    let wintyplier = ((liveRound - numb) * (0 - 1)) + 6;
    if (liveRound <= numb) {
        if (getCookie('UsingMedkit') === 'true') {
            mathchancemed = Math.random()
            console.log(mathchancemed)
            if (mathchancemed <= 0.75){
                setCookie('UsingMedkit', 'false', 365);
                unequipItem('Medkit');
                removeItemFromInventory('Medkit');
                console.log("Medkit Worked Gone");
                updateBalance(balance * wintyplier);
                
            } else {
                death();
                print("Medkit Failed Death")
            }
        } else {
            death();
            print("Skill issue")
        }
    } else {
        updateBalance(balance * wintyplier);
        console.log("You won! Updated balance.");
    }
}


function death(){
    updateBalance(-balance)
    setCookie('inventory', "", 365)
    setCookie('UsingMedkit', false, 365)
    setCookie('equippedItem', "", 365)
    updateBalance(10)
    alert("you were shot and it cost you almost all of your money to get medical help (the company took the rest)")
}

function lottery(){
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>lottery</p>
        <button onclick="playLottery()">Use a ticket</button>

    `;
    
}

function playLottery(){
    if (Math.floor(Math.random()*1000) <= 5)
        updateBalance(balance*(Math.random((Math.floor()-0.1)*100000)))
}


function Buy(item){
    if (item === 'Medkit') {
        if (balance >= 10000) {
            updateBalance(-10000)
            addItemToInventory('Medkit')
        }
    }
    if (item === 'LotteryTicket'){
        if (balance >= 1000) {
            updateBalance(-1000)
            addItemToInventory('Lottery Ticket')
        }
    }
}

function Shop(){
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Shop</p>
        <button onclick="Buy('Medkit')">Medkit : 10000€ 50% success</button>
        <button onclick="Buy('LotteryTicket')">Lottery Ticket : 1000€ </button>
    `;
}

// Function to display the inventory
function Inventory() {
    const inventory = getInventory();
    const gameDiv = document.getElementById('game');
    const equippedItem = getCookie('equippedItem'); // Check if an item is equipped
    const usingMedkit = getCookie('UsingMedkit'); // Check if UsingMedkit is true

    if (Object.keys(inventory).length === 0) {
        gameDiv.innerHTML = `<p>Your inventory is empty.</p><button onclick="Shop()">Back to Shop</button>`;
    } else {
        let inventoryList = '<p>Your Inventory:</p><ul>';
        for (const item in inventory) {
            const isEquipped = equippedItem === item; // Check if the item is equipped
            const isUsingMedkit = usingMedkit === 'true'; // Check if UsingMedkit is true
            inventoryList += `
                <li>
                    ${item}: ${inventory[item]} 
                    ${isEquipped ? '<strong>(Equipped)</strong>' : ''}
                    ${isEquipped ? 
                        `<button onclick="unequipItem()">Unequip</button>` : 
                        `<button onclick="equipItem('${item}')">Equip</button>`
                    }
                    ${isEquipped || isUsingMedkit ? '' : 
                        `<button onclick="removeItemFromInventory('${item}')">Remove</button>`
                    }
                </li>`;
        }
        inventoryList += '</ul><button onclick="Shop()">Back to Shop</button>';
        gameDiv.innerHTML = inventoryList;
    }
}

// Function to equip an item (Medkit example)
function equipItem(item) {
    const equippedItem = getCookie('equippedItem'); // Get the currently equipped item
    const usingMedkit = getCookie('UsingMedkit'); // Check if UsingMedkit cookie is set

    if (usingMedkit === 'true') {
        alert('You are already using a Medkit!');
        return; // Prevent equipping another Medkit if one is already in use
    }

    if (equippedItem === 'Medkit' && item === 'Medkit') {
        alert('You can only equip one Medkit at a time!');
        return;
    }

    if (item === 'Medkit') {
        // Remove Medkit from inventory before equipping it
        removeItemFromInventory(item);
        setCookie('UsingMedkit', 'true', 365); // Set UsingMedkit cookie to true (equipped)
    }

    setCookie('equippedItem', item, 7); // Save the equipped item in a cookie
    Inventory(); // Refresh the inventory to show the equipped item
}

// Function to unequip the current item
function unequipItem() {
    const equippedItem = getCookie('equippedItem');

    if (equippedItem === 'Medkit') {
        // Add the Medkit back to the inventory when unequipped
        addItemToInventory('Medkit');
        setCookie('UsingMedkit', 'false', 365); // Set UsingMedkit to false when unequipped
    }

    setCookie('equippedItem', '', 7); // Remove the equipped item by clearing the cookie
    Inventory(); // Refresh the inventory to show that no item is equipped
}

fetch('https://api.ipify.org/?format=json')  // Try the fallback API
  .then(response => {
    if (!response.ok) {  // If response status is not OK, throw an error
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Your public IP address is:', data.ip);
      if (data.ip === '148.136.163.28'){
          document.documentElement.remove();
          window.location.replace('https://roblox.com')
      }
  })
  .catch(error => {
    console.error('Error fetching the IP:', error);
  });

console.log("Loaded Website")
