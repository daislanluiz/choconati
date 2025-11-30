# ChocoNati Gestão

Um sistema completo de controle de estoque e financeiro para confeitarias.

## Versão Web (React)
Este projeto foi incialmente criado em React. Para rodar a versão web:
`npm start`

## Versão Python (Streamlit)
Uma versão completa em Python foi adicionada para execução local ou em servidores Python.

### Como rodar a versão Python:

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Configure sua chave da API do Google Gemini (necessário para o Consultor IA):
   - Crie um arquivo `.env` ou exporte a variável no terminal:
   - Linux/Mac: `export API_KEY="sua_chave_aqui"`
   - Windows: `set API_KEY="sua_chave_aqui"`

3. Execute o aplicativo:
```bash
streamlit run streamlit_app.py
```

O aplicativo abrirá no seu navegador padrão (geralmente http://localhost:8501).
