var tasks = [];
var state = 0;

var toggleCheck = function () {
  $('.container').children().last().prev().children('.check-box').children().toggle('fast');
};

var toggleCancel = function () {
  $(this).children('.cancel').toggle();
}

//POST Request
var postTask = function (event) {
  if (event.key === 'Enter') {
    var task = $(this).val();
    console.log('Task: ' + task);
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
        //update list
        fireGET();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
    $(this).val('');
  }
}

//PUT Request
var markComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=155',
      dataType: 'json',
      success: function (response, textStatus) {
        fireGET();
      },
      error: function (req, textStatus, err) {
        console.log(err);
      }
    });
}

var markActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=155',
      dataType: 'json',
      success: function (response, textStatus) {
        fireGET();
      },
      error: function (req, textStatus, err) {
        console.log(err);
      }
    });
}


  //GET Request
var fireGET = function () {
  $.ajax({
    type: 'GET',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=155',
    dataType: 'json',
    success: function (response, textStatus) {
      tasks = response.tasks;
      console.log(tasks[0]);
      //checks if the task array is empty
        $('.task').remove();
        var tasksLeft = 0;
        tasks.forEach(function (task) {
          if (task.completed === false) {
            tasksLeft++;
          }
          //default behavior
          if (state === 0) {
            taskUpdate(task);
            if (task.completed === true) {
              toggleCheck();
            }
          }
          //active button pressed
          else if (state === 1 && task.completed === true) {
            taskUpdate(task);
            toggleCheck();
          }
          //completed button pressed
          else if (state === 2 && task.completed === false) {
            taskUpdate(task);
          }
        });
        $('.left-to-complete').text(String(tasksLeft) + ' items left');
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}


var taskUpdate = function (task) {
  return $('<div class="row task pt-2">' + '<span class="ml-2 mt-2 check-box" data-id="' + task.id + '">' + '<i class="fas fa-check check-mark">' + '</i>' + '</span>' + '<h2 class="col-10">' + task.content + '</h2>' + '<span class="ml-auto mt-2 mr-2 cancel" data-id="' + task.id + '">' + '<p>' + 'x' + '</p>' + '</span>' + '</div>').insertBefore('.end');
}


//DELETE request
var fireDELETE = function (id) {
  id = $(this).data('id');
  $.ajax({
    type: 'DELETE',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=155',
    success: function () {
      fireGET();
    },
    error: function (req, text, err) {
      console.log(err);
    }
  });
}


//Ready call
$(document).ready(function () {

  fireGET();
  $('input').keypress(postTask);
  $(document).on('click', '.cancel', fireDELETE);

  $(document).on('click', '.check-box', function () {
    if ($(this).children().first().css('display') === 'none') {
      markComplete($(this).data('id'));
    }
    else {
      markActive($(this).data('id'));
    }
  });
  $('.btn-all').click(function () {
    state = 0;
    fireGET();
  });
  $('.btn-active').click(function () {
    state = 2;
    fireGET();
  });
  $('.btn-completed').click(function () {
    state = 1;
    fireGET();
  });

  $(document).on('mouseenter mouseleave', '.task', toggleCancel);
});
