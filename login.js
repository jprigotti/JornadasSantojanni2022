// const webApp_loginTable = 'https://script.google.com/macros/s/AKfycbwpD8oln9Q4jT4t1jh48vmcKjsYTPy1TQdESWRbJn-pSAhJ3zayAbqyiUoDVKefPz_WRg/exec'
const webApp_retrieveMedicalList = 'https://script.google.com/macros/s/AKfycbzQeIrYwMdcPIgQb7wZ9kX5_4ztb5jUEESf9CnAnmYw1DRGWn3sXUYdJ4IZjLbJSTmnww/exec';
const webApp_retrieveRegisteredUsers = 'https://script.google.com/macros/s/AKfycbyPm0Bzim5390Abv2SGkDQLupiMkJCFZdmrP2NbgGdxfFlmOgTeQTQ-KHgK6TAD2iA/exec';
const webApp_purchaseUpdate = 'https://script.google.com/macros/s/AKfycbxaIdu3rkChkNrijcCCYJnRpctxt06uCfb0QnhtHxN3sLcBQntJx6HYPPwphBeTSlY/exec';
const webAppJS2022_sendPayConfEmail = 'https://script.google.com/macros/s/AKfycbzpD4EFh-k8cX1aDuWVynZxZfPsPaXjupzWFnMvdqEJhtR0HNsyExSYNpgjLjGM5Bg/exec';

/***********************************************************************
        EVENTS
***********************************************************************/

/***********************************************************************
        Al hacer click en los inputs del form submit
************************************************************************
When I click on the input submit we need to clear out the 
invalida credentials sign
***********************************************************************/

$('#username').on('keypress', function (e) {
    $('.invalidCredentials').css({ 'display': 'none' });
})
$('#password').on('keypress', function (e) {
    $('.invalidCredentials').css({ 'display': 'none' });
})


/***********************************************************************
        Al hacer submit en el form Login
************************************************************************
When click on submit, we retrieve username and password from input
and compare with harcodede credentials
***********************************************************************/
$('#login').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.

    let that = $(this),
        credentials = {}; //this is gonna be a JS object to store username and password

    //loop through all the "name" items in the Form to load the data object
    that.find('[name]').each(function (index, value) {
        var that = $(this),
            name = that.attr('name'),
            value = that.val();
        credentials[name] = value;
    });

    console.log(credentials);

    if (credentials.username == 'admin' && credentials.password == 'admin') {

        //call funtion that hides login form and shows table
        loginSuccess();

    } else {
        loginFail();
    }

});


/***********************************************************************
        Al hacer click en el boton Confirmar del payment
************************************************************************

***********************************************************************/

$('#confirmPayment').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.

    //ADD JS to valdate input data PENDING - then read the form inputs
    let that = $(this),
        data = {}; //this is gonna be a JS object to store all input values

    //loop through all the "name" items in the Form to load the data object

    that.find('[name]').each(function (index, value) {
        var that = $(this),
            name = that.attr('name'),
            value = that.val();
        data[name] = value;
        console.log(data);
    });

    processingPurchase();

    $.ajax({
        method: "post",
        redirect: "follow",
        url: webApp_purchaseUpdate,
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: (list) => {
            confirmPurchase(data);
            // console.log(list);
            // document.querySelector("#confirmPayment").reset(); //clear all input form
            // $('.confirmPaymentBackground').css({ 'display': 'none' });
            // alert("Pago confirmado! Hemos enviado al usuario un correo de confirmación.")
            // reInitializeDataTable();
        },
        error: (err) => {
            console.log(err);
            alert("Hubo un error, intentelo mas tarde");
        }
    });

});


/***********************************************************************
        Al hacer click en el boton Cancelar del payment
************************************************************************

***********************************************************************/
$('.btnReset').click(function () {
    $('.confirmPaymentBackground').css({ 'display': 'none' });
});



/***********************************************************************
        Al hacer click en el icono del password
************************************************************************

***********************************************************************/

$('#showPassword').click(function () {
    $(this).toggleClass("fa-eye");
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
});


/***********************************************************************
        FUNCTIONS
***********************************************************************/


/***********************************************************************
        Function loginSuccess()
************************************************************************
This function has to
clear login input form
hide the login form
show the table
load the table with data from SS
***********************************************************************/
function loginSuccess() {
    //clear the input form
    document.querySelector("#login").reset(); //clear all input form
    //hide the login form
    $('.loginBackground').css({ 'display': 'none' });
    //show the registered users table
    $('.tableBackground').css({ 'display': 'inline' })
    //initialize table
    initializeDataTable()

}


/***********************************************************************
        Function loginFail()
************************************************************************
This function has to:
1. show invalid login, please try again
***********************************************************************/
function loginFail() {
    $('.invalidCredentials').css({ 'display': 'inline' });
    document.querySelector("#login").reset(); //clear all input form

}


/***********************************************************************
        Function initializeDataTable()
************************************************************************
This function has to:
1. initialize the DataTable
***********************************************************************/

