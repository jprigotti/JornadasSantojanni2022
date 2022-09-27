$(document).ready(initializeDataTable());

//Esta rutina ejecuta el webApp "retrieveRegisteredUsers" que se trae la lista de todos los usuarios que complataron el formulario de inscripcion
//Usa DataTables para presentar los resultados

function initializeDataTable() {
    $.ajax({
        method: "get",
        redirect: "follow",
        url: 'https://script.google.com/macros/s/AKfycbxWym_MaRUWIzkQlmyhITmlPlD6mHgoxU0IfX9rNIFkg-fXGZ1q_H16X_B1KUCuZSDnkg/exec',
        dataType: 'json',
        accepts: 'application/json',
        success: (list) => {
            // console.log(list);
            var userArray = [];  //creamos un array para almacenar los objetos - cada una de las listas de la tabla

            //vamos a definir una variable user del tipo objeto, que va a almacenar cada uno de los campos de la fila.
            //el correspondiente al pago, tiene un button con el evento onclick que llama a la funcion updatePaymentStatus y le pasa un string con el email de la fila

            //ahora navegamos cada una de las filas y armamos el objeto user que luego incorporamos al array userArray
            //si el campo pago es null, agregamos la etiqueta <a> con el <i> del carrito de compras

            for (row = 0; row < list.length; row++) {
                if (list[row][5] == "") {
                    // var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: '<a href="#" name=' + list[row][3] + ' class="purchase"><i class="fa-solid fa-cart-shopping"></i></a>' };
                    var user = {
                        Nombre: list[row][0],
                        Apellido: list[row][1],
                        Celular: list[row][2],
                        Email: list[row][3],
                        Servicio: list[row][4],
                        Pago: '<button onclick="updatePaymentStatus(\'' + list[row][3] + '\')"><i class="fa-solid fa-cart-shopping"></i></button>'
                    };
                } else {
                    var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: '<i class="fa-regular fa-circle-check"></i>' };
                }

                userArray.push(user); //incorporamos el objeto al final de array con el metodo push()
            }

            // console.log(JSON.stringify(userArray)); Esto no se necesita porque la tabla no me esta aceptando en formato Json
            console.log(userArray);

            //ahora usamos el DataTable para mostrar los campos de la tabla

            let table = document.querySelector('#example');


            $('#example').DataTable({
                data: userArray,
                columns: [
                    { data: 'Nombre' },
                    { data: 'Apellido' },
                    { data: 'Celular' },
                    { data: 'Email' },
                    { data: 'Servicio' },
                    { data: 'Pago' }
                ],
            });
        },
        error: (err) => console.log(err)
    });
}


function updatePaymentStatus(email) {
    console.log(email);
    var data = {};
    var name = 'email';
    data[name] = email;  //creamos el objeto data = {email: "user@domain"}
    console.log(data);
    $('#confirmPayment input[name="email"]').val(email);
}


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

    $.ajax({
        method: "post",
        redirect: "follow",
        url: 'https://script.google.com/macros/s/AKfycbxAE898-jj4hLEOJW2N4QXxMSS4zc0hA6XfHJSzp1u6YKTbjbkAdy7FhVQFE9uKITEN/exec',
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: (list) => {
            console.log(list);
            document.querySelector("#confirmPayment").reset(); //clear all input form
            alert("Pago confirmado! Hemos enviado al usuario un correo de confirmación.")
            window.location.reload();
            console.log("calling reinitializeDataTable");
            // reInitializeDataTable();


        },
        error: (err) => {
            console.log(err);
            alert("Hubo un error, intentelo mas tarde");
        }
    });

});