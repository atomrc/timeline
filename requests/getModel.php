<?
	$return = "{";
	$db = new sqlite3('../db/chrono.sqlite');

	$query = "SELECT * FROM frise ORDER BY type;";
	$res = $db->query($query);

	$typeFact = -1;
	$isFirst = true;
	while($row = $res->fetchArray()) {
		if ($row['type'] != $typeFact) {
			if($typeFact != -1) {
				$return .= "], ";
			}
			$typeFact = $row['type'];
			$return .= "\"$typeFact\" : [";
			$isFirst = true;
		}
		if(!$isFirst) { $return .= ", ";}
		$isFirst = false;
		$typeFact = $row['type'];
		$id = $row['id'];
		$name = $row['name'];
		$start = $row['start'];
		$end = $row['end'];
		$desc = $row['desc'];

		$return .= "{\"id\" : $id , 
			\"name\" : \"$name\", 
			\"start\" : \"$start\",
			\"end\" : \"$end\",
			\"desc\" : \"$desc\",
			\"type\" : $typeFact}";
	}
	
	$return .="]}";

	echo $return;
?>
