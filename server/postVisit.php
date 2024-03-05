
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



$jsonVisit = json_decode(file_get_contents("php://input"));
if (!$jsonVisit) {
    exit("No hay datos");
}

$table_entrance = $jsonVisit->table_entrance;

$bd = include_once "bdEntrance.php";
$sentencia = $bd->prepare("insert into ".$table_entrance." (person_id, age, date_entrance, hour_entrance, obs, visits, status) values (?,?,?,?,?,?,?)");
$resultado = $sentencia->execute([$jsonVisit->person_id, $jsonVisit->age, $jsonVisit->date_entrance, $jsonVisit->hour_entrance, $jsonVisit->obs, $jsonVisit->visits, $jsonVisit->status]);
echo json_encode([
    "resultado" => $resultado,
]);
