var modal = document.getElementById('modal-contato');

var btn = document.getElementById("botao-direito");

var span = document.getElementsByClassName("fechar")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}