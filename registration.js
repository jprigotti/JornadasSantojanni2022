

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
                alert("Usted ya se encuentra registrado");
                rejectRegistration();
                document.querySelector(".ajax").reset();
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
                        document.querySelector(".ajax").reset();
                        confirmRegistration();
                    },
                    error: (err) => console.log(err)
                    // error: (err) => console.log("error"),
                });
            }
        },
        error: (err) => console.log(err)
        // error: (err) => console.log("error"),
    });

    // userRegistered = vlookupUser(url, data.email);
    // console.log("User registered" + userRegistered);






});


// Local Functions

function processingRegistration() {
    $("#formSubmit").val("Procesando...");
}

function confirmRegistration() {
    $("#formSubmit").val("Enviado");
    $("#formSubmit").addClass("btnSubmit");

    setTimeout(function () {
        $("#formSubmit").val("Enviar");
        $("#formSubmit").removeClass("btnSubmit");
        $("#formSubmit").addClass("btn");
    }, 3000);
}

function rejectRegistration() {
    $("#formSubmit").val("Enviar");
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