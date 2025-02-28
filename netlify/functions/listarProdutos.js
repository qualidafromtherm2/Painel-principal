
// netlify/functions/listarProdutos.js

// exports.handler é o ponto de entrada da função serverless
exports.handler = async (event, context) => {
  try {
    // Assegure-se de ter configurado OMIE_APP_KEY e OMIE_APP_SECRET em variáveis de ambiente no Netlify
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

    // Monta o body da requisição de acordo com a doc da Omie
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

    // Faz a requisição fetch usando a API nativa do node ou node-fetch (no Netlify 18+ já está disponível nativamente)
    const response = await fetch("https://app.omie.com.br/api/v1/geral/produtos/", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();

    // Retorna o JSON dos produtos
    return {
      statusCode: 200,
      body: JSON.stringify(data), // Retorna o que a Omie mandar
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
