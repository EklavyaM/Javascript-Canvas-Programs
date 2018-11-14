function f_rectangleCollisionCheck(
    l_x1, l_y1, l_w1, l_h1,
    l_x2, l_y2, l_w2, l_h2 ){
        return  l_x2 + l_w2 > l_x1 &&
                l_y2 + l_h2 > l_y1 &&
                l_x1 + l_w1 > l_x2 &&
                l_y1 + l_h1 > l_y2;
}
