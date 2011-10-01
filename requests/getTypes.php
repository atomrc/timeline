<?
	
	$return = "{";
	$db = new sqlite3("../db/chrono.sqlite");

	$query = "SELECT * FROM type ORDER BY id;";
	$res = $db->query($query);
	
	$isFirst = true;

	while($row = $res->fetchArray()) {
		if(!$isFirst) {
			$return .= ",";
		}
		$isFirst = false;
		$id = $row['id'];
		$name = $row['name'];
		$return .= "\"".$id."\" : \"".$name."\"";
	}
	$return .= "}";
	echo $return;

?>
