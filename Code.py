import streamlit as st
import pandas as pd

# Função para carregar os dados da planilha (usando cache para otimizar)
@st.cache_data
def load_data():
    # URL da aba "Lista completa de produtos" com gid=1456973451
    url_csv = "https://docs.google.com/spreadsheets/d/1pcOdo48sQv-AQcLEttkL8Oy3UPtpGAoFp7PeL2MrhaA/export?format=csv&gid=1456973451"
    df = pd.read_csv(url_csv)
    return df

# Carrega os dados
df = load_data()

st.title("Pesquisa de Produtos")
st.write("Digite um termo de pesquisa (mínimo 3 caracteres) para buscar na aba 'Lista completa de produtos':")

# Campo de pesquisa
search_term = st.text_input("Pesquisa:")

if search_term and len(search_term.strip()) >= 3:
    # Lista das colunas onde a busca será realizada:
    # H -> índice 7, F -> índice 5, D -> índice 3, B -> índice 1 e também incluímos C (índice 2)
    col_indices_busca = [7, 5, 3, 1, 2]
    
    # Cria uma máscara inicial com False para todas as linhas
    mask = pd.Series([False] * len(df))
    
    # Para cada coluna definida, verifica se o termo de busca está contido na célula
    for col in col_indices_busca:
        if col < len(df.columns):
            col_data = df.iloc[:, col].astype(str)
            mask = mask | col_data.str.contains(search_term, case=False, na=False)
            
    # Filtra os dados de acordo com a máscara
    resultados = df[mask]
    
    # Define os índices das colunas que serão exibidas: B, C, D, E, F, G, H, J e K
    col_indices_exibicao = [1, 2, 3, 4, 5, 6, 7, 9, 10]
    
    # Verifica se os índices existem no DataFrame
    col_indices_exibicao = [i for i in col_indices_exibicao if i < len(df.columns)]
    
    # Exibe apenas as colunas desejadas
    resultados_exibidos = resultados.iloc[:, col_indices_exibicao]
    
    st.write("Resultados encontrados:")
    st.dataframe(resultados_exibidos)
    
elif search_term:
    st.write("Por favor, digite pelo menos 3 caracteres para iniciar a busca.")
