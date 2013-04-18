// talk about jQuery minimized...

function $(id) {
  return document.getElementById(id);
}

// extract canvas-relative coordinates from click event

function getClickLocation(canvas, clickEvent) {
  var x = 0, y = 0;

  if (clickEvent.pageX || clickEvent.pageY) {
    x = clickEvent.pageX;
    y = clickEvent.pageY;
  }
  else {
    x = clickEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = clickEvent.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
  }

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  return [x, y];
}
