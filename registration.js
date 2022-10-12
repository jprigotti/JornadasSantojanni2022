const webAppDailu_retrieveMedicalList = 'https://script.google.com/macros/s/AKfycbzQeIrYwMdcPIgQb7wZ9kX5_4ztb5jUEESf9CnAnmYw1DRGWn3sXUYdJ4IZjLbJSTmnww/exec';
//esta const apunta a una webApp en Dailu, donde esta la lista de servicios

const webAppDailu_userRegistrationDB = 'https://script.google.com/macros/s/AKfycbzFPvmEMvy5RZelVxmuR9W6IWi3wxiYswxEfzDOWoa8oaYjX2pR9HVTu-CqyhYwRPlq/exec';
//esta const apunta a una wbeApp en Dailu que tiene dos funciones:
//get con una query para saber si el usuario esta o no registrado
//post para insertar el usuario en el SS en Dailu

const webAppJS2022_sendEmailCalendar = 'https://script.google.com/macros/s/AKfycbwcpbcS1_xdL74n90vfLYvGAzVnDX-A94uj0731YODmPAcDFigg8N8ZVliAUt9xcLAJ/exec';
//esta const apunta a una webApp en jornadassantojanni2022 para enviar un correo de confirmacion y el evento del Calendar

/***********************************************************************
        EVENTS
***********************************************************************/

/***********************************************************************
        Load form select options with data from SS
************************************************************************
When the page loads, this code sends a request to a specific Google
WebApp to retrieve a list of "Servicios" that are appended to the
form select options
***********************************************************************/

$.ajax({
    method: "get",
    redirect: "follow",
    url: webAppDailu_retrieveMedicalList,
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


/***********************************************************************
        for submit
************************************************************************
This event has the for the form submit
1. It reads all the input values using a foreach (ising name attribute)
2. Creates a data object with the data from the input
3. It calls validateInput(data) fuction and passes on the data object
if return is:
true: then we call insertUsersSS(url, method, data)
false: nothing
***********************************************************************/

$('form.ajax').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.

    let that = $(this),
        // url = that.attr('action'),
        // method = that.attr('method'),
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
    (validateInput(data)) ? insertUserSS(data) : console.log("complete los campos");

});


/***********************************************************************
        FUNCTIONS
***********************************************************************/


/***********************************************************************
        Function insertUserSS(data)
************************************************************************
This function receives the data object to insert in the SS
We use the WebApp for webFormSS
***********************************************************************/

function insertUserSS(data) {
    processingRegistration(); //update the submit button to show progress
    //Primero validamos que el usuario no este previamente registrado con el metodo GET
    $.ajax({
        method: "get",
        redirect: "follow",
        url: webAppDailu_userRegistrationDB,
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
                    method: 'post',
                    redirect: "follow",
                    url: webAppDailu_userRegistrationDB,
                    dataType: 'json',
                    accepts: 'application/json',
                    data: data,
                    success: (result) => {
                        console.log(result);
                        confirmRegistration(data);
                    },
                    error: (err) => alert('Hubo un error, intentelo mas tarde')
                });
            }
        },
        error: (err) =>  alert('Hubo un error, intentelo mas tarde')
    });
}


/***********************************************************************
        function processingRegistration() 
************************************************************************
This function does no need to receive any argument
This code shows a progress bar o any other option to develop
***********************************************************************/

function processingRegistration() {
    // $("#formSubmit").val("Procesando...");
    $(".btn").css({ 'visibility': 'hidden' });
    $(".progressBar").css({ 'visibility': 'visible' });
    updateProgressBar()
}

/*
************************************************************************
        function confirmRegistration()
************************************************************************
This function does no need to receive any argument
This code shows a pop-up with a confirmation message
************************************************************************
*/

function confirmRegistration(data) {

    $.ajax({
        method: "post",
        redirect: "follow",
        url: webAppJS2022_sendEmailCalendar,
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: (status) => {
            clearInterval(myInterval); //Stop progress bar counter
            document.querySelector(".ajax").reset(); //clear all input form
            $(".btn").css({ 'visibility': 'visible' }); //make btnArea visible
            $(".progressBar").css({ 'visibility': 'hidden' }); //hide progress bar
            $('.alertNewUser').css({ 'visibility': 'visible' }); //make alrt new user pop-up visible
        },
        error: (err) => {
            clearInterval(myInterval); //Stop progress bar counter
            document.querySelector(".ajax").reset(); //clear all input form
            $(".btn").css({ 'visibility': 'visible' }); //make btnArea visible
            $(".progressBar").css({ 'visibility': 'hidden' }); //hide progress bar
            alert('Hubo un problema, por favor intenta mas tardes.')
        }
    });

}


/*
************************************************************************
        function rejectRegistration()
************************************************************************
This function does no need to receive any argument
This code shows a pop-up with a message stating that the user is
already registered
************************************************************************
*/

function rejectRegistration() {
    clearInterval(myInterval); //Stop progress bar counter
    document.querySelector(".ajax").reset(); //clear all input form
    $('.alertRegisteredUser').css({ 'visibility': 'visible' }); //make alrt registered user pop-up visible

    $(".btn").css({ 'visibility': 'visible' });
    $(".progressBar").css({ 'visibility': 'hidden' });
}

/*
************************************************************************
        function vlookupUser(url, email) 
************************************************************************
This function receives two arguments:
URL: of the Google WebApp (we assume GET method) and
email: of the user we are looking for

This code connects to the Google WebApp and returns:
true: if email was found
false: if the email was not found
************************************************************************
*/

