
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
// header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Methods: PUT");
// header("Access-Control-Allow-Methods: POST");
// header("Access-Control-Allow-Headers: *");

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');




$jsonVisit = json_decode(file_get_contents("php://input"));
if (!$jsonVisit) {
    exit("No hay datos");
}

$table_entrance = $jsonVisit->table_entrance;

$bd = include_once "bdEntrance.php";
$sentencia = $bd->prepare("delete from ".$table_entrance." where id=?");
$resultado = $sentencia->execute([$jsonVisit->id]);

echo json_encode([
    "resultado" => $resultado,
]);
