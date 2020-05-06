$(document).ready(function () {
  $('.check-box').click(toggleCheck);
  $('.task').hover(toggleCancel);
});

var toggleCheck = function () {
  $(this).children().toggle('fast');
};

var toggleCancel = function () {
  $(this).children('.cancel').toggle();
}
