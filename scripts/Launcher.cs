using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Windows.Forms;

namespace FreeGSTBilling
{
    static class Program
    {
        private const int Port = 47371;
        private static Process serverProcess = null;

        [STAThread]
        static void Main()
        {
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string portFile = Path.Combine(appDir, "data", "port.txt");

            int activePort = Port;
            if (File.Exists(portFile))
            {
                int.TryParse(File.ReadAllText(portFile).Trim(), out activePort);
                if (activePort <= 0) activePort = Port;
            }

            // Check if backend is already listening
            if (!IsPortOpen("127.0.0.1", activePort, 1500))
            {
                // Start Node server in background
                string serverScript = Path.Combine(appDir, "server.js");
                if (!File.Exists(serverScript))
                {
                    // Fallback check if inside a subfolder
                    string altScript = Path.Combine(appDir, "_system", "server.js");
                    if (File.Exists(altScript)) serverScript = altScript;
                }

                if (File.Exists(serverScript))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "node.exe",
                        Arguments = "\"" + serverScript + "\"",
                        WorkingDirectory = Path.GetDirectoryName(serverScript),
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };

                    try
                    {
                        serverProcess = Process.Start(psi);
                    }
                    catch
                    {
                        // Try running 'node' via PATH if local node.exe not found
                        psi.FileName = "node";
                        try { serverProcess = Process.Start(psi); } catch { }
                    }

                    // Wait up to 5 seconds for server to start
                    for (int i = 0; i < 25; i++)
                    {
                        if (IsPortOpen("127.0.0.1", activePort, 200)) break;
                        Thread.Sleep(200);
                    }
                }
            }

            string targetUrl = "http://localhost:" + activePort;

            // Open in clean standalone App Mode (Edge or Chrome)
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            if (!File.Exists(edgePath)) edgePath = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";

            string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
            if (!File.Exists(chromePath)) chromePath = @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";

            Process browserProc = null;
            if (File.Exists(edgePath))
            {
                browserProc = Process.Start(edgePath, "--app=\"" + targetUrl + "\" --new-window");
            }
            else if (File.Exists(chromePath))
            {
                browserProc = Process.Start(chromePath, "--app=\"" + targetUrl + "\" --new-window");
            }
            else
            {
                Process.Start(new ProcessStartInfo(targetUrl) { UseShellExecute = true });
            }
        }

        private static bool IsPortOpen(string host, int port, int timeoutMs)
        {
            try
            {
                using (var client = new TcpClient())
                {
                    var result = client.BeginConnect(host, port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(timeoutMs);
                    if (!success) return false;
                    client.EndConnect(result);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
