
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
$bd = include_once "bdEntrance.php";
$sentencia = $bd->prepare("insert into visits_pro(doc_number, name, age, gender, address, date_entrance, hour_entrance, obs, visits) values (?,?,?,?,?,?,?,?,?)");
$resultado = $sentencia->execute([$jsonVisit->doc_number, $jsonVisit->name, $jsonVisit->age, $jsonVisit->gender, $jsonVisit->address, $jsonVisit->date_entrance, $jsonVisit->hour_entrance, $jsonVisit->obs, $jsonVisit->visits]);
echo json_encode([
    "resultado" => $resultado,
]);
