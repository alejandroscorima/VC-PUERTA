
<?php
//";
$contraseña = "Oscorpsvr";
$usuario = "root";

$nombre_base_de_datos = "vc_db";
try {
    return new PDO('mysql:host=localhost;dbname=' . $nombre_base_de_datos, $usuario, $contraseña);

} catch (Exception $e) {
    echo "Ocurrió algo con la base de datos: " . $e->getMessage();
}
