// netlify/functions/listarProdutos.js

exports.handler = async (event, context) => {
  try {
    // Pega as variáveis de ambiente definidas no Netlify
    const appKey = process.env.OMIE_APP_KEY;
    const appSecret = process.env.OMIE_APP_SECRET;

    if (!appKey || !appSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Variáveis de ambiente OMIE_APP_KEY e OMIE_APP_SECRET não configuradas."
        }),
      };
    }

    // Body para ListarProdutos, pegando 50 registros da página 1
    const requestBody = {
      call: "ListarProdutos",
      param: [
        {
          pagina: 1,
          registros_por_pagina: 50,
          apenas_importado_api: "N",
          filtrar_apenas_omiepdv: "N"
        }
      ],
      app_key: appKey,
      app_secret: appSecret
    };

    // Faz a requisição para Omie
    const response = await fetch("https://app.omie.com.br/api/v1/geral/produtos/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();

    // Retorna o JSON que a Omie enviou
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
