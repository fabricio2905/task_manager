import tkinter as tk
from tkinter import messagebox
import random

class Processo:
    def __init__(self, pid, prioridade, memoria):
        self.pid = pid
        self.prioridade = prioridade
        self.uso_cpu = random.randint(0, 100)  # Valor aleatório para uso de CPU
        self.estado = "Pronto"
        self.memoria = memoria

class GerenciadorProcessos:
    def __init__(self, root):
        self.root = root
        self.processos = []  # Lista de processos
        self.criar_interface()
        self.processo_em_execucao = None

    def criar_interface(self):
        self.root.title("Gerenciador de Processos Simples")
        
        # Campos de entrada
        self.nome_label = tk.Label(self.root, text="Nome do Processo:")
        self.nome_label.grid(row=0, column=0)
        self.nome_entry = tk.Entry(self.root)
        self.nome_entry.grid(row=0, column=1)

        self.prioridade_label = tk.Label(self.root, text="Prioridade:")
        self.prioridade_label.grid(row=1, column=0)
        self.prioridade_entry = tk.Entry(self.root)
        self.prioridade_entry.grid(row=1, column=1)

        self.memoria_label = tk.Label(self.root, text="Memória (MB):")
        self.memoria_label.grid(row=2, column=0)
        self.memoria_entry = tk.Entry(self.root)
        self.memoria_entry.grid(row=2, column=1)

        # Botão para adicionar processo
        self.add_btn = tk.Button(self.root, text="Adicionar Processo", command=self.adicionar_processo)
        self.add_btn.grid(row=3, column=1)

        # Lista de processos
        self.processos_label = tk.Label(self.root, text="Processos Ativos:")
        self.processos_label.grid(row=4, column=0)

        self.processos_listbox = tk.Listbox(self.root, height=10, width=50)
        self.processos_listbox.grid(row=5, column=0, columnspan=2)
        self.processos_listbox.bind("<Double-Button-1>", self.alterar_estado)

        # Botão para excluir processo
        self.delete_btn = tk.Button(self.root, text="Excluir Processo", command=self.excluir_processo)
        self.delete_btn.grid(row=6, column=1)

    def adicionar_processo(self):
        nome = self.nome_entry.get()
        prioridade = self.prioridade_entry.get()
        memoria = self.memoria_entry.get()

        if nome and prioridade and memoria:
            processo = Processo(nome, prioridade, memoria)
            self.processos.append(processo)
            self.atualizar_lista()
        else:
            messagebox.showwarning("Entrada inválida", "Por favor, preencha todos os campos")

    def atualizar_lista(self):
        self.processos_listbox.delete(0, tk.END)
        for p in self.processos:
            self.processos_listbox.insert(tk.END, f"{p.pid} - {p.estado} - CPU: {p.uso_cpu}% - Memória: {p.memoria}MB")

    def alterar_estado(self, event):
        index = self.processos_listbox.curselection()[0]
        processo = self.processos[index]

        if processo.estado == "Pronto":
            if self.processo_em_execucao is None:
                processo.estado = "Execução"
                self.processo_em_execucao = processo
            else:
                messagebox.showwarning("Execução Bloqueada", "Já existe um processo em execução.")
        elif processo.estado == "Espera":
            processo.estado = "Pronto"
        elif processo.estado == "Execução":
            processo.estado = "Espera"
            self.processo_em_execucao = None

        self.atualizar_lista()

    def excluir_processo(self):
        index = self.processos_listbox.curselection()
        if index:
            processo = self.processos.pop(index[0])
            if processo == self.processo_em_execucao:
                self.processo_em_execucao = None
            self.atualizar_lista()
        else:
            messagebox.showwarning("Seleção", "Selecione um processo para excluir.")

if __name__ == "__main__":
    root = tk.Tk()
    app = GerenciadorProcessos(root)
    root.mainloop()
