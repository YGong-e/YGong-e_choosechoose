<?php


function Keying($json_data)
{
	$encrypted_session_key = $json_data['encrypted_session_key'];
	$p_Server_2 = 3;
	$q_Server_2 = 11;
	$totient_Server_2 = getTotient_2($p_Server_2, $q_Server_2);
	$Public_Key_Server_2 = publicKey_2($totient_Server_2);
	$Private_Key_Server_2 = privateKey_2($Public_Key_Server_2, $totient_Server_2);
	$n_server_2 = getN_2($p_Server_2, $q_Server_2);
    $decryptedKey = decrypt_2($Private_Key_Server_2, $n_server_2, $encrypted_session_key); //decrypt
    $confirm = 1;
    $Keying = array(
        'confirm' => $confirm,
        'encryptedKey' => $encrypted_session_key,
        'decryptedKey' => $decryptedKey,
    );
	echo json_encode($Keying);
}

function gcd_2($num1, $num2)
{
    while ($num2 != 0) 
	{
        $rest = $num1 % $num2;
        $num1 = $num2;
        $num2 = $rest;
    }
    return $num1;
}


function getTotient_2($p, $q)
{
    $totient = ($p - 1) * ($q - 1);

    return $totient;
}

function publicKey_2($totient)
{
    $publicKey = 2;
    while ($publicKey < $totient && gcd_2($publicKey, $totient) != 1) {
        $publicKey += 1;
    }
    return $publicKey;
}

function privateKey_2($publicKey, $totient)
{
    $privateKey = 1;
    while (($privateKey * $publicKey) % $totient != 1 || $privateKey == $publicKey) {
        $privateKey += 1;
    }
    return $privateKey;
}


function getN_2($p, $q)
{
    $n = $p * $q;

    return $n;
}

function encrypt_2($publicKey, $n, $sessionKey)
{
    $encryptedKey = (pow($sessionKey, $publicKey)) % $n;
    return $encryptedKey;
}

function decrypt_2($privateKey, $n, $encryptedKey)
{
    $decryptedKey = (pow($encryptedKey , $privateKey)) % $n;
    return $decryptedKey;
}
?>
