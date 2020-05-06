var tasks = [];
var complete = false;
var content = '';

var toggleCheck = function () {
  $(this).children().toggle('fast');
};

var toggleCancel = function () {
  $(this).children('.cancel').toggle();
}


var postTask = function (event) {
  if (event.key === 'Enter') {
    var task = $(this).val();
    console.log('Task: ' + task);
    //POST Request
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=155',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: task
        }
      }),
      success: function (response, textStatus) {
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
    $(this).val('');
  }
}

//Ready call
$(document).ready(function () {
  //GET Request
  $.ajax({
    type: 'GET',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=155',
    dataType: 'json',
    success: function (response, textStatus) {
      tasks = response.tasks;
      console.log('tasks[]: ' + tasks);
      console.log(tasks[0]);
      //checks if the task array is empty
      if (tasks.length > 0) {

        //loops through JS object
        tasks.forEach(function (task) {
            for (var key in task) {
              if (key === 'content') {
                content = task[key];
              }
              else if (key === 'completed') {
                complete = task[key];
              }
            }
            //inserts html
            $('<div class="row task pt-2">' + '<span class="ml-2 mt-2 check-box">' + '<i class="fas fa-check check-mark">' + '</i>' + '</span>' + '<h2 class="col-10">' + content + '</h2>' + '<span class="ml-auto mt-2 mr-2 cancel">' + '<p>' + 'x' + '</p>' + '</span>' + '</div>').insertBefore('.end');
        });
      }
      else {
        $('.end').toggle();
      }
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
  $('input').keypress(postTask);
  $(document).on('click', '.check-box', toggleCheck);
  $(document).on('mouseenter mouseleave', '.task', toggleCancel);
});
