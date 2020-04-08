<?php




function Public_Key($json_data)
{

    $p_Server = 3;
    $q_Server = 11;
    $totient_Server = getTotient($p_Server, $q_Server);

    $Public_Key_Client_string = $json_data['client_public_key'];
    $Public_Key_Server = publicKey($totient_Server);
    $Private_Key_Server = privateKey($Public_Key_Server, $totient_Server);
	$n_server = getN($p_Server, $q_Server);
	
    
	
    $Public_Key = array(
        'Public_Key_Server' => $Public_Key_Server,
		'n_server' => $n_server,
    );
    echo json_encode($Public_Key);

	//include ("Keying2.php");

	//return $value; 
}


function gcd($num1, $num2)
{
    while ($num2 != 0) {
        $rest = $num1 % $num2;
        $num1 = $num2;
        $num2 = $rest;
    }
    return $num1;
}

function getN($p, $q)
{
    $n = $p * $q;

    return $n;
}

function getTotient($p, $q)
{
    $totient = ($p - 1) * ($q - 1);

    return $totient;
}

function publicKey($totient)
{
    $publicKey = 2;
    while ($publicKey < $totient && gcd($publicKey, $totient) != 1) {
        $publicKey += 1;
    }
    return $publicKey;
}

function privateKey($publicKey, $totient)
{
    $privateKey = 1;
    while (($privateKey * $publicKey) % $totient != 1 || $privateKey == $publicKey) {
        $privateKey += 1;
    }
    return $privateKey;
}
/*
function encrypt($publicKey, $n, $sessionKey)
{
    $encryptedKey = (pow($sessionKey, $publicKey)) % $n;
    return $encryptedKey;
}

function decrypt($privateKey, $n, $encryptedKey)
{
    $decryptedKey = ($encryptedKey * $privateKey) % $n;
    return $decryptedKey;
}
*/
?>










