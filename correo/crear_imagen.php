<?php

//creamos la imagen definiendo el tamaño del alto y el ancho (150, 40)
$captcha_imagen = imagecreate(150,40);

//creamos el color negro para el fondo y blanco para los caracteres
$color_negro = imagecolorallocate ($captcha_imagen, 0, 0, 0);
$color_blanco = imagecolorallocate ($captcha_imagen, 255, 255, 255);

//pintamos el fondo con el cplor negro creado anteriormente
imagefill($captcha_imagen, 0, 0, $color_negro);

//iniciamos la session para obtener los caracteres a dibujar
session_start();
$captcha_texto = $HTTP_SESSION_VARS["captcha_texto_session"];

//dibujamos los caracteres de color blanco
imagechar($captcha_imagen, 25, 20, 13, $captcha_texto[0] ,$color_blanco);
imagechar($captcha_imagen, 24, 40, 13, $captcha_texto[1] ,$color_blanco);
imagechar($captcha_imagen, 25, 60, 13, $captcha_texto[2] ,$color_blanco);
imagechar($captcha_imagen, 25, 80, 13, $captcha_texto[3] ,$color_blanco);
imagechar($captcha_imagen, 25, 100, 13, $captcha_texto[4] ,$color_blanco);
imagechar($captcha_imagen, 24, 120, 13, $captcha_texto[5] ,$color_blanco);

//indicamos que lo que vamos a mostrar es una imagen
header("Content-type: image/jpeg");

//mostramos la imagen
imagejpeg($captcha_imagen);

?> 