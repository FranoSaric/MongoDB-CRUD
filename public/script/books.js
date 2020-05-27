var authors;
var books;

var booksTableBody = document.getElementById("booksTable").children[1];

var addedBooksAuthors = document.getElementById('addedBooksAuthors');
var editedBooksAuthors = document.getElementById('editedBooksAuthors');

var booksIDOfEditedBooks = document.getElementById("booksIDOfEditedBooks")
var editedBooksName = document.getElementById("editedBooksName")
var editedBooksDate = document.getElementById("editedBooksDate")
var editedBooksPrice = document.getElementById("editedBooksPrice")
var editedBooksPagesNumber = document.getElementById("editedBooksPagesNumber")
var editedBooksAuthor = document.getElementById('editedBooksAuthor');
var authorsForBooksFilter = document.getElementById('authorsForBooksFilter');
var currentAuthorsForBooksFilter = "";

(function () {
   updateBooksData();
   setInterval(updateBooksData(), 3000);
})()

function updateBooksData() {
    getAuthors();
    getBooks();
    updateBooksElements();
}

function updateBooksElements() {

    if (typeof authors !== "undefined" && typeof books !== "undefined") {
        updateAuthorsInAllForms();
        updateAuthorsFilterForBooks();
        updateBooksTable(currentAuthorsForBooksFilter);

        authors = undefined;
        books = undefined;
    }
    else {
        setTimeout(updateBooksElements, 50);
    }
}

function getBooks() {
    axios.get('http://localhost:3000/api/books')
        .then(function (response) {
            books = response.data.data;
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error);
        })
}

function getauthors() {
    axios.get('http://localhost:3000/api/authors')
        .then(function (response) {
            authors = response.data.data;
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}


function addBooks(event, form) {

    event.preventDefault();

    var formData = new FormData(form);

    axios.post('http://localhost:3000/api/books', {
        "naziv": formData.get('addedBooksName'),
        "datum_objave": formData.get('addedBooksDate'),
        "cijena": formData.get('addedBooksPrice'),
        "broj_stranica": formData.get('addedBooksBirthPagesNumber'),
        "autor": formData.get('addedBooksAuthor')
    })
        .then(function (response) {
            console.log(response);
            updateBooksData();
            form.reset();
            throwStatusOk("Knjiga uspješno dodan!");
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}

function editBooks(event, form) {

    event.preventDefault();

    let formData = new FormData(form)

    axios.put('http://localhost:3000/api/books/' + formData.get('booksIDOfEditedBooks'), {
        "naziv": formData.get('addedBooksName'),
        "datum_objave": formData.get('addedBooksDate'),
        "cijena": formData.get('addedBooksPrice'),
        "broj_stranica": formData.get('addedBooksBirthPagesNumber'),
        "autor": formData.get('addedBooksAuthor')
    })
        .then(function (response) {
            console.log(response);
            updateBooksData();
            throwStatusOk("Knjiga uspješno uređen!");
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}

function deleteBooks(BooksID) {
    axios.delete('http://localhost:3000/api/books/' + BooksID)
        .then(function (response) {
            console.log(response);
            updateBooksData();
            throwStatusOk("Knjiga uspješno izbrisan!");
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })

}

function updateCurrentBooksFilter() {

    currentAuthorsForBooksFilter = authorsForBooksFilter.options[authorsForBooksFilter.selectedIndex].text;

    if (currentAuthorsForBooksFilter == "Odaberite autora") {
        currentAuthorsForBooksFilter = ""
    }
}

function updateBooksTable(booksForFilter) {

    getBooks();
    updateCurrentBooksFilter()

    booksTableBody.innerHTML = '';

    for (let current = 0; current < books.length; current++) {

        if ((booksForFilter != "") && (booksForFilter != books[current].autor.ime)) {
            continue;
        }

        let row = booksTableBody.insertRow(0);

        row.id = books[current]._id;

        row.insertCell(0).innerHTML = books[current].naziv;
        row.insertCell(1).innerHTML = formatDate(books[current].datum_objave);
        row.insertCell(2).innerHTML = books[current].cijena;
        row.insertCell(3).innerHTML = formatDate(Books[current].broj_stranica);
        row.insertCell(4).innerHTML = books[current].autor.ime;
        row.insertCell(5).innerHTML =
            `<button type="button" class="btn btn-light" data-toggle="modal" data-target="#editBooksModal" ` +
            `onclick="setupEditBooksForm('` + books[current]._id + `')">Uredi</button> ` +
            `&nbsp; ` +
            `<button type="button" class="btn btn-danger" ` +
            `onclick="deleteBooks('` + books[current]._id + `')">Izbriši</button>`
    }

    books = undefined;
}

function updateAuthorsFilterForBooks() {

    removeSelectOptions(authorsForBooksFilter)

    for (var currentAuthors = 0; currentAuthors < authors.length; currentAuthors++) {

        var authorsId = authors[currentAuthors]._id;
        var authorsName = authors[currentAuthors].ime;

        var opt = document.createElement('option');
        opt.value = authorsId;
        opt.innerHTML = authorsName;
        authorsForBooksFilter.appendChild(opt);
    }
}

function updateAuthorsInAllForms() {

    removeSelectOptions(addedBooksAuthors);
    removeSelectOptions(editedBooksAuthors);

    for (let current = 0; current < authors.length; current++) {

        let AuthorsID = authors[current]._id;
        let AuthorsName = authors[current].ime;

        var opt = document.createElement('option');
        opt.value = AuthorsID;
        opt.innerHTML = AuthorsName;
        addedBooksAuthors.appendChild(opt);

        var opt = document.createElement('option');
        opt.value = AuthorsID;
        opt.innerHTML = AuthorsName;
        editedBooksAuthors.appendChild(opt)
    }
}

function setupEditBooksForm(BooksID) {

    let BooksToEdit = document.getElementById(BooksID)

    let currentBooksName = BooksToEdit.children[0].innerHTML;
    let currentBooksDate = BooksToEdit.children[1].innerHTML;
    let currentBookPrice = BooksToEdit.children[2].innerHTML;
    let currentBooksPagesNumber = BooksToEdit.children[3].innerHTML;
    let currentBooksAuthor = BooksToEdit.children[4].innerHTML;

    BooksIDOfEditedBooks.value = BooksID;
    editedBooksName.value = currentBooksName;
    editedBooksDate.value = currentBooksDate;
    editedBookPrice.value = currentBookPrice;
    editedBooksPagesNumber.value = currentBooksPagesNumber;

    for (let current = 0; current < editedBooksAuthor.length; current++) {

        if (currentBooksAuthor == editedBooksAuthor[current].innerHTML) {
            editedBooksAuthor[current].selected = "selected"
        }
    }
}