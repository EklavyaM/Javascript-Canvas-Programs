function f_getDistance(l_x1, l_y1, l_x2, l_y2){
    return Math.sqrt((l_y2 - l_y1) * (l_y2 - l_y1) + (l_x2 - l_x1) * (l_x2 - l_x1));
}

function f_circleToCircleCollision(l_x1, l_y1, l_r1, l_x2, l_y2, l_r2){
    return f_getDistance(l_x1, l_y1, l_x2, l_y2) < l_r1 + l_r2;
}

function f_getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
}

function f_colorStringToObj(l_color_obj, l_hex_string){
    // converts a hex string with # behind it
    // for eg. #FFFFFF will be converted to (255, 255, 255);
    l_color_obj.r = parseInt("0x"+l_hex_string.substring(1, 3));
    l_color_obj.g = parseInt("0x"+l_hex_string.substring(3, 5));
    l_color_obj.b = parseInt("0x"+l_hex_string.substring(5, 7));
}

function f_valueToColorString(l_r, l_g, l_b){
    return "#" + l_r.toString(16) + l_g.toString(16) + l_b.toString(16);
}
