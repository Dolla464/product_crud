let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let submitMode = 'create';
let tmp;
//get total
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

//create product
let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product)
} else {
    dataPro = [];
}

submit.onclick = function () {
    // First, validate the price inputs before proceeding
    if (!validatePriceInputs()) {
        return;  // If the validation fails, stop further execution
    }
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    }

    //count
    if (submitMode === 'create') {
        if (title.value != '' && price.value != '' && category.value != '' && isValidCount(count.value) && count.value <= 100) {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            alert('Please enter valid product details including a positive count and valid price values.');
        }
    } else {
        dataPro[tmp] = newPro;
        submitMode = 'create';
        submit.innerHTML = 'Create';
        count.style.display = 'block';
    }
    clearData()

    // Function to validate count as a positive integer
    function isValidCount(count) {
        return Number.isInteger(Number(count)) && Number(count) > 0;
    }

    //save localstorage
    localStorage.setItem('product', JSON.stringify(dataPro))

    showData()
}

//clearinputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

//read
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button id="update" onclick = "updateData(${i})">Update</button></td>
                <td><button id="delete" onclick = "deleteData(${i})">Delete</button></td>
            </tr>
        `;
    }
    document.getElementById('tbody').innerHTML = table;
    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `
        <button onclick = "deleteAll()">Delete All  (${dataPro.length})</button>
        `;
    } else {
        btnDelete.innerHTML = '';
    }
}

//delete product
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    showData()

}

//delete all products
function deleteAll() {
    localStorage.clear();
    dataPro.splice(0);
    showData();
}

//update
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    submitMode = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: "smooth",
    })
}
//search
let searchMode = 'title';

function getSearchMode(id) {
    let search = document.getElementById('search');

    if (id == 'searchTitle') {
        searchMode = 'title';
    } else {
        searchMode = 'category';
    }
    search.placeholder = 'Search By ' + searchMode;
    search.focus();
    search.value = '';
    showData();
}

function searchData(value) {
    let table = '';
    value = value.trim().toLowerCase();
    // Flag to check if any match is found
    let foundMatch = false;
    // Iterate over the products in dataPro
    for (let i = 0; i < dataPro.length; i++) {
        // Check based on search mode (title or category)
        if (searchMode === 'title' && dataPro[i].title.includes(value)) {
            foundMatch = true;
            table += `
                <tr>
                    <td>${i + 1}</td>  <!-- Display 1-based index -->
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button id="update" onclick="updateData(${i})">Update</button></td>
                    <td><button id="delete" onclick="deleteData(${i})">Delete</button></td>
                </tr>
            `;
        } else if (searchMode === 'category' && dataPro[i].category.includes(value)) {
            foundMatch = true;
            table += `
                <tr>
                    <td>${i + 1}</td>  <!-- Display 1-based index -->
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button id="update" onclick="updateData(${i})">Update</button></td>
                    <td><button id="delete" onclick="deleteData(${i})">Delete</button></td>
                </tr>
            `;
        }
    }

    // If no matches found, display a message
    if (!foundMatch) {
        table = `<tr><td colspan="10" style="text-align:center;">No products found matching your search.</td></tr>`;
    }

    // Update the table body with the results
    document.getElementById('tbody').innerHTML = table;
}

// Error handling for price and numeric inputs
function validatePriceInputs() {
    let priceValue = Number(price.value);
    let taxesValue = Number(taxes.value);
    let adsValue = Number(ads.value);
    let discountValue = Number(discount.value);

    if (isNaN(priceValue) || priceValue < 0) {
        alert('Price must be a positive number');
        return false;
    }
    if (isNaN(taxesValue) || taxesValue < 0) {
        alert('Taxes must be a positive number');
        return false;
    }
    if (isNaN(adsValue) || adsValue < 0) {
        alert('Ads must be a positive number');
        return false;
    }
    if (isNaN(discountValue) || discountValue < 0) {
        alert('Discount must be a positive number');
        return false;
    }
    return true;
}

showData()


