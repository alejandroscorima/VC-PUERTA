<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("Solo acepto peticiones POST");
}

$jsonPerson = json_decode(file_get_contents("php://input"));
if (!$jsonPerson) {
    exit("No hay datos");
}

$bd = include_once "bdData.php";

$sentencia = $bd->prepare("INSERT INTO users(colab_id, type_doc, 
doc_number, first_name, paternal_surname, maternal_surname, gender, 
birth_date, civil_status, profession, cel_number, email, address, 
district, province, region, username, password, entrance_role, 
latitud, longitud, photo_url, house_id, status, reason) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
$resultado = $sentencia->execute([$jsonPerson->colab_id, $jsonPerson->type_doc, $jsonPerson->doc_number, 
$jsonPerson->first_name, $jsonPerson->paternal_surname, $jsonPerson->maternal_surname, $jsonPerson->gender, 
$jsonPerson->birth_date, $jsonPerson->civil_status, $jsonPerson->profession, $jsonPerson->cel_number, 
$jsonPerson->email, $jsonPerson->address, $jsonPerson->district, $jsonPerson->province, $jsonPerson->region, 
$jsonPerson->username, $jsonPerson->password, $jsonPerson->entrance_role, $jsonPerson->latitud, 
$jsonPerson->longitud, $jsonPerson->photo_url, $jsonPerson->house_id, $jsonPerson->status, $jsonPerson->reason]);

// Obtener el último ID insertado
$lastId = $bd->lastInsertId();

echo json_encode([
    "lastId" => $lastId,
]);
?>
