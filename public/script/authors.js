var authors;

var authorsTableBody = document.getElementById("authorsTable").children[1];

var addedAuthorsName = document.getElementById('addedAuthorsName');
var addedAuthorsLastName = document.getElementById('addedAuthorsLastName');
var addedAuthorsPartNumber = document.getElementById('addedAuthorsPartNumber');

var authorsIDOfEditedAuthors = document.getElementById("authorsIDOfEditedAuthors");
var editedAuthorsName = document.getElementById("editedAuthorsName");
var editedAuthorsLastName = document.getElementById("editedAuthorsLastName");
var editedAuthorsPartNumber = document.getElementById("editedAuthorsPartNumber");


(function () {
    updateAuthorsData();
    setInterval(updateAuthorsData(), 3000);
})()

function updateAuthorsData() {
    getAuthors();
    updateAuthorsElements();
}

function updateAuthorsElements() {
    if (typeof authors !== "undefined") {
        updateAuthorsTable();

        authors = undefined;
    }
    else {
        setTimeout(updateAuthorsElements, 50);
    }
}

function getAuthors() {
    axios.get('http://localhost:3000/api/authors')
        .then(function (response) {
            authors = response.data.data;
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}


function addAuthors(event, form) {

    event.preventDefault();

    const formData = new FormData(form)

    axios.post('http://localhost:3000/api/authors', {
        "ime": formData.get('addedAuthorsName'),
        "prezime": formData.get('addedAuthorsLastName'),
        "broj_dijela": formData.get('addedAuthorsPartNumber')
    })
        .then(function (response) {
            console.log(response);
            updateAuthorsData();
            form.reset();
            throwStatusOk("Autor uspješno dodano!");
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}


function editAuthors(event, form) {

    event.preventDefault();

    let formData = new FormData(form)

    axios.put('http://localhost:3000/api/authors/' + formData.get('authorsIDOfEditedAuthors'), {
        "ime": formData.get('editedAuthorsName'),
        "prezime": formData.get('editedAuthorsLastName'),
        "broj_dijela": formData.get('editedAuthorsPartNumber')
    })
        .then(function (response) {
            console.log(response);
            updateAuthorsData();
            throwStatusOk("Autor uspješno uređeno!");
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}

function deleteAuthors(authorsID) {
    axios.delete('http://localhost:3000/api/authors/' + authorsID)
        .then(function (response) {
            console.log(response);
            updateAuthorsData();
            throwStatusOk("Autor uspješno izbrisano!");
        }).catch(function (error) {
            console.log(error);
            throwStatusFailure(error.response.data.data);
        })
}


function updateAuthorsTable() {

    authorsTableBody.innerHTML = '';

    for (let current = 0; current < authors.length; current++) {

        let row = authorsTableBody.insertRow(0);

        row.id = authors[current]._id;

        row.insertCell(0).innerHTML = authors[current].ime;
        row.insertCell(1).innerHTML = authors[current].prezime;
        row.insertCell(2).innerHTML = authors[current].broj_dijela;
        row.insertCell(3).innerHTML =
            `<button type="button" class="btn btn-light" data-toggle="modal" data-target="#editAuthorsModal"` +
            `onclick="setupEditAuthorsForm('` + authors[current]._id + `')">Uredi</button> ` +
            `&nbsp; ` +
            `<button type="button" class="btn btn-danger" ` +
            `onclick="deleteAuthors('` + authors[current]._id + `')">Izbriši</button>`
    }
}

function setupEditAuthorsForm(authorsID) {

    let authorsToEdit = document.getElementById(authorsID)

    let currentAuthorsName = authorsToEdit.children[0].innerHTML;
    let currentAuthorsLastName = authorsToEdit.children[1].innerHTML;
    let currentAuthorsPartNumber = authorsToEdit.children[2].innerHTML;

    authorsIDOfEditedauthors.value = authorsID;
    editedAuthorsName.value = currentAuthorsName;
    editedAuthorsLastName.value = currentAuthorsLastName;
    editedAuthorsPartNumber.value = currentAuthorsPartNumber;
}