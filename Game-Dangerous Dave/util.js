var g_collision_offset = 8;
var g_collision_w, g_collision_h, g_collision_dx, g_collision_dy, g_collision_wy, g_collision_hx;

function f_drawBoundaryAndClearRect(l_context, l_width, l_height, l_bg_color){
    l_context.fillStyle = l_bg_color;
    l_context.fillRect(0, 0, l_width, l_height);
}

function f_drawText(l_context, l_pos_x, l_pos_y, l_text, l_font_size = 48, l_font_style, l_font_color = "white"){
    l_context.font = l_font_size.toString()+"px " + l_font_style;
    l_context.textAlign = "center";
    l_context.textBaseline = "middle";
    l_context.fillStyle = l_font_color;
    l_context.fillText(l_text, l_pos_x, l_pos_y);
}

function f_rectangleCollisionCheck(
    l_x1, l_y1, l_w1, l_h1,
    l_x2, l_y2, l_w2, l_h2 ){

        g_collision_w = 0.5 * (l_w1 + l_w2);
        g_collision_h = 0.5 * (l_h1 + l_h2);
        g_collision_dx = l_x1 + l_w1/2 - (l_x2 + l_w2/2);
        g_collision_dy = l_y1 + l_h1/2 - (l_y2 + l_h2/2);

        if(Math.abs(g_collision_dx) <= g_collision_w && Math.abs(g_collision_dy) <= g_collision_h){
            g_collision_wy = g_collision_w * g_collision_dy;
            g_collision_hx = g_collision_h * g_collision_dx;

            if(Math.abs(g_collision_wy) == Math.abs(g_collision_hx)) return 0;

            if (g_collision_wy > g_collision_hx){
                if (g_collision_wy > -g_collision_hx) return "bottom";
                else return "left";
            }
            else if(g_collision_wy < g_collision_hx){
                if (g_collision_wy > -g_collision_hx) return "right";
                else return "top";
            }
        }
        return 0;
}

function f_setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
