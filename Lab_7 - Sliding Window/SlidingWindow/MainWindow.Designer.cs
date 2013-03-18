namespace ButeStuffing
{
    partial class MainWindow
    {
        /// <summary>
        /// Требуется переменная конструктора.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Освободить все используемые ресурсы.
        /// </summary>
        /// <param name="disposing">истинно, если управляемый ресурс должен быть удален; иначе ложно.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Код, автоматически созданный конструктором форм Windows

        /// <summary>
        /// Обязательный метод для поддержки конструктора - не изменяйте
        /// содержимое данного метода при помощи редактора кода.
        /// </summary>
        private void InitializeComponent()
        {
            this.textBox_Input = new System.Windows.Forms.TextBox();
            this.button_Send = new System.Windows.Forms.Button();
            this.textBox_Result = new System.Windows.Forms.TextBox();
            this.textBox_Output = new System.Windows.Forms.TextBox();
            this.label_Output = new System.Windows.Forms.Label();
            this.label_Input = new System.Windows.Forms.Label();
            this.label_Result = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // textBox_Input
            // 
            this.textBox_Input.Location = new System.Drawing.Point(12, 25);
            this.textBox_Input.Multiline = true;
            this.textBox_Input.Name = "textBox_Input";
            this.textBox_Input.Size = new System.Drawing.Size(510, 40);
            this.textBox_Input.TabIndex = 0;
            this.textBox_Input.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBox_Input_KeyDown);
            // 
            // button_Send
            // 
            this.button_Send.Location = new System.Drawing.Point(447, 71);
            this.button_Send.Name = "button_Send";
            this.button_Send.Size = new System.Drawing.Size(75, 23);
            this.button_Send.TabIndex = 1;
            this.button_Send.Text = "Send";
            this.button_Send.UseVisualStyleBackColor = true;
            this.button_Send.Click += new System.EventHandler(this.button_Send_Click);
            // 
            // textBox_Result
            // 
            this.textBox_Result.Font = new System.Drawing.Font("DejaVu Sans Mono", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.textBox_Result.Location = new System.Drawing.Point(12, 100);
            this.textBox_Result.Multiline = true;
            this.textBox_Result.Name = "textBox_Result";
            this.textBox_Result.ReadOnly = true;
            this.textBox_Result.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.textBox_Result.Size = new System.Drawing.Size(510, 241);
            this.textBox_Result.TabIndex = 2;
            this.textBox_Result.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBox_Input_KeyDown);
            // 
            // textBox_Output
            // 
            this.textBox_Output.Location = new System.Drawing.Point(12, 360);
            this.textBox_Output.Multiline = true;
            this.textBox_Output.Name = "textBox_Output";
            this.textBox_Output.Size = new System.Drawing.Size(510, 40);
            this.textBox_Output.TabIndex = 3;
            // 
            // label_Output
            // 
            this.label_Output.AutoSize = true;
            this.label_Output.Location = new System.Drawing.Point(9, 344);
            this.label_Output.Name = "label_Output";
            this.label_Output.Size = new System.Drawing.Size(42, 13);
            this.label_Output.TabIndex = 6;
            this.label_Output.Text = "Output:";
            // 
            // label_Input
            // 
            this.label_Input.AutoSize = true;
            this.label_Input.Location = new System.Drawing.Point(9, 9);
            this.label_Input.Name = "label_Input";
            this.label_Input.Size = new System.Drawing.Size(34, 13);
            this.label_Input.TabIndex = 4;
            this.label_Input.Text = "Input:";
            // 
            // label_Result
            // 
            this.label_Result.AutoSize = true;
            this.label_Result.Location = new System.Drawing.Point(9, 84);
            this.label_Result.Name = "label_Result";
            this.label_Result.Size = new System.Drawing.Size(40, 13);
            this.label_Result.TabIndex = 5;
            this.label_Result.Text = "Result:";
            // 
            // MainWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(534, 412);
            this.Controls.Add(this.label_Result);
            this.Controls.Add(this.label_Input);
            this.Controls.Add(this.label_Output);
            this.Controls.Add(this.textBox_Output);
            this.Controls.Add(this.textBox_Result);
            this.Controls.Add(this.button_Send);
            this.Controls.Add(this.textBox_Input);
            this.Name = "MainWindow";
            this.Text = "Main Window";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox textBox_Input;
        private System.Windows.Forms.Button button_Send;
        private System.Windows.Forms.TextBox textBox_Result;
        private System.Windows.Forms.TextBox textBox_Output;
        private System.Windows.Forms.Label label_Output;
        private System.Windows.Forms.Label label_Input;
        private System.Windows.Forms.Label label_Result;
    }
}

