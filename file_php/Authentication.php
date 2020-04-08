<?php
	function Authentication($json_data){

		$Client = $json_data['Hashed_Message_Of_Client'];
		$password = "password";
        $challenge_message = "ChallengeMessage";
        $attached = $password.$challenge_message;
        
		$Hashed = hash('sha256', $attached);

		if($Hashed == $Client)
        {
			$confirm = 1;
		}
        else
        {
			$confirm = 0;
		}

		$Authentication = array(
   		 'confirm'=>$confirm,
   		 'Password_Of_Server'=>$password,
   		 'Hashed_Message_Of_Server'=>$Hashed,
         'Challenge_Message'=>$challenge_message
		);

	echo json_encode($Authentication);
	}
?>
