<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("Solo acepto peticiones POST");
}

$jsonVehicle = json_decode(file_get_contents("php://input"));
if (!$jsonVehicle) {
    exit("No hay datos");
}

$bd = include_once "bdData.php";

$sentencia = $bd->prepare("INSERT INTO vehicles(plate, house_id, 
type, status, reason) VALUES (?,?,?,?,?)");

$resultado = $sentencia->execute([$jsonVehicle->plate, $jsonVehicle->house_id, $jsonVehicle->type, 
$jsonVehicle->status, $jsonVehicle->reason]);

// Obtener el último ID insertado
$lastId = $bd->lastInsertId();

echo json_encode([
    "lastId" => $lastId,
]);
?>
