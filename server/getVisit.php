
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");
if (empty($_GET["doc_number"])) {
    exit("No está en sala");
}
$doc_number = $_GET["doc_number"];

$table_entrance = $_GET["table_entrance"];

$bd = include_once "bdEntrance.php";

$sentencia = $bd->prepare("SELECT a.id, a.visitant_id, a.age, a.date_entrance, a.hour_entrance, a.obs, a.visits, a.status, CASE WHEN a.type = 'PERSONA' THEN b.doc_number WHEN a.type = 'VEHICULO' THEN c.plate ELSE 'DESCONOCIDO' END AS doc_number, a.type FROM visits_vc5 a LEFT JOIN vc_data.users b ON a.visitant_id=b.user_id AND a.type='PERSONA' LEFT JOIN vc_data.vehicles c ON a.visitant_id=c.vehicle_id AND a.type='VEHICULO' WHERE CASE WHEN a.type='PERSONA' THEN b.doc_number='".$doc_number."' WHEN a.type='VEHICULO' THEN c.plate='".$doc_number."' ELSE 'DESCONOCIDO' END ORDER BY a.date_entrance DESC;");

$sentencia->execute();
//$cliente = $sentencia->fetchObject();
$visit = $sentencia->fetchObject();
//echo json_encode($cliente[$cliente.length()-1]);
echo json_encode($visit);
