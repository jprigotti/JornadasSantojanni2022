// CODIGO PARA GENERAR LOS OPTIONS DEL SELECT SERVICIOS
$.ajax({
    method: "get",
    redirect: "follow",
    url: 'https://script.google.com/macros/s/AKfycbzQeIrYwMdcPIgQb7wZ9kX5_4ztb5jUEESf9CnAnmYw1DRGWn3sXUYdJ4IZjLbJSTmnww/exec',
    dataType: 'json',
    accepts: 'application/json',
    success: (list) => {
        let i = 0;
        let formSelect = document.getElementById("formSelect");
        let option;

        do {
            // console.log(list[i][0]);
            option = document.createElement('option');
            // option.classList.add('optionClass');
            option.value = list[i][0];
            option.innerHTML = list[i][0];
            formSelect.appendChild(option);
            i++;
        } while (list[i] != null);
    },
    error: (err) => console.log(err)
});


// CODIGO PARA EL SUBMIT DEL FORMULARIO DE INSCRIPCION
$('form.ajax').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.

    //ADD JS to valdate input data PENDING - then read the form inputs
    let that = $(this),
        url = that.attr('action'),
        method = that.attr('method'),
        data = {}; //this is gonna be a JS object to store all input values

    //loop through all the "name" items in the Form to load the data object

    that.find('[name]').each(function (index, value) {
        var that = $(this),
            name = that.attr('name'),
            value = that.val();
        data[name] = value;
    });

    console.log(data);
    //check if user is registered or not, runnig a query using AJAX-GET passing data object

    (validateInput(data)) ? insertUserSS(url, method, data) : console.log("complete los campos");
    

});



// Local Functions

// Esta funcion recibe un objecto data con todos los campos del usuario 
// que envia a Google WebApp para insertarlo en el SS
function insertUserSS(url, method, data) {
    processingRegistration(); //update the submit button to show progress
    //Primero validamos que el usuario no este previamente registrado
    $.ajax({
        method: "get",
        redirect: "follow",
        url: url,
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: (status) => {
            console.log("Usuario registrado? " + status['vlookupResult']);
            if (status['vlookupResult'] === true) {
                //User already registered
                rejectRegistration();
            } else {
                // User Not registered   
                // Proceed to submit using AJAX-POST
                $.ajax({
                    method: method,
                    redirect: "follow",
                    url: url,
                    dataType: 'json',
                    accepts: 'application/json',
                    data: data,
                    success: (result) => {
                        console.log(result);
                        confirmRegistration();
                    },
                    error: (err) => console.log(err)
                });
            }
        },
        error: (err) => console.log(err)
    });
}

function processingRegistration() {
    // $("#formSubmit").val("Procesando...");
    $(".btn").css({ 'visibility': 'hidden' });
    $(".progressBar").css({ 'visibility': 'visible' });
    updateProgressBar()
}

function confirmRegistration() {
    clearInterval(myInterval); //Stop progress bar counter
    document.querySelector(".ajax").reset(); //clear all input form
    $(".btn").css({ 'visibility': 'visible' }); //make btnArea visible
    $(".progressBar").css({ 'visibility': 'hidden' }); //hide progress bar
    $('.alertNewUser').css({ 'visibility': 'visible' }); //make alrt new user pop-up visible
    // $(".progressBar").toggleClass("successBar");
    // setTimeout(function () {
    //     $(".progressBar").toggleClass("successBar");
    //     $(".btn").css({ 'visibility': 'visible' });
    //     $(".progressBar").css({ 'visibility': 'hidden' });
    // }, 3000);

    // $("#formSubmit").val("Enviado");
    // $("#formSubmit").addClass("btnSubmit");

    // setTimeout(function () {
    //     $("#formSubmit").val("Enviar");
    //     $("#formSubmit").removeClass("btnSubmit");
    //     $("#formSubmit").addClass("btn");
    // }, 2000);
}

function rejectRegistration() {
    clearInterval(myInterval); //Stop progress bar counter
    document.querySelector(".ajax").reset(); //clear all input form
    $('.alertRegisteredUser').css({ 'visibility': 'visible' }); //make alrt registered user pop-up visible

    $(".btn").css({ 'visibility': 'visible' });
    $(".progressBar").css({ 'visibility': 'hidden' });
}

//vlookupUse function receives two arguments
// 1. is the URL of the Google WebApp
// 2. is the string email we want to look for in the SS
//Note: it uses the Get method, while the insert coding uses the Post method
//if the Google Script does find the email in the table, returns vloookupResult : "true"

function vlookupUser(url, email) {
    var result = true;
    data = {};
    data['email'] = email;
    $.ajax({
        method: "get",
        redirect: "follow",
        url: url,
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: (status) => {
            console.log("el valor de vlookupRsult es" + status['vlookupResult']);
            if (status['vlookupResult'] === true) result = false;
            console.log(result);
        },
        error: (err) => console.log(err)
        // error: (err) => console.log("error"),
    });

    console.log(result);
    if (result == true) {
        console.log("true");
        return true;

    } else {
        console.log("false");
        return false;

    }
}


//This functions will show/hide the password
const showPassword = document.querySelector("#showPassword");
const passwordField = document.querySelector("#passwordField");
$('#showPassword').on('mousedown', function () {
    $(this).toggleClass("fa-eye");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
});

// $('#showPassword').on('mouseleave', function(){
//     $(this).toggleClass("fa-eye");
//     const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
//     passwordField.setAttribute("type", type);
// });


