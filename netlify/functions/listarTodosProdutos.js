exports.handler = async (event, context) => {
  const { pagina = 1 } = event.queryStringParameters || {};
  const appKey = process.env.OMIE_APP_KEY;
  const appSecret = process.env.OMIE_APP_SECRET;

  // Monta body para apenas UMA página
  const requestBody = {
    call: "ListarProdutos",
    param: [
      {
        pagina: Number(pagina),
        registros_por_pagina: 50,
        apenas_importado_api: "N",
        filtrar_apenas_omiepdv: "N"
      }
    ],
    app_key: appKey,
    app_secret: appSecret
  };

  const response = await fetch("https://app.omie.com.br/api/v1/geral/produtos/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error(`Erro: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
