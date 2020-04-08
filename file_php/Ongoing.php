<?php

    function Ongoing($json_data)
    {
        //데이터 받고, 파싱
        $message = $json_data['client_message'];
        //$recieved_plainText = mb_substr($message, 64, mb_strlen($message)-1, 'utf-8');
        //$recieved_HMAC = mb_substr($message, 0, 63, 'utf-8');
        $temp = explode("+",$message);
		$received_HMAC = $temp[0];
		$received_plainText = $temp[1];


        //include('Keying.php');
        
        //session key
        $key = 20;
        
        //key+plain -> hash -> HMAC compute
        $key_plain = $key.$received_plainText;
        $computed_HMAC = hash('sha256', $key_plain);
        
        //두 HMAC 비교 -> confirm
        $confirm = 0;
        if ($received_HMAC == $computed_HMAC) {
            $confirm = 1;
        }
        else
            $confirm = 0;
        
        $Ongoing_message = array(
                        'received_message' => $message,
                        'received_HMAC' => $received_HMAC,
                        'received_plainText' => $received_plainText,
                        'server_Key' => $key,
                        'confirm' => $confirm
                        );
        echo json_encode($Ongoing_message);
    }
?>