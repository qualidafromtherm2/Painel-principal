import streamlit as st
import pandas as pd

# Função para carregar os dados da planilha (usando cache para não recarregar sempre)
@st.cache_data
def load_data():
    # Converte a URL de edição para a URL de exportação em CSV
    url_csv = "https://docs.google.com/spreadsheets/d/1pcOdo48sQv-AQcLEttkL8Oy3UPtpGAoFp7PeL2MrhaA/export?format=csv"
    df = pd.read_csv(url_csv)
    return df

# Carrega os dados
df = load_data()

st.title("Pesquisa de Produtos")
st.write("Digite um termo de pesquisa para buscar na planilha:")

# Campo de pesquisa
search_term = st.text_input("Pesquisa:")

if search_term:
    # Colunas para pesquisar: H, F, D e B (lembre que a indexação começa em 0)
    # Assim, H -> índice 7, F -> índice 5, D -> índice 3, B -> índice 1
    col_indices = [7, 5, 3, 1]
    
    # Inicializa a máscara de seleção como uma série booleana False com o mesmo índice do dataframe
    mask = pd.Series([False] * len(df))
    
    # Percorre cada coluna definida e verifica se o termo aparece
    for col in col_indices:
        # Verifica se o índice existe (caso a planilha tenha menos colunas)
        if col < len(df.columns):
            mask = mask | df.iloc[:, col].astype(str).str.contains(search_term, case=False, na=False)
    
    # Filtra os dados de acordo com a máscara
    resultados = df[mask]
    
    # Exibe os resultados
    st.write("Resultados encontrados:")
    st.dataframe(resultados)
