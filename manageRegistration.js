//Esta rutina ejecuta el webApp "retrieveRegisteredUsers" que se trae la lista de todos los usuarios que complataron el formulario de inscripcion
//Usa DataTables para presentar los resultados
$.ajax({
    method: "get",
    redirect: "follow",
    url: 'https://script.google.com/macros/s/AKfycbxWym_MaRUWIzkQlmyhITmlPlD6mHgoxU0IfX9rNIFkg-fXGZ1q_H16X_B1KUCuZSDnkg/exec',
    dataType: 'json',
    accepts: 'application/json',
    success: (list) => {
        console.log(list);

        var userArray = [];

        for (row = 0; row < list.length; row++) {
            // var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: list[row][5]};
            if (list[row][5] == "") {
                var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: '<a href="#" name=' + list[row][3] + ' class="purchase"><i class="fa-solid fa-cart-shopping"></i></a>' };
            } else {
                var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: '<i class="fa-regular fa-circle-check"></i>' };
            }

            userArray.push(user);
        }

        console.log(JSON.stringify(userArray));
        console.log(userArray);

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




//This way we can build a table from the data we retrieved from AJAX

// $('.dynamicTable').append("<thead> <tr> <th>Nombre</th> <th>Apellido</th> <th>Cell</th> <th>Email</th> <th>Abono</th> </tr> </thead>")

// let i;

// for (row = 0; row < list[0].length - 1; row++) {
//     var bodyRow = [];
//     i = 0;
//     do {
//         bodyRow.push('<td>' + list[row][i] + '</td>');
//         i++;
//     } while (list[row][i] != null);
//     $('.dynamicTable').append('<tr>' + bodyRow + '</tr>');
// }


//Esta funcion tiene un event listener sobre



// var purchase = document.querySelector("#purchase");
// purchase.addEventListener("click",function(e){
//     console.log(e)
// });




setTimeout(function () {
    document.querySelectorAll('.purchase').forEach(function (item) {
        item.addEventListener('click', function () {
            console.log(item.getAttribute('name'));

            var data = {};
            var name = 'email';
            var value = item.getAttribute('name')
            data[name] = value;
            console.log(data);


            //confirmRejectPurchase(data);
            //add the Ajax code to run the Google WebApp

            $.ajax({
                method: "post",
                redirect: "follow",
                url: 'https://script.google.com/macros/s/AKfycbxAE898-jj4hLEOJW2N4QXxMSS4zc0hA6XfHJSzp1u6YKTbjbkAdy7FhVQFE9uKITEN/exec',
                dataType: 'json',
                accepts: 'application/json',
                data,
                success: (list) => {
                    console.log(list);
                    window.location.reload();

                },
                error: (err) => {
                    console.log(err);
                    alert("Hubo un error, intentelo mas tarde");
                }
            });


        });
    });
}, 3000);


function confirmRejectPurchase(data) {
    //https://stackoverflow.com/questions/44213528/how-can-i-implement-a-wait-mechanism-until-receiving-confirm-dialog-response
}