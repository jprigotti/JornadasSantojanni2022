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
            var user = { Nombre: list[row][0], Apellido: list[row][1], Celular: list[row][2], Email: list[row][3], Servicio: list[row][4], Pago: list[row][5]};
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