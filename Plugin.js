// Add method to global app object.
app.Create_PLUGIN_NAME_ = (options) => new _PLUGIN_NAME_(options);

// Plugin wrapper object.
function _PLUGIN_NAME_(options) {
    this.plg = _CreatePlugin("com.dev.plugins.user._PLUGIN_NAME_", options);

    this.GetVersion = () => parseFloat(this.plg.Send("GetVersion"));
    this.SetTransparentStatusBar = () => this.plg.Send("setTransparentStatusBar");
    this.GetType = () => this.plg.Send("GetType");
		this.GetNum = (num1) => this.plg.Send("GetNum", num1);
    // Corrected the Calc method to ensure proper argument passing
    this.Calc = num1 = num2 = operator  => 
        // Ensure parameters are passed as a Bundle
        this.plg.Send("Calc", {
            num1: num1,
            num2: num2,
            operator: operator
        });
    
}