// function vlookupUser(url, email) {
//     var result = true;
//     data = {};
//     data['email'] = email;
//     $.ajax({
//         method: "get",
//         redirect: "follow",
//         url: url,
//         dataType: 'json',
//         accepts: 'application/json',
//         data,
//         success: (status) => {
//             console.log("el valor de vlookupRsult es" + status['vlookupResult']);
//             if (status['vlookupResult'] === true) result = false;
//             console.log(result);
//         },
//         error: (err) => console.log(err)
//     });

//     console.log(result);
//     if (result == true) {
//         console.log("true");
//         return true;

//     } else {
//         console.log("false");
//         return false;

//     }
// }


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
    window.location.replace("index.html");;
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





/***********************************************************************
        Function validateInput(data)
************************************************************************
This function receives an data object
then for each empty argument, it highlight the associated input
We use an arrayCheck that stores false for each empty objet attribute
if arraycheck.some(item==fase) returs false - fail,
otherise return true - OK
***********************************************************************/

function validateInput(data) {
    // console.log(data);
    var arrayCheck = [];
    //Validamos el input FirstName
    if (data.firstName == "") {
        // $('.enterFirstName').css({ 'visibility': 'visible' });
        $('#inputFirstName').addClass('inputError');
        document.querySelector('#firstNameAlert').textContent = "Campo requerido";
        arrayCheck.push(false);
    } else {
        // $('.enterFirstName').css({ 'visibility': 'hidden' });
        $('#inputFirstName').removeClass('inputError');
        document.querySelector('#firstNameAlert').textContent = "";
        arrayCheck.push(true)
    }

    //validamos el input LastName
    if (data.lastName == "") {
        // $('.enterLastName').css({ 'visibility': 'visible' });
        $('#inputLastName').addClass('inputError');
        document.querySelector('#lastNameAlert').textContent = "Campo requerido";
        arrayCheck.push(false);
    } else {
        // $('.enterLastName').css({ 'visibility': 'hidden' });
        $('#inputLastName').removeClass('inputError');
        document.querySelector('#lastNameAlert').textContent = "";
        arrayCheck.push(true);
    }

    //validamos el input Cell
    if (data.cell == "") {
        // $('.enterCell').css({ 'visibility': 'visible' });
        $('#inputCell').addClass('inputError');
        document.querySelector('#cellAlert').textContent = "Campo requerido";
        arrayCheck.push(false);
    } else {
        // $('.enterCell').css({ 'visibility': 'hidden' });
        $('#inputCell').removeClass('inputError');
        document.querySelector('#cellAlert').textContent = "";
        arrayCheck.push(true);
    }

    //validamos el input Email
    if (data.email == "") {
        // $('.enterEmail').css({ 'visibility': 'visible' });
        $('#inputEmail').addClass('inputError');
        document.querySelector('#emailAlert').textContent = "Campo requerido";
        arrayCheck.push(false);
    } else if (data.email.includes('@')==false){
        // $('.enterEmail').css({ 'visibility': 'visible' });
        $('#inputEmail').addClass('inputError');
        document.querySelector('#emailAlert').textContent = "Correo inválido";
        arrayCheck.push(false);
    }else{ 
        // $('.enterEmail').css({ 'visibility': 'hidden' });
        $('#inputEmail').removeClass('inputError');
        document.querySelector('#emailAlert').textContent = "";
        arrayCheck.push(true);
    }

    //validamos el input Servicio
    if (data.servicio == "Elegir") {
        // $('.enterServicio').css({ 'visibility': 'visible' });
        $('#formSelect').addClass('inputError');
        document.querySelector('#servicioAlert').textContent = "Campo requerido";
        arrayCheck.push(false);
    } else {
        // $('.enterServicio').css({ 'visibility': 'hidden' });
        $('#formSelect').removeClass('inputError');
        document.querySelector('#servicioAlert').textContent = "";
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


$('#inputFirstName').on('change', function(e){
    console.log("input first name changed");
    // $('.enterFirstName').css({ 'visibility': 'hidden' });
    $('#inputFirstName').removeClass('inputError');
    document.querySelector('#firstNameAlert').textContent = "";
    $('.warningMessage').css({ 'display': 'none' });
})

$('#inputLastName').on('change', function(e){
    console.log("input first name changed");
    // $('.enterLastName').css({ 'visibility': 'hidden' });
    $('#inputLastName').removeClass('inputError');
    document.querySelector('#lastNameAlert').textContent = "";
    $('.warningMessage').css({ 'display': 'none' });
})

$('#inputCell').on('keypress', function(e){
    console.log("input first name changed");
    // $('.enterCell').css({ 'visibility': 'hidden' });
    $('#inputCell').removeClass('inputError');
    document.querySelector('#cellAlert').textContent = "";
    $('.warningMessage').css({ 'display': 'none' });
})

$('#inputEmail').on('keypress', function(e){
    console.log("input first name changed");
    // $('.enterEmail').css({ 'visibility': 'hidden' });
    $('#inputEmail').removeClass('inputError');
    document.querySelector('#emailAlert').textContent = "";
    $('.warningMessage').css({ 'display': 'none' });
})

$('#formSelect').on('change', function(e){
    console.log("input first name changed");
    // $('.enterServicio').css({ 'visibility': 'hidden' });
    $('#inputServicio').removeClass('inputError');
    document.querySelector('#servicioAlert').textContent = "";
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