app.LoadPlugin("JavaCompiler")

// The name to use for the plugin:
const PLUGIN_NAME = "StatusBar"

let jac, instlBtn

//Called when application is started.
function OnStart()
{
//a = app.ReadFile( "ds:/Sys/app.js" );
//app.SetClipboardText( a );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout("Linear", "VCenter,FillXY")
	lay.SetChildMargins( 0, 16, 0, 0, "dp" )
	lay.SetBackColor( "#303446" )
	
	const title = app.AddText( lay, "Plugin Maker" )
	title.SetMargins( 0, 0, 0, 32, "dp" )
	title.SetTextColor( "#c6d0f5" )
	title.SetTextSize( 32, "sp" )

	const cmpBtn = app.AddButton(lay, "Compile", 0.35)
	cmpBtn.SetBackColor( "#99d1db" )
	cmpBtn.SetTextColor( "#303446" )
	cmpBtn.SetOnTouch( buildPlugin )
	
	instlBtn = app.AddButton(lay, "Install", 0.35)
	instlBtn.SetBackColor( "#a6d189" )
	instlBtn.SetTextColor( "#303446" )
	instlBtn.SetEnabled(false);
	instlBtn.SetOnTouch( installPlugin )

  const testBtn = app.AddButton(lay, "Run example", 0.35)
	testBtn.SetBackColor( "#eebebe" )
	testBtn.SetTextColor( "#303446" )
	testBtn.SetOnTouch( runExample )

	//Add layout to app.	
	app.AddLayout(lay)

	jac = app.CreateJavaCompiler()
}

function buildPlugin() {
    app.DeleteFolder("output")
    app.MakeFolder("output")

    app.ShowProgressBar("Java file is being compiled...")
    const compileResult = compile()

    if (!compileResult) return;

    //app.Wait(1)

    //app.ShowProgressBar("Generating the JS code of the plugin...")
    app.UpdateProgressBar(33)
    declareFunctions()

    //app.Wait(1)

    //app.ShowProgressBar("The document is being created...")
    app.UpdateProgressBar(66)
    generateDocumnet()

    //app.Wait(1)

    //app.ShowProgressBar("Output is being packed...")
    app.UpdateProgressBar(99)
    generateZipPackage()

    //app.Wait(1)

    clearOutput();
    app.UpdateProgressBar(100)
    app.HideProgressBar()

    app.Vibrate( "25,50,25" )
    app.ShowPopup( "Your plugin has been successfully created.", "Bottom" )
    
    instlBtn.SetEnabled(true)
}

function compile() {
    // Create a temporary folder to hold the output files.
    // Using device folders may result in unwanted files.
    const tempFolder = app.GetTempFolder() + "/classes"
    app.MakeFolder(tempFolder)

    app.CopyFile("Java.js", PLUGIN_NAME + ".java")

    // Path to the Java file
    jac.AddJavaFile(PLUGIN_NAME + ".java")
    jac.SetOutputFolder(tempFolder)

    const res = jac.Compile()

    // If the operation is successful.
    if(res === true) {
        // Create a jar package without deleting the resulting .class files.
        jac.GenerateJarFile()

        // Now we convert the jar file to dex and add it to our output folder.
        jac.GenerateDexFile( tempFolder + "/classes.jar" )
        app.CopyFile( tempFolder + "/classes.dex", `output/${PLUGIN_NAME}.jar` )
    } else {
        // Show messages when the operation fails.
        app.Alert(jac.GetDiagnosticMessages(), "Compile Error")
    }

    // Now we can clean up the output folder.
    app.DeleteFolder(tempFolder)

    return res;
}

function declareFunctions() {
    let template = app.ReadFile("Plugin.js")
    template = template.replaceAll("_PLUGIN_NAME_", PLUGIN_NAME)

    app.WriteFile(`output/${PLUGIN_NAME}.inc`, template)
}

function generateDocumnet() {
    let template = app.ReadFile("Document.html")
    template = template.replaceAll("_PLUGIN_NAME_", PLUGIN_NAME)
    template = template.replace("_EXAMPLE_", app.ReadFile("Example.js"))

    app.WriteFile(`output/${PLUGIN_NAME}.html`, template)
}

function generateZipPackage() {
    app.ZipFolder( "output", "output.zip" )
    app.RenameFile( "output.zip", `output/${PLUGIN_NAME}.ppk` )
}

function clearOutput() {
    const files = [
        PLUGIN_NAME + ".java",
        `output/${PLUGIN_NAME}.inc`,
        `output/${PLUGIN_NAME}.html`,
        `output/${PLUGIN_NAME}.jar`
    ]

    files.forEach(src => app.DeleteFile(src))
}

function installPlugin() {
    app.OpenFile(`output/${PLUGIN_NAME}.ppk`, "application/ppk", "Choose DroidScript")

    app.Wait(3)
    app.ToFront()
}

function runExample() {
    app.StartApp( "Example.js" )
    app.Exit()
}