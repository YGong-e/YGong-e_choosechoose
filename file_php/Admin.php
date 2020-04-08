<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET,POST,PUT');
    header('Access-Control-Allow-Headers: X-Requested-With,Content-Type');
    header('Content-Type: text/html; charset=utf-8');
    $json_data = json_decode(file_get_contents('php://input'), TRUE);
    $stage_info = $json_data['stage_info'];
    switch($stage_info) {
        case 'Negotiation':
            include('Negotiation.php');
            Negotiation($json_data);
            break;
        case 'Authentication':
            include('Authentication.php');
            Authentication($json_data);
            break;
        case 'Public_Key':
            include('Keying.php');
            Public_Key($json_data);
            break;
		case 'Keying':
            include('Keying2.php');
            Keying($json_data);
            break;
        case 'Ongoing':
            include('Ongoing.php');
            Ongoing($json_data);
            break;
    }
?>