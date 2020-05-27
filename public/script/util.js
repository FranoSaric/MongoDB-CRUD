var successAlert = document.getElementById("successAlert")
var failureAlert = document.getElementById("failureAlert")

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function removeSelectOptions(select) {
    var length = select.length;
    for (i = 1; i < length; i++) {
         select.remove(1);
    } 
}

function throwStatusOk(msg) {
    successAlert.style.display = 'block'
    successAlert.innerHTML = msg + `<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>`;
}

function throwStatusFailure(msg) {
    failureAlert.style.display = 'block'
    failureAlert.innerHTML = msg + `<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>`;
}