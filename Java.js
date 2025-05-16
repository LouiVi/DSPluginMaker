package com.dev.plugins.user;

/*
 * THIS IS NOT A JavaScript file.
 * IT IS a Java FILE but the ".js" extension is used
 * because the editor does not recognize files with ".java" extension.
*/

/*
    DroidScript Plugin class.
    (This is where you put your main plugin code)

    Notes:
    - Maybe it can be a reference for Java support: https://github.com/DroidScript/Plugin-Java
    - The package name for free plugins must end with the string '.user' or a license error will
      be triggered. Premium only plugins can have any package name.
*/

import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.app.Activity;
import android.graphics.Color;

public class StatusBar {
    public static String TAG = "StatusBar";    
    public static float VERSION = 1.0f;
    private Object m_parent;
    private Context m_ctx;

    // Construct plugin.
    public StatusBar() {
        Log.d(TAG, "Creating plugin object");
    }

    // Initialise plugin.
    public void Init(Context ctx, Object parent) throws Exception {
        Log.d(TAG, "Initialising plugin object");

        // Save context and reference to parent (AndroidScript).
        m_ctx = ctx;
        m_parent = parent;
    }

    // Handle commands from DroidScript.
    public String CallPlugin(Bundle b, Object obj) throws Exception {
        // Extract command.
        String cmd = b.getString("cmd");

        // Process commands.
        String ret = null;
        String num1 = b.getString("num1");
        String num2 = b.getString("num2");
        String operator = b.getString("operator");
        
        switch (cmd) {
        		case "GetNum":
        				ret = num1;
        				break;
            case "GetVersion":
                ret = Float.toString(VERSION);
                break; // Added break statement here
            case "GetType":
                ret = GetType();
                break;
            case "Calc":
                // Ensure parameters are passed correctly to the Calc method
                ret = Calc(num1, num2, operator);
                break;
            case "setTransparentStatusBar":
                setTransparentStatusBar();
                break;
        }

        return ret;
    }

    public String GetType() {
        // Return the object type.
        return "StatusBar";
    }
    
    public String Calc(String num1, String num2, String operator) {
        double number1 = Double.parseDouble(num1);
        double number2 = Double.parseDouble(num2);
        double result = 0;

        switch (operator) {
            case "+":
                result = number1 + number2;
                break;
            case "-":
                result = number1 - number2;
                break;
            case "*":
                result = number1 * number2;
                break;
            case "/":
                if (number2 != 0) {
                    result = number1 / number2;
                } else {
                    return "Error: Division by zero";
                }
                break;
            default:
                return "Error: Invalid operator";
        }

        return String.valueOf(result);
    }

    public void setTransparentStatusBar() {
        Window window = ((Activity) m_ctx).getWindow();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

            int option = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
            int vis = window.getDecorView().getSystemUiVisibility();

            window.getDecorView().setSystemUiVisibility(option | vis);
            window.setStatusBarColor(Color.TRANSPARENT);
        } else {
            window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        }
    }
}