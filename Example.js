app.LoadPlugin( "StatusBar" )

cfg.Light, cfg.MUI;

//Called when application is started.
function OnStart()
{
	//Create a layout with objects centered.
	lay = app.CreateLayout( "Linear", "Center,FillXY" )

	app.AddImage( lay, "/Sys/Img/BlueBack.jpg", 1, 0.5 )

	btn = app.AddButton( lay, "Transparent StatusBar" )
	btn.SetOnTouch( () => sb.SetTransparentStatusBar() )
	
	//Add layout to app.
	app.AddLayout( lay )

	sb = app.CreateStatusBar()
	alert(sb.GetType());
	s1 = "10";
	s2 = "34";
	s3 = "*";
	//r = sb.Calc(s1, s2, s3);
	r = sb.GetNum(s1);
	alert(r);
}