function initializeDataTable() {
    $.ajax({
        method: "get",
        redirect: "follow",
        url: webApp_retrieveRegisteredUsers,
        dataType: 'json',
        accepts: 'application/json',
        success: (list) => {
            var userArray = [];  //creamos un array para almacenar los objetos - cada una de las listas de la tabla

            //vamos a definir una variable user del tipo objeto, que va a almacenar cada uno de los campos de la fila.
            //el correspondiente al pago, tiene un button con el evento onclick que llama a la funcion updatePaymentStatus y le pasa un string con el email de la fila

            //ahora navegamos cada una de las filas y armamos el objeto user que luego incorporamos al array userArray
            //si el campo pago es null, agregamos la etiqueta <a> con el <i> del carrito de compras

            for (row = 0; row < list.length; row++) {
                if (list[row][6] == "NO") {
                    // var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: '<a href="#" name=' + list[row][3] + ' class="purchase"><i class="fa-solid fa-cart-shopping"></i></a>' };
                    var regDate = list[row][0];
                    var payDate = list[row][7];
                    var user = {
                        Fecha_Reg: regDate.substr(0, 10),
                        Nombre: list[row][1],
                        Apellido: list[row][2],
                        Celular: list[row][3],
                        Email: list[row][4],
                        Servicio: list[row][5],
                        Abono: list[row][6],
                        Fecha_Pago: payDate.substr(0, 10),
                        Estado: '<button class="btnCart" onclick="updatePaymentStatus(\'' + list[row][4] + '\')"><i class="fa-solid fa-cart-shopping"></i></button>'
                    };
                } else {
                    var regDate = list[row][0];
                    var payDate = list[row][7];
                    var user = {
                        Fecha_Reg: regDate.substr(0, 10),
                        Nombre: list[row][1],
                        Apellido: list[row][2],
                        Celular: list[row][3],
                        Email: list[row][4],
                        Servicio: list[row][5],
                        Abono: list[row][6],
                        Fecha_Pago: payDate.substr(0, 10),
                        Estado: '<i class="fa-regular fa-circle-check"></i>'
                    };
                }

                userArray.push(user); //incorporamos el objeto al final de array con el metodo push()
            }

            // console.log(JSON.stringify(userArray)); Esto no se necesita porque la tabla no me esta aceptando en formato Json
            console.log(userArray);

            //ahora usamos el DataTable para mostrar los campos de la tabla
            var table = document.getElementById("example");
            var header = table.createTHead();
            var row = header.insertRow(0);
            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Fecha_reg</b>";
            var cell = row.insertCell(1);
            cell.innerHTML = "<b>Nombre</b>";
            var cell = row.insertCell(2);
            cell.innerHTML = "<b>Apellido</b>";
            var cell = row.insertCell(3);
            cell.innerHTML = "<b>Celular</b>";
            var cell = row.insertCell(4);
            cell.innerHTML = "<b>Email</b>";
            var cell = row.insertCell(5);
            cell.innerHTML = "<b>Servicio</b>";
            var cell = row.insertCell(6);
            cell.innerHTML = "<b>Abono</b>";
            var cell = row.insertCell(7);
            cell.innerHTML = "<b>Fecha_pago</b>";
            var cell = row.insertCell(8);
            cell.innerHTML = "<b>Estado</b>";


            $('#example').DataTable({
                data: userArray,
                columns: [
                    { data: 'Fecha_Reg' },
                    { data: 'Nombre' },
                    { data: 'Apellido' },
                    { data: 'Celular' },
                    { data: 'Email' },
                    { data: 'Servicio' },
                    { data: 'Abono' },
                    { data: 'Fecha_Pago' },
                    { data: 'Estado' }
                ],
            });
        },
        error: (err) => console.log(err)
    });
}


/***********************************************************************
        Function reInitializeDataTable()
************************************************************************
This function has to:
1. initialize the DataTable
***********************************************************************/
function reInitializeDataTable() {
    const table = $("#example").DataTable();

    // clear first
    if (table != null) {
        table.clear().draw();
        table.destroy().draw();
    }

    //2nd empty html
    $('#example' + " tbody").empty();
    $('#example' + " thead").empty();

    //3rd reCreate Datatable object
    initializeDataTable();
}


/***********************************************************************
        Function updatePaymentStatus(email)
************************************************************************
This function has to:
1. load the email in the confirmPayment input
***********************************************************************/
function updatePaymentStatus(email) {
    console.log(email);
    var data = {};
    var name = 'email';
    data[name] = email;  //creamos el objeto data = {email: "user@domain"}
    console.log(data);
    $('.confirmPaymentBackground').css({ 'display': 'inline' });
    $('#confirmPayment input[name="email"]').val(email);

}



/***********************************************************************
        Function processingPurchase()
************************************************************************
This function has to:

***********************************************************************/
function processingPurchase() {
    $(".btnArea").css({ 'display': 'none' });
    $(".progressBar").css({ 'display': 'inline' });
    updateProgressBar();
}



/***********************************************************************
        Function processingPurchase()
************************************************************************
This function has to:

***********************************************************************/
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

/***********************************************************************
        Function confirmPurchase()
************************************************************************
This function has to:

***********************************************************************/

function confirmPurchase(data) {
    clearInterval(myInterval); //Stop progress bar counter
    reInitializeDataTable();

    $.ajax({
        method: "post",
        redirect: "follow",
        url: webAppJS2022_sendPayConfEmail,
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: () => {

            $(".progressBar").css({ 'display': 'none' }); //hide progress bar
            $(".paymentSuccessfullMessage").css({ 'display': 'inline' });
        
            setTimeout(function () {
                document.querySelector("#confirmPayment").reset(); //clear all input form //clear all input form
                $(".paymentSuccessfullMessage").css({ 'display': 'none' });
                $(".btnArea").css({ 'display': 'flex' });
                $('.confirmPaymentBackground').css({ 'display': 'none' });
        
            }, 3000);

        },
        error: (err) => {
            $(".progressBar").css({ 'display': 'none' }); //hide progress bar
            $(".paymentSuccessfullNoMailMessage").css({ 'display': 'inline' });
        
            setTimeout(function () {
                document.querySelector("#confirmPayment").reset(); //clear all input form //clear all input form
                $(".paymentSuccessfullNoMailMessage").css({ 'display': 'none' });
                $(".btnArea").css({ 'display': 'flex' });
                $('.confirmPaymentBackground').css({ 'display': 'none' });
        
            }, 3000);
        }
    });




}





