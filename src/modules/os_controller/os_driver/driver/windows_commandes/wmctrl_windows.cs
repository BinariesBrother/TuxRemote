using System; // For IntPtr
using System.Runtime.InteropServices; // DllImport
using System.Diagnostics; // Process
using System.Text;

public class wmctrl
{

    delegate bool EnumThreadDelegate(IntPtr hWnd, IntPtr lParam);

    // --------------------------------------------------------------------------------
    // --- Switch to Window
    // --------------------------------------------------------------------------------
    //dll import (can't be in method, but needs to be in class
    [DllImport("user32.dll")]
    public static extern void SwitchToThisWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    static extern bool EnumThreadWindows(int dwThreadId, EnumThreadDelegate lpfn,
    IntPtr lParam);

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    static extern bool IsWindowVisible(IntPtr hWnd);
    
    [DllImport("user32.dll", CharSet=CharSet.Auto)]
    public static extern int GetWindowTextLength(IntPtr hWnd);
    
    [DllImport("user32.dll", CharSet=CharSet.Auto)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    
    [DllImport("user32.dll")]
    public static extern int SendMessage(IntPtr hWnd, uint Msg, int wParam, int lParam);
    
    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();
    
    public const int WM_SYSCOMMAND = 0x0112;
    
    public const int SC_CLOSE = 0xF060;

    private const char OPENING_BRACE = '{';
    private const char CLOSING_BRACE = '}';

    public static int SwitchToWindow(IntPtr hWnd)
    {
        // Getting window matching 
        if (hWnd == null)
        {
            Console.WriteLine("Error: No window id");
            return -1;
        }
        else
        {
            // --- Switching to window using user32.dll function
            SwitchToThisWindow(hWnd);
            return 0;
        }
    }

    public static int closeWindow(IntPtr hWnd)
    {
        // Getting window matching 
        if (hWnd == null)
        {
            Console.WriteLine("Error: No window id");
            return -1;
        }
        else
        {
            // --- Closing window
            SendMessage(hWnd, WM_SYSCOMMAND, SC_CLOSE, 0);
            return 0;
        }
    }
    

    public static int KillProcess(int procId)
    {
        // Getting window matching 
        Process proc = Process.GetProcessById(procId);
        if (proc == null)
        {
            Console.WriteLine("Error: No process found for id: {0}", procId);
            return -1;
        }
        else
        {
            // --- kill process
            proc.Kill();
            return 0;
        }
    }


    // --------------------------------------------------------------------------------
    // --- List Windows info
    // --------------------------------------------------------------------------------
    public static int ListWindows(bool json)
    {
        Process[] processlist = Process.GetProcesses();
        if(!json){
            Console.WriteLine("ID: \t Name:\t Title:");
            Console.WriteLine("-------------------------------------------------");
        }
        foreach (Process proc in processlist)
        {
            
           if (!String.IsNullOrEmpty(proc.MainWindowTitle))
            {
                printWindowsByProcess(proc, json);
            }
        }
        return 0;
    }

    private static void printWindowsByProcess(Process proc, bool json){
        if(!json){
            Console.WriteLine("{0}\t {1}", proc.Id, proc.ProcessName);
        }
        foreach (ProcessThread thread in proc.Threads)
            EnumThreadWindows(thread.Id, 
                (hWnd, lParam) => { if(json) return printJsonLine(hWnd, proc); else return printLine(hWnd);}, IntPtr.Zero);
    }

    private static bool printJsonLine(IntPtr hWnd, Process proc){
        if(IsWindowVisible(hWnd))
            Console.WriteLine("{0}\"id\":{1}, \"windowId\":{2}, \"title\":\"{3}\"{4}", OPENING_BRACE, proc.Id, hWnd, getWindowTitle(hWnd).Replace("\"", "\\\""), CLOSING_BRACE    ); 
        return true;
    }
    private static bool printLine(IntPtr hWnd){
        if(IsWindowVisible(hWnd))
            Console.WriteLine("\t\t{0}\t {1}", hWnd, getWindowTitle(hWnd)); 
        return true;
    }

    private static String getWindowTitle(IntPtr hWnd){
        int capacity = GetWindowTextLength(hWnd) * 2;
            StringBuilder stringBuilder = new StringBuilder(capacity);
        GetWindowText(hWnd, stringBuilder, stringBuilder.Capacity);
        return stringBuilder.ToString();
    }

    // --------------------------------------------------------------------------------
    // --- Print command usage 
    // --------------------------------------------------------------------------------
    public static void print_usage()
    {
        Console.WriteLine("");
        Console.WriteLine("usage: wmctrl [options] [args]");
        Console.WriteLine("");
        Console.WriteLine("options:");
        Console.WriteLine("  -h         : show this help");
        Console.WriteLine("  -j         : ask json format");
        Console.WriteLine("  -l         : list windows");
        Console.WriteLine("  -k <PID>   : kill process");
        Console.WriteLine("  -a <HWnd>  : switch to the window of the ID <HWnd>");
        Console.WriteLine("  -c <HWnd>  : close window of the ID <HWnd>");
        Console.WriteLine("  -f         : get focus <HWnd>");

    }

    // --------------------------------------------------------------------------------
    // --- Main Program 
    // --------------------------------------------------------------------------------
    public static int Main(string[] args)
    {
        int status = 0; // Return status for Main

        // --------------------------------------------------------------------------------
        // --- Parsing arguments 
        // --------------------------------------------------------------------------------
        int nArgs = args.Length;
        if (nArgs == 0)
        {
            Console.WriteLine("Error: insufficient command line arguments");
            print_usage();
            return 0;
        }
        int i = 0;
        bool json = false;
        while (i < nArgs)
        {
            string s = args[i];
            switch (s)
            {
                case "-h": // Help
                    print_usage();
                    i = i + 1;
                    break;
                case "-j": // Help
                    json = true;
                    Console.WriteLine("json true");
                    i = i + 1;
                    break;
                case "-k": // Switch to Window
                    if (i + 1 < nArgs)
                    {
                        int j = int.Parse(args[i + 1]);
                        status = KillProcess(j);
                        i = i + 2;
                    }
                    else
                    {
                        Console.WriteLine("Error: command line option -k needs to be followed by a process ID.");
                        status = -1;
                    }
                    break;
                case "-a": // Switch to Window
                    if (i + 1 < nArgs)
                    {
                        IntPtr j = new IntPtr(Int32.Parse(args[i + 1]));
                        status = SwitchToWindow(j);
                        i = i + 2;
                    }
                    else
                    {
                        Console.WriteLine("Error: command line option -a needs to be followed by a window handle.");
                        status = -1;
                    }
                    break;
                case "-c": // Switch to Window
                    if (i + 1 < nArgs)
                    {
                        IntPtr j = new IntPtr(Int32.Parse(args[i + 1]));
                        status = closeWindow(j);
                        i = i + 2;
                    }
                    else
                    {
                        Console.WriteLine("Error: command line option -c needs to be followed by a window handle.");
                        status = -1;
                    }
                    break;
                case "-l": // List Windows
                    status = ListWindows(json);
                    i++;
                    break;
                case "-f": // List Windows
                    IntPtr hWnd = GetForegroundWindow();
                    Console.WriteLine("{0}", hWnd);
                    i++;
                    break;
                default:
                    Console.WriteLine("Skipped argument: " + args[i]);
                    i++;
                    break;
            }
            if (status != 0)
            {
                // If an error occured, print usage and exit
                print_usage();
                return status;
            }
        }
        //
        return status;
    }



}