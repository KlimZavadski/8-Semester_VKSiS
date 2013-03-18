using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using System.Threading;

namespace ButeStuffing
{
    public partial class MainWindow : Form
    {
        Thread worker;

        struct Package
        {
            int id;
            char symbol;
        };

        public MainWindow()
        {
            InitializeComponent();

            worker = new Thread(new ParameterizedThreadStart(Worker));
        }

        #region [Handlers]
        private void button_Send_Click(object sender, EventArgs e)
        {
            String text = textBox_Input.Text;
            if (text == "") return;
            worker.Start(text);
        }

        private void textBox_Input_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                button_Send_Click(null, null);
            }
        }
        #endregion


        private String GetSubstring(String input, int position, int length)
        {
            return (input.Length > position + length) ?
                input.Substring(position, length) :
                input.Substring(position);
        }

        private void Worker(Object param)
        {
            String text = param as String;
            Random random = new Random();
            //List<

            foreach (var c in text)
            {
                if (random.NextDouble() < 0.5)
                {
                    //
                }
            }
        }
    }
}