
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



$jsonVisitR = json_decode(file_get_contents("php://input"));
if (!$jsonVisitR) {
    exit("No hay datos");
}
$bd = include_once "bdEntrance.php";
$sentencia = $bd->prepare("insert into visits(visitant_id, date_entrance, hour_entrance, obs, sala, type) values (?,?,?,?,?,?)");
$resultado = $sentencia->execute([$jsonVisitR->visitant_id, $jsonVisitR->date_entrance, $jsonVisitR->hour_entrance, $jsonVisitR->obs, $jsonVisitR->sala, $jsonVisitR->type]);
echo json_encode([
    "resultado" => $resultado,
]);
