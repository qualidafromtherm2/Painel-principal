exports.handler = async (event, context) => {
  try {
    const appKey = process.env.OMIE_APP_KEY;
    const appSecret = process.env.OMIE_APP_SECRET;
    
    let todosProdutos = [];
    let paginaAtual = 1;
    let totalPaginas = 1;

    do {
      // Monta o body da requisição para esta página
      const requestBody = {
        call: "ListarProdutos",
        param: [
          {
            pagina: paginaAtual,
            // Se sua conta não tem muitos produtos, pode setar até "100" (tente maior se precisar).
            // Se tiver milhares, talvez precise paginar muitas vezes.
            registros_por_pagina: 50,
            apenas_importado_api: "N",
            filtrar_apenas_omiepdv: "N"
          }
        ],
        app_key: appKey,
        app_secret: appSecret
      };

      // Faz a requisição a cada página
      const response = await fetch("https://app.omie.com.br/api/v1/geral/produtos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();

      // data.produto_servico_listfull_response ou data.produto_servico_resumido?
      // A chamada "ListarProdutos" retorna "produto_servico_listfull_response" quando exibir todos os campos.
      // Dentro dele, há: "pagina", "total_de_paginas", "produto_servico_cadastro", etc.

      // Confirma se recebeu algo
      if (data.faultstring) {
        // Se houve algum erro da Omie
        throw new Error(data.faultstring);
      }

      const pagina = data.pagina; // número da página retornada
      totalPaginas = data.total_de_paginas;
      const registros = data.registros;
      const produtoArray = data.produto_servico_cadastro || [];

      // Concatena ao array geral
      todosProdutos = todosProdutos.concat(produtoArray);

      console.log(`Página ${pagina} recebida, contendo ${registros} registros.`);

      paginaAtual++;
    } while (paginaAtual <= totalPaginas);

    // Agora 'todosProdutos' contém todos os produtos de todas as páginas.
    // Retornamos em JSON para o front-end
    return {
      statusCode: 200,
      body: JSON.stringify({ todosProdutos }),
    };
  } catch (error) {
    console.error("Erro na função listarTodosProdutos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
