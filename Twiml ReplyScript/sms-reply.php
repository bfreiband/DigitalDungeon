<?php
$people = array('+5178810973' => 'MirandaSexyPants');

if(!$name = $people[$_REQUEST['Form']]) {
	$name = 'Monkey';
}

header('content_type: text/xml');
echo "<?xml version=\"1.0\" encoding=\"UTF-8"?>\n";
?>

<Response>
	<Sms><?php echo $name; ?>, thanks for the message!</Sms>
</Response>