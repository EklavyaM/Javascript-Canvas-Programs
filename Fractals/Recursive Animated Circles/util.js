function f_drawBoundaryAndClearRect(l_context, l_width, l_height, l_bg_color) {
    l_context.fillStyle = l_bg_color;
    l_context.fillRect(0, 0, l_width, l_height);
}

function f_drawText(l_context, l_pos_x, l_pos_y, l_text, l_font_size = 48, l_font_style, l_font_color = "white") {
    l_context.font = l_font_size.toString() + "px " + l_font_style;
    l_context.textAlign = "center";
    l_context.textBaseline = "middle";
    l_context.fillStyle = l_font_color;
    l_context.fillText(l_text, l_pos_x, l_pos_y);
}

function f_drawCircle(l_context, l_pos_x, l_pos_y, l_radius, l_stroke_color){
    l_context.strokeStyle = l_stroke_color;
    l_context.beginPath();
    l_context.arc(l_pos_x, l_pos_y, l_radius, 0, 6.284);
    l_context.closePath();
    l_context.stroke();
}

function f_getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
}
