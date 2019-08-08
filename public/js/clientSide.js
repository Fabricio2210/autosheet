$('.msg')
  .delay(2000)
  .slideUp({ duration: 500, queue: true });

//carousel tela grande
$(document).ready(function() {
  $('.multiple-items').slick({
    infinite: true,
    slidesToShow: 3,
    rows: 4,
    dots: true
  });
});

//carousel celular
$(document).ready(function() {
  $('.single-item').slick({
    slidesToShow: 1,
    rows: 4,
    dots: true
  });
});

//navbar
$(document).ready(function() {
  $('.sidenav').sidenav();
});

//botão "float"
document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.fixed-action-btn');
  let instances = M.FloatingActionButton.init(elems, { hoverEnabled: false });
});

$(document).ready(function() {
  $('.materialboxed').materialbox();
});

//modal foto
$(document).ready(function() {
  $('.modal').modal();
});

//tooltip
$(document).ready(function() {
  $('.tooltipped').tooltip();
});

//textarea
CKEDITOR.replace('body', {
  plugins: 'wysiwygarea,toolbar,basicstyles,link'
});

//select form
$(document).ready(function() {
  $('select').formSelect();
});

function selectElementContents(el) {
  var body = document.body, range, sel;
  if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      sel.removeAllRanges();
      try {
          range.selectNodeContents(el);
          sel.addRange(range);
      } catch (e) {
          range.selectNode(el);
          sel.addRange(range);
      }
      document.execCommand("copy");

  } else if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(el);
      range.select();
      range.execCommand("Copy");
  }
};

//Data
//$('#ferias').change(function(){
  //$('#data').removeAttr('hidden');
//});

function myFunction() {
  var checkBox = document.getElementById("ferias");
  var text = document.getElementById("text");
  if (checkBox.checked == true){
    text.style.display = "block";
  } else {
     text.style.display = "none";
  }
}