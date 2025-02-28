import streamlit as st
import pandas as pd

# Função para carregar os dados da planilha (usando cache para evitar recarregamento desnecessário)
@st.cache_data
def load_data():
    # Converte a URL de edição para a URL de exportação em CSV
    url_csv = "https://docs.google.com/spreadsheets/d/1pcOdo48sQv-AQcLEttkL8Oy3UPtpGAoFp7PeL2MrhaA/export?format=csv"
    df = pd.read_csv(url_csv)
    return df

# Carrega os dados
df = load_data()

st.title("Pesquisa de Produtos")
st.write("Digite pelo menos 3 palavras para iniciar a pesquisa:")

# Campo de pesquisa (a cada alteração o app é reexecutado)
search_term = st.text_input("Pesquisa:")

if search_term and len(search_term.split()) >= 3:
    # Define os índices das colunas desejadas: H, F, D e B (lembrando que a indexação inicia em 0)
    col_indices = [7, 5, 3, 1]
    
    # Obtém os nomes das colunas que realmente existem na planilha
    valid_columns = [df.columns[i] for i in col_indices if i < len(df.columns)]
    
    # Separa as palavras digitadas (ignorando diferenças de maiúsculas e minúsculas)
    words = search_term.split()
    
    def row_contains_all_words(row):
        # Concatena os valores das colunas escolhidas em uma única string
        concatenated = " ".join([str(row[col]) for col in valid_columns])
        # Verifica se todas as palavras estão presentes na string (em qualquer ordem)
        return all(word.lower() in concatenated.lower() for word in words)
    
    # Filtra o DataFrame aplicando a função em cada linha
    resultados = df[df.apply(row_contains_all_words, axis=1)]
    
    st.write("Resultados encontrados:")
    st.dataframe(resultados)
else:
    st.write("Por favor, digite pelo menos 3 palavras para buscar.")
