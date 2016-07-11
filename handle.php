<?php 
	// <!-- 处理页面 -->
	// <!-- 接收用户的id,id_name,img_src -->
	// <!-- 需要返回的数据(用户关注信息,用户分享信息,用户是否填写过信息,用户奖品信息) -->
	// $openid = $_GET["openid"];
	// $id_name = $_GET["id_name"];
	// $img_src = $_GET["img_src"];

	$share = array("err"=>"0");//分享(0代表分享过,1代表没有分享过)
	$concern = array("err"=>"0");;//关注(0代表关注过,1代表没有关注过)
	$fill = array("err"=>"0");;//填写信息(0代表填写过,1代表没有填写过)
	$arr1 = array("awards_num"=>"0","awards_coding"=>"Q00001","lingBol"=>"0");
	$arr2 = array("awards_num"=>"1","awards_coding"=>"S00001","lingBol"=>"1");
	$arr3 = array("awards_num"=>"2","awards_coding"=>"B00001","lingBol"=>"0");
	$arr = array();
	$arr[] = $arr1;
	$arr[] = $arr2;
	$arr[] = $arr3;
	$a = array();
	$a[] = $share;
	$a[] = $concern;
	$a[] = $fill;
	$a[] = $arr;
	echo json_encode($a);

 ?>