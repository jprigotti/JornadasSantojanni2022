

// CODIGO PARA EL SUBMIT DEL FORMULARIO DE INSCRIPCION
$('form.ajax').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.
    processingRegistration(); //update the submit button to show progress

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


    //check if user is registered or not, runnig a query using AJAX-GET passing data object

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
});


// Local Functions

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