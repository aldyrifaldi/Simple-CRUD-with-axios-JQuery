
students() // call function student to display data in table
moment.locale('eg') // set moment language to indonesia
async function fetchData(url,request,method) {
    let res = await axios({
        method: method, // method 
        url: url, // url api
        data: request // data request from form
    })
    return res // return result from requested api
}

function students() { 
$('tbody').html('') // set tbody to empty

    let url = "http://127.0.0.1:8002/api/v1/students" // url get all students
    let request // set data request to null
    let method = 'get' // set method get

    fetchData(url,request,method) // call function fetchData 
    .then((res) => {
    $.each(res.data.data,function(index,value){ // loop result data from request api
        // append data to tbody in table
        $('tbody').append(`
            <tr>
                <td scope="row">${index + 1}.</td>
                <td>${value.name}</td>
                <td>${moment(value.birth_date).format('DD MMMM YYYY')}</td>
                <td>${value.address}</td>
                <td class="text-center">
                    <div class="btn-group">
                        <button type="button" onclick="modalForm($(this),${value.id},1)" class="btn btn-sm btn-warning"><i class="fas fa-edit    "></i></button>
                        <button type="button" onclick="modalDetail(${value.id})" class="btn btn-sm btn-info"><i class="fas fa-eye    "></i></button>
                        <button type="button" onclick="deleteRequest(${value.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash-alt    "></i></button>
                    </div>
                </td>
            </tr>
        `)
    })
    $('table').DataTable() // set datatable to table element
})
}

$('form').submit(function(e){
    let status = $('#name').data('status') // call data status 
    let id = $('#name').data('id') // call id student from data id 
    if (status == 1) { // update student if status true
    var urlCondition = "http://127.0.0.1:8002/api/v1/students/"+id // url api put request
    var methodCondition = 'put' // set method put
    }
    else { // create student if status false
    var urlCondition = "http://127.0.0.1:8002/api/v1/students" // url api post request 
    var methodCondition = 'post' // set method post
    }

    e.preventDefault() // disable browser relaod
    let url = urlCondition // url from condition result
    let data = $(this).serialize() // get data from form input
    let method = methodCondition // method from condition result

    fetchData(url,data,method) // call function fetchData
    .then(res => {
        if (status == 1) { // if update student
            $('#modalForm').modal('hide') // hide modal
        }
        $('table').DataTable().destroy() // destroy datatable
        students() // call function student
        $(this)[0].reset() // reset form input value
    })
}) 

function modalForm(element,id,status) { // show modal edit student
    $('.modal-title').text("Update Student") // set text modal title
    $('#button-modal').removeClass('d-none') // show submit button modal after hide in show modal detail  
    $('#name').removeAttr('readonly',true) // remove attribute readonly to form input name
    $('#address').removeAttr('readonly',true) // remove attribute readonly to form input address
    $('#birth_date').removeAttr('readonly',true) // remove attribute readonly to form input birth_date
    let url = "http://127.0.0.1:8002/api/v1/students/"+id // get single student
    let data // set data to null
    let method = 'get' // set method get
    fetchData(url,data,method) // call function fetchData
    .then((res) => { 
        $('#name').val(res.data.data.name) // set value to form input name
        $('#name').data('id',res.data.data.id) // set id to form input name data id
        $('#name').data('status',1) // set data status (1 for update 0 for create)
        $('#address').val(res.data.data.address) // set value to form input address
        $('#birth_date').val(res.data.data.birth_date) // set value to form input birth date
        $('#modalForm').modal('show') // call modal
    })
}

function modalDetail(id) { // show detail student
    let url = "http://127.0.0.1:8002/api/v1/students/"+id // get single student
    let data // set data to null
    let method = 'get' // set method get
    fetchData(url,data,method) // call function fectData
    .then((res) => {
        $('#name').val(res.data.data.name) // set value to form input name
        $('#name').attr('readonly',true) // set attribute readonly to form input name
        $('#address').attr('readonly',true) // set attribute readonly to form input address
        $('#birth_date').attr('readonly',true) // set attribute readonly to form input birth_date
        $('.modal-title').text("Detail Student") // set text modal title
        $('#name').data('status',1) // set data status (1 for update 0 for create)
        $('#address').val(res.data.data.address) // set value to form input address
        $('#birth_date').val(res.data.data.birth_date) // set value to form input birth_date
        $('#modalForm').modal('show') // call modal
        $('#button-modal').addClass('d-none') // hide submit button in modal
    })
}

function deleteRequest(id) { // delete student
let url = "http://127.0.0.1:8002/api/v1/students/"+id // url api delete student
let method = 'delete' // set method delete
let data // set data to null
fetchData(url,data,method) // call function fetchData
.then((res) => {
    $('table').DataTable().destroy() // destroy datatable 
    students() // call function student
})
}