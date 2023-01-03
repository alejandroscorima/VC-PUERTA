
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
// header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Methods: PUT");
// header("Access-Control-Allow-Methods: POST");
// header("Access-Control-Allow-Headers: *");

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("Solo acepto peticiones POST");
}



$jsonProduct = json_decode(file_get_contents("php://input"));
if (!$jsonProduct) {
    exit("No hay datos");
}
$bd = include_once "bdTienda.php";
$sentencia = $bd->prepare("insert into products(code, name, description, price, stock, status) values (?,?,?,?,?,'activo')");
$resultado = $sentencia->execute([$jsonProduct->code, $jsonProduct->name, $jsonProduct->description, $jsonProduct->price, $jsonProduct->stock]);
echo json_encode([
    "resultado" => $resultado,
]);