//This function will update the progress bar
function updateProgressBar() {
    const progressBar = document.getElementsByClassName('progressBar')[0]
    const loop = 3;
    progressBar.style.setProperty('--width', 0)
    myInterval = setInterval(() => {
        const computedStyle = getComputedStyle(progressBar)
        let width = parseFloat(computedStyle.getPropertyValue('--width')) || 0
        progressBar.style.setProperty('--width', width + 1)
        if (width == 95) {
            progressBar.style.setProperty('--width', 0)
            // clearInterval(myInterval);
        }
        console.log(width);
    }, 30)
}


//Este codigo es para cerrar el alertContainer NewUser
$('#alertContainerCloseNU').on('mousedown', function () {
    $('.alertNewUser').css({ 'visibility': 'hidden' });
});

//Este codigo es para cerrar el alertContainer RegisteredUser
$('#alertContainerCloseRU').on('mousedown', function () {
    $('.alertRegisteredUser').css({ 'visibility': 'hidden' });
});


//This code will insert option in Form Select
// let formSelect = document.getElementById("formSelect");

// let option = document.createElement('option');
// option.value="Clinica Medica";
// option.innerHTML="Clinica Medica";
// formSelect.appendChild(option);
// option = document.createElement('option');
// option.value="Cardiología";
// option.innerHTML="Cardiología";
// formSelect.appendChild(option);






function validateInput(data) {
    console.log(data);
    var arrayCheck = [];
    //Validamos el input FirstName
    if (data.firstName == "") {
        $('.enterFirstName').css({ 'visibility': 'visible' });
        $('#inputFirstName').addClass('inputError');
        arrayCheck.push(false);
    } else {
        $('.enterFirstName').css({ 'visibility': 'hidden' });
        $('#inputFirstName').removeClass('inputError');
        arrayCheck.push(true)
    }

    //validamos el input LastName
    if (data.lastName == "") {
        $('.enterLastName').css({ 'visibility': 'visible' });
        $('#inputLastName').addClass('inputError');
        arrayCheck.push(false);
    } else {
        $('.enterLastName').css({ 'visibility': 'hidden' });
        $('#inputLastName').removeClass('inputError');
        arrayCheck.push(true);
    }

    //validamos el input Cell
    if (data.cell == "") {
        $('.enterCell').css({ 'visibility': 'visible' });
        $('#inputCell').addClass('inputError');
        arrayCheck.push(false);
    } else {
        $('.enterCell').css({ 'visibility': 'hidden' });
        $('#inputCell').removeClass('inputError');
        arrayCheck.push(true);
    }

    //validamos el input Email
    if (data.email == "") {
        $('.enterEmail').css({ 'visibility': 'visible' });
        $('#inputEmail').addClass('inputError');
        arrayCheck.push(false);
    } else {
        $('.enterEmail').css({ 'visibility': 'hidden' });
        $('#inputEmail').removeClass('inputError');
        arrayCheck.push(true);
    }

    //validamos el input Servicio
    if (data.servicio == "Elegir") {
        $('.enterServicio').css({ 'visibility': 'visible' });
        $('#formSelect').addClass('inputError');
        arrayCheck.push(false);
    } else {
        $('.enterServicio').css({ 'visibility': 'hidden' });
        $('#formSelect').removeClass('inputError');
        arrayCheck.push(true);
    }

    console.log(arrayCheck);
    if (arrayCheck.some((item) => item == false)) {
        $('.warningMessage').css({ 'display': 'inline' });
        return false;
    } else {
        $('.warningMessage').css({ 'display': 'none' });
        return true;
    }
}


$('#inputFirstName').on('keypress', function(e){
    console.log("input first name changed");
    $('.enterFirstName').css({ 'visibility': 'hidden' });
    $('#inputFirstName').removeClass('inputError');
    $('.warningMessage').css({ 'display': 'none' });
})

$('#inputLastName').on('keypress', function(e){
    console.log("input first name changed");
    $('.enterLastName').css({ 'visibility': 'hidden' });
    $('#inputLastName').removeClass('inputError');
    $('.warningMessage').css({ 'display': 'none' });
})

$('#inputCell').on('keypress', function(e){
    console.log("input first name changed");
    $('.enterCell').css({ 'visibility': 'hidden' });
    $('#inputCell').removeClass('inputError');
    $('.warningMessage').css({ 'display': 'none' });
})

$('#inputEmail').on('keypress', function(e){
    console.log("input first name changed");
    $('.enterEmail').css({ 'visibility': 'hidden' });
    $('#inputEmail').removeClass('inputError');
    $('.warningMessage').css({ 'display': 'none' });
})

$('#formSelect').on('change', function(e){
    console.log("input first name changed");
    $('.enterServicio').css({ 'visibility': 'hidden' });
    $('#inputServicio').removeClass('inputError');
    $('.warningMessage').css({ 'display': 'none' });
})





// let optionClass = document.querySelector('#formSelect');
// optionClass.addEventListener('mouseover', funcion1);

// function funcion1(){
// var option = document.querySelector(".optionClass")
// option.setAttribute("style","background-color:blue")
// console.log("OK")
// }

// $('optionClass').hover(function() {
//         $(this).addClass('highlight');
//     }, function() {
//         $(this).removeClass('highlight');
//     }
// );

// $('select[name="servicios"] option ').hover(
//     function() {
//         $(this).addClass('highlight');
//     }, function() {
//         $(this).removeClass('highlight');
//     }
// );