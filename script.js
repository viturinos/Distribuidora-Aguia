/* ==========================================================================
   DISTRIBUIDORA ÁGUIA — Catálogo digital + Pedido pelo WhatsApp
   ==========================================================================
   COMO O SITE FUNCIONA (resumo):
   - Os produtos ficam listados neste arquivo (array "produtos") e o JavaScript
     os desenha na tela automaticamente (funk renderizarProdutos).
   - Quando o cliente clica em "Adicionar ao pedido", o produto entra no
     "carrinho" (um array). O carrinho é salvo no navegador via localStorage,
     para que o pedido não se perca ao fechar a página.
   - O painel do carrinho funciona em 4 ETAPAS, uma de cada vez:
       1) Produtos  -> 2) Entrega  -> 3) Dados  -> 4) Envio
     Cada etapa tem sua própria validação. Só passa para a próxima se estiver
     correta.
   - Na última etapa, o JavaScript monta uma mensagem de texto com o resumo
     completo do pedido e abre o WhatsApp do fornecedor com essa mensagem
     pronta. NÃO existe pagamento nem finalização de compra no site.
   ========================================================================== */

/* ==========================================================================
   CONFIGURAÇÃO CENTRAL
   --------------------------------------------------------------------------
   É AQUI QUE O DONO DA EMPRESA EDITA TUDO. Nada precisa ser procurado
   no resto do código.
   ========================================================================== */

const CONFIG = {
    // Nome e slogan exibidos no site
    nomeEmpresa: "Distribuidora Águia",
    slogan: "Distribuidora de alimentos",
    segmento: "DISTRIBUIDORA DE ALIMENTOS",

    // WhatsApp no formato internacional: 55 + DDD + número.
    // SEM espaços, parênteses ou hífens. Exemplo: "5589999999999"
    whatsappFornecedor: "5589981425420",

    // Redes sociais e localização
    instagram: "https://instagram.com/vtrzin.sz",
    cidade: "Picos",
    estado: "PI",
    endereco: "Av. Severo Eulálio, Picos - PI",

    // Horário de funcionamento
    horario: "SEG A SEX • 7H ÀS 18H"
};

/* --------------------------------------------------------------------------
   TAXA DE ENTREGA
   --------------------------------------------------------------------------
   - Sem taxa: mantenha taxaEntrega = 0.
   - Taxa fixa por bairro: preencha o objeto "taxasEntrega", por exemplo:

       const taxasEntrega = {
           "Centro": 5.00,
           "Bairro São José": 7.00,
           "Bairro Junco": 10.00
       };

   Quando o objeto tiver bairros, o site mostra sozinho um campo "bairro"
   na etapa 2 (Entrega) e calcula a taxa conforme o que o cliente escolher.
   ========================================================================== */

const taxaEntrega = 0;

const taxasEntrega = {}; // vazio = sem taxa por bairro

/* --------------------------------------------------------------------------
   PRODUTOS DO CATÁLOGO
   --------------------------------------------------------------------------
   Cada produto é um "objeto" com estas informações:
     - id          : número único do produto
     - nome        : nome que aparece no card
     - descricao   : texto curto explicando o produto
     - preco       : preço em reais, usando PONTO para os centavos (ex.: 6.50)
     - categoria   : precisa ser igual a uma das categorias da lista abaixo
     - imagem      : caminho da imagem em assets/images/
     - disponivel  : true = à venda | false = esgotado (aparece indisponível)
   Para cadastrar um produto novo é só copiar um bloco { } e mudar os valores.
   ========================================================================== */

const produtos = [
    { id: 1, nome: "Doce Amor de Minas, Sachê 30g", descricao: "Pct com 1,5kg, aprox. 50 Unid cx/10 pacotes", preco: 60.49, categoria: "Doces Amor de Minas", imagem: "assets/images/obj-894.png", disponivel: true },
    { id: 2, nome: "Doce Amor de Minas Tablete Tradicional", descricao: "Pote c/20 de 47g cx c/12 Potes", preco: 56.9, categoria: "Doces Amor de Minas", imagem: "assets/images/obj-892.png", disponivel: true },
    { id: 3, nome: "Doce Amor de Minas Tablete c/coco", descricao: "Pote c/20 de 47g cx c/12 Potes", preco: 56.9, categoria: "Doces Amor de Minas", imagem: "assets/images/obj-893.png", disponivel: true },
    { id: 4, nome: "Doce de Leite Pastoso, para confeitaria", descricao: "Bisnaga 1kg", preco: 42, categoria: "Doces Amor de Minas", imagem: "assets/images/obj-895.png", disponivel: true },
    { id: 5, nome: "Moedas sabor Chocolate", descricao: "130 Unidades", preco: 52.75, categoria: "Bombons e Chocolates", imagem: "assets/images/obj-906.png", disponivel: true },
    { id: 6, nome: "Caixa de Bombons Sortidos", descricao: "180g (20 Unid x 9g cada)", preco: 9.49, categoria: "Bombons e Chocolates", imagem: "assets/images/obj-907.png", disponivel: true },
    { id: 7, nome: "Moranguete Pote", descricao: "c/50 Unid x 9g cada", preco: 24.5, categoria: "Bombons e Chocolates", imagem: "assets/images/obj-908.png", disponivel: true },
    { id: 8, nome: "Moranguete Caixa", descricao: "c/100 Unid x 9g cada", preco: 0, categoria: "Bombons e Chocolates", imagem: "assets/images/obj-909.png", disponivel: true },
    { id: 9, nome: "Tablete Golden Ao Leite", descricao: "460g (20un x 23g)", preco: 28, categoria: "Bombons e Chocolates", imagem: "assets/images/obj-910.png", disponivel: true },
    { id: 10, nome: "Tablete Golden Ao Leite", descricao: "900g (10un x 90g)", preco: 54, categoria: "Bombons e Chocolates", imagem: "assets/images/obj-911.png", disponivel: true },
    { id: 11, nome: "Doce Beijo C/ Chocolate", descricao: "Pote c/21und", preco: 58, categoria: "Doces em Pote", imagem: "assets/images/obj-924.png", disponivel: true },
    { id: 12, nome: "Doce Palha Italiana", descricao: "Pote c/21und", preco: 58, categoria: "Doces em Pote", imagem: "assets/images/obj-925.png", disponivel: true },
    { id: 13, nome: "Doce de Brigadeiro", descricao: "Pote c/21und", preco: 58, categoria: "Doces em Pote", imagem: "assets/images/obj-927.png", disponivel: true },
    { id: 14, nome: "Doce Pé de Moça", descricao: "Pote c/21und", preco: 58, categoria: "Doces em Pote", imagem: "assets/images/obj-926.png", disponivel: true },
    { id: 15, nome: "Doce de Leite Pingo Bel", descricao: "Pote c/21und", preco: 58, categoria: "Doces em Pote", imagem: "assets/images/obj-923.png", disponivel: true },
    { id: 16, nome: "Amend. Jap. Bacon 24g", descricao: "Cartela com 5 unid Cx com 14 tiras", preco: 5.5, categoria: "Amendoim Japonês", imagem: "assets/images/obj-938.png", disponivel: true },
    { id: 17, nome: "Amend. Jap. Trad. 24g", descricao: "Cartela com 5 unid Cx com 14 tiras", preco: 5.5, categoria: "Amendoim Japonês", imagem: "assets/images/obj-939.png", disponivel: true },
    { id: 18, nome: "Amend. S/ Pele. 24g Und", descricao: "Cartela com 5 unid Cx com 14 tiras", preco: 3, categoria: "Amendoim Japonês", imagem: "assets/images/obj-942.png", disponivel: true },
    { id: 19, nome: "Amend. Jap. Ceb. E Salsa. 24g", descricao: "Cartela com 5 unid Cx com 14 tiras", preco: 5.5, categoria: "Amendoim Japonês", imagem: "assets/images/obj-940.png", disponivel: true },
    { id: 20, nome: "Amend. Jap. Pimenta Mex. 24g", descricao: "Cartela com 5 unid Cx com 14 tiras", preco: 5.5, categoria: "Amendoim Japonês", imagem: "assets/images/obj-941.png", disponivel: true },
    { id: 21, nome: "Amend. Jap. Colorido. 24g", descricao: "Cartela com 5 unid Cx com 14 tiras", preco: 5.5, categoria: "Amendoim Japonês", imagem: "assets/images/obj-943.png", disponivel: true },
    { id: 22, nome: "Amend. Jap. 60g Und", descricao: "cx/30 und", preco: 2.85, categoria: "Amendoins", imagem: "assets/images/obj-954.png", disponivel: true },
    { id: 23, nome: "Amend. S/Pele 60g", descricao: "cx/30 und", preco: 2.85, categoria: "Amendoins", imagem: "assets/images/obj-955.png", disponivel: true },
    { id: 24, nome: "Pé de Moleque Pote 25 und", descricao: "cx/6 potes", preco: 40, categoria: "Amendoins", imagem: "assets/images/obj-956.png", disponivel: true },
    { id: 25, nome: "Caseirão Pote 25 und", descricao: "cx/6 potes", preco: 40, categoria: "Amendoins", imagem: "assets/images/obj-957.png", disponivel: true },
    { id: 26, nome: "Molecão Pote 25 und", descricao: "cx/6 potes", preco: 40, categoria: "Amendoins", imagem: "assets/images/obj-958.png", disponivel: true },
    { id: 27, nome: "Paçoca Rolha Cx. C/ 100", descricao: "", preco: 39, categoria: "Paçocas e Cocadas", imagem: "assets/images/obj-971.png", disponivel: true },
    { id: 28, nome: "Paçoca Rolha Pote C/ 50", descricao: "cx com 6", preco: 22.5, categoria: "Paçocas e Cocadas", imagem: "assets/images/obj-972.png", disponivel: true },
    { id: 29, nome: "Paçoca No Espeto c/ 35 und", descricao: "cx c/ 2", preco: 75, categoria: "Paçocas e Cocadas", imagem: "assets/images/obj-976.png", disponivel: true },
    { id: 30, nome: "Cocada Recheada Cremosa", descricao: "Display c/ 15 und. 42g cada", preco: 27, categoria: "Paçocas e Cocadas", imagem: "assets/images/obj-977.png", disponivel: true },
    { id: 31, nome: "Bala Café 500g", descricao: "Pacote. C/ 100 unid", preco: 16, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-985.png", disponivel: true },
    { id: 32, nome: "Bala Mel 500g", descricao: "Pacote. C/ 100 unid", preco: 16, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-987.png", disponivel: true },
    { id: 33, nome: "Bala Pipper Hortelão", descricao: "500g Pacote. C/ 100 unid", preco: 14.8, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-984.png", disponivel: true },
    { id: 34, nome: "Bala Sambol", descricao: "500g Pacote. C/ 100 unid", preco: 16, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-986.png", disponivel: true },
    { id: 35, nome: "Pirulito Drop Pop", descricao: "pct c/50 unid", preco: 9, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-989.png", disponivel: true },
    { id: 36, nome: "Pirulito Samito", descricao: "pct c/50 unid", preco: 9, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-991.png", disponivel: true },
    { id: 37, nome: "Pirulito Lampião", descricao: "pct c/50 unid", preco: 0, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-990.png", disponivel: true },
    { id: 38, nome: "Lampião Maracujá", descricao: "pct c/50 unid", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-990.png", disponivel: true },
    { id: 39, nome: "Pop Mix", descricao: "Pct c/50", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-995.png", disponivel: true },
    { id: 40, nome: "Pop Morango", descricao: "Pct c/50", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-996.png", disponivel: true },
    { id: 41, nome: "Pop Black", descricao: "Pct c/50", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-994.png", disponivel: true },
    { id: 42, nome: "Pop Cereja", descricao: "Pct c/50", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-993.png", disponivel: true },
    { id: 43, nome: "Pop Tutti", descricao: "Pct c/50", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-997.png", disponivel: true },
    { id: 44, nome: "Pop Energy", descricao: "Pct c/50", preco: 20.5, categoria: "Balas e Pirulitos", imagem: "assets/images/obj-998.png", disponivel: true },
    { id: 45, nome: "Barra de Cereal Trio Avelã Castanha e", descricao: "Chocolate Display c/12 unid", preco: 28, categoria: "Barras de Cereal", imagem: "assets/images/obj-1008.png", disponivel: true },
    { id: 46, nome: "Barra de Cereal Trio Banana Aveia e", descricao: "Mel Display c/12 unid", preco: 28, categoria: "Barras de Cereal", imagem: "assets/images/obj-1009.png", disponivel: true },
    { id: 47, nome: "Barra de Cereal Trio Brigadeiro", descricao: "Display c/12 unid", preco: 28, categoria: "Barras de Cereal", imagem: "assets/images/obj-1010.png", disponivel: true },
    { id: 48, nome: "Barra de Cereal Trio Zero Banana e", descricao: "Mel Display c/12 unid", preco: 32, categoria: "Barras de Cereal", imagem: "assets/images/obj-1013.png", disponivel: true },
    { id: 49, nome: "Barra de Cereal Trio Morango c/ Chocolate", descricao: "Display c/12 unid", preco: 28, categoria: "Barras de Cereal", imagem: "assets/images/obj-1012.png", disponivel: true },
    { id: 50, nome: "Barra de Cereal Trio Coco com", descricao: "Chocolate Display c/12 unid", preco: 28, categoria: "Barras de Cereal", imagem: "assets/images/obj-1011.png", disponivel: true },
    { id: 51, nome: "Barra de Cereal Zero açucar", descricao: "Display 12 und", preco: 28, categoria: "Barras de Cereal", imagem: "assets/images/obj-1024.png", disponivel: true },
    { id: 52, nome: "Barra de Cereal Amendoim", descricao: "Display 12 und", preco: 24, categoria: "Barras de Cereal", imagem: "assets/images/obj-1026.png", disponivel: true },
    { id: 53, nome: "Barra de Cereal Banana e Mel", descricao: "Display 12 und", preco: 24, categoria: "Barras de Cereal", imagem: "assets/images/obj-1027.png", disponivel: true },
    { id: 54, nome: "Barra de Cereal Bolo de Chocolate", descricao: "Display c/ 12 unid", preco: 24, categoria: "Barras de Cereal", imagem: "assets/images/obj-1025.png", disponivel: true },
    { id: 55, nome: "Barra de Cereal Frutas", descricao: "Display c/12 unid", preco: 24, categoria: "Barras de Cereal", imagem: "assets/images/obj-1030.png", disponivel: true },
    { id: 56, nome: "Barra de Cereal Morango e Chocolate", descricao: "Display c/12 unid", preco: 24, categoria: "Barras de Cereal", imagem: "assets/images/obj-1029.png", disponivel: true },
    { id: 57, nome: "Barra de Cereal Castanha com Chocolate", descricao: "Display c/12 unid", preco: 24, categoria: "Barras de Cereal", imagem: "assets/images/obj-1028.png", disponivel: true },
    { id: 58, nome: "Banana tradicional Zero Açucar", descricao: "Display 24 und", preco: 65, categoria: "Bananas e Frutas", imagem: "assets/images/obj-1047.png", disponivel: true },
    { id: 59, nome: "Banana com chocolate e Café", descricao: "Display 24 und", preco: 65, categoria: "Bananas e Frutas", imagem: "assets/images/obj-1046.png", disponivel: true },
    { id: 60, nome: "Banana Com chocolate", descricao: "Display 24 und", preco: 65, categoria: "Bananas e Frutas", imagem: "assets/images/obj-1045.png", disponivel: true },
    { id: 61, nome: "Banana com abacaxi", descricao: "Display 12 und", preco: 38, categoria: "Bananas e Frutas", imagem: "assets/images/obj-1049.png", disponivel: true },
    { id: 62, nome: "Banana com chia e linhaça", descricao: "Display 24 und", preco: 65, categoria: "Bananas e Frutas", imagem: "assets/images/obj-1048.png", disponivel: true },
    { id: 63, nome: "Bananikas tradicional, Goiabikas e", descricao: "Banana com chocolate Pacote C/50 Unid", preco: 43, categoria: "Bananas e Frutas", imagem: "assets/images/obj-1921.png", disponivel: true },
    { id: 64, nome: "Paçoca Diet c/ Aveia 480g", descricao: "", preco: 46, categoria: "Méis e Derivados", imagem: "assets/images/obj-1059.png", disponivel: true },
    { id: 65, nome: "Mel em Sache 1kg - 250 Unid", descricao: "", preco: 59.9, categoria: "Méis e Derivados", imagem: "assets/images/obj-1940.png", disponivel: true },
    { id: 66, nome: "Mel Orgânico", descricao: "Tamanhos: 200g ; 320g ; 500g", preco: 19.5, categoria: "Méis e Derivados", imagem: "assets/images/obj-1935.png", disponivel: true },
    { id: 67, nome: "Extrato de Própolis Marron", descricao: "", preco: 11, categoria: "Méis e Derivados", imagem: "assets/images/obj-1066.png", disponivel: true },
    { id: 68, nome: "Extrato de Própolis Verde", descricao: "", preco: 13, categoria: "Méis e Derivados", imagem: "assets/images/obj-1065.png", disponivel: true },
    { id: 69, nome: "Mel 100% Natural e Orgânico", descricao: "Bisnaga 270g", preco: 18.9, categoria: "Méis e Derivados", imagem: "assets/images/obj-1080.png", disponivel: true },
    { id: 70, nome: "Mel 100% Natural e Orgânico", descricao: "Bisnaga 470g", preco: 0, categoria: "Méis e Derivados", imagem: "assets/images/obj-1079.png", disponivel: true },
    { id: 71, nome: "Mel 100% Natural e Orgânico", descricao: "Bisnaga de vidro 720g", preco: 36.6, categoria: "Méis e Derivados", imagem: "assets/images/obj-1078.png", disponivel: true },
    { id: 72, nome: "Mel 100% Natural e Orgânico", descricao: "Sachê Pacote de 100g", preco: 10.49, categoria: "Méis e Derivados", imagem: "assets/images/obj-1077.png", disponivel: true },
    { id: 73, nome: "Mel 100% Natural e Orgânico", descricao: "Sachê Pacote de 200g", preco: 0, categoria: "Méis e Derivados", imagem: "assets/images/obj-1077.png", disponivel: true },
    { id: 74, nome: "Doce de Leite Tradicional Pote", descricao: "Vidro 410g cx c/24", preco: 26.2, categoria: "Doce de Leite", imagem: "assets/images/obj-1089.png", disponivel: true },
    { id: 75, nome: "Doce de Leite c/coco Pote", descricao: "Vidro 400g cx c/24", preco: 26.2, categoria: "Doce de Leite", imagem: "assets/images/obj-1090.png", disponivel: true },
    { id: 76, nome: "Doce de Leite c/ameixa Pote", descricao: "Vidro 410g cx c/24", preco: 26.2, categoria: "Doce de Leite", imagem: "assets/images/obj-1091.png", disponivel: true },
    { id: 77, nome: "Doce de Leite c/chocolate Pote", descricao: "Vidro 410g cx c/24", preco: 26.2, categoria: "Doce de Leite", imagem: "assets/images/obj-1092.png", disponivel: true },
    { id: 78, nome: "Doce de Leite cocada ao leite", descricao: "Vidro 400g cx c/24", preco: 26.2, categoria: "Doce de Leite", imagem: "assets/images/obj-1094.png", disponivel: true },
    { id: 79, nome: "Doce de Cajú em Calda Pote", descricao: "Vidro 700g cx c/06", preco: 25.99, categoria: "Doce de Leite", imagem: "assets/images/obj-1093.png", disponivel: true },
    { id: 80, nome: "Doce de Leite zero açucar", descricao: "215g cx c/24 unid", preco: 27.2, categoria: "Doce de Leite", imagem: "assets/images/obj-1111.png", disponivel: true },
    { id: 81, nome: "Doce de Leite zero lactose", descricao: "215g cx c/24 unid", preco: 20.9, categoria: "Doce de Leite", imagem: "assets/images/obj-1111.png", disponivel: true },
    { id: 82, nome: "Doce de Leite em tabletes zero açucar", descricao: "Display com 40 unidades de 23g", preco: 152, categoria: "Doce de Leite", imagem: "assets/images/obj-1112.png", disponivel: true },
    { id: 83, nome: "Creme de Avelã tradicional 140g e 350g", descricao: "", preco: 11.7, categoria: "Doce de Leite", imagem: "assets/images/obj-1113.png", disponivel: true },
    { id: 84, nome: "Creme de Avelã Crocante 140g", descricao: "", preco: 11.7, categoria: "Doce de Leite", imagem: "assets/images/obj-1114.png", disponivel: true },
    { id: 85, nome: "Creme de Avelã ao leite Divino Nut 140g", descricao: "", preco: 11.7, categoria: "Doce de Leite", imagem: "assets/images/obj-1115.png", disponivel: true },
    { id: 86, nome: "Doce Lili Jaca em Calda cx c/15", descricao: "", preco: 38.9, categoria: "Doce Lili", imagem: "assets/images/obj-1130.png", disponivel: true },
    { id: 87, nome: "Doce Lili Leite Massa", descricao: "", preco: 31.99, categoria: "Doce Lili", imagem: "assets/images/obj-1132.png", disponivel: true },
    { id: 88, nome: "Doce Lili Goiaba em calda", descricao: "", preco: 31.99, categoria: "Doce Lili", imagem: "assets/images/obj-1131.png", disponivel: true },
    { id: 89, nome: "Doce Lili Leite em Calda", descricao: "", preco: 0, categoria: "Doce Lili", imagem: "assets/images/obj-1133.png", disponivel: true },
    { id: 90, nome: "Doce Lili de Leite Com Ameixa", descricao: "", preco: 31.99, categoria: "Doce Lili", imagem: "assets/images/obj-1134.png", disponivel: true },
    { id: 91, nome: "Doce Lili de Leite Com Maracujá", descricao: "", preco: 31.99, categoria: "Doce Lili", imagem: "assets/images/obj-1135.png", disponivel: true },
    { id: 92, nome: "Doce Lili Banana em Calda", descricao: "", preco: 22.99, categoria: "Doce Lili", imagem: "assets/images/obj-1136.png", disponivel: true },
    { id: 93, nome: "Doce Lili Limão em Calda Cx/15", descricao: "", preco: 36.99, categoria: "Doce Lili", imagem: "assets/images/obj-1152.png", disponivel: true },
    { id: 94, nome: "Doce Lili Laranja em Calda Cx/15", descricao: "", preco: 22.99, categoria: "Doce Lili", imagem: "assets/images/obj-1149.png", disponivel: true },
    { id: 95, nome: "Doce Lili Mamão em Calda Cx/15", descricao: "", preco: 22.99, categoria: "Doce Lili", imagem: "assets/images/obj-1150.png", disponivel: true },
    { id: 96, nome: "Doce Lili Leite c/ Goiaba em Calda Cx/15", descricao: "", preco: 31.99, categoria: "Doce Lili", imagem: "assets/images/obj-1151.png", disponivel: true },
    { id: 97, nome: "Doce Lili Cajú em Barra c/castanha 500g", descricao: "", preco: 12, categoria: "Doce Lili", imagem: "assets/images/obj-1147.png", disponivel: true },
    { id: 98, nome: "Doce Lili, Goiaba c/Castanha em Barra 500g", descricao: "", preco: 12, categoria: "Doce Lili", imagem: "assets/images/obj-1148.png", disponivel: true },
    { id: 99, nome: "Cajumix 500ml", descricao: "Fardo c/6", preco: 40, categoria: "Bebidas", imagem: "assets/images/obj-1165.png", disponivel: true },
    { id: 100, nome: "Cajumix Fire 500ml", descricao: "Fardo c/6", preco: 42, categoria: "Bebidas", imagem: "assets/images/obj-1166.png", disponivel: true },
    { id: 101, nome: "Cajuina Brasucos 500ml", descricao: "Fardo c/12", preco: 82, categoria: "Bebidas", imagem: "assets/images/obj-1169.png", disponivel: true },
    { id: 102, nome: "Água Viena c/ gás 510ml", descricao: "Fardo c/12", preco: 22.5, categoria: "Bebidas", imagem: "assets/images/obj-1167.png", disponivel: true },
    { id: 103, nome: "Água Viena sem gás 510ml", descricao: "Fardo c/12", preco: 17.5, categoria: "Bebidas", imagem: "assets/images/obj-1168.png", disponivel: true },
    { id: 104, nome: "Sal Rosa do Himalaia", descricao: "cx c/12", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1187.png", disponivel: true },
    { id: 105, nome: "Caldo de Galinha sem glutamato de sódio", descricao: "pote 150g cx c/12", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1182.png", disponivel: true },
    { id: 106, nome: "Tempero Ana Maria, sem glutamato de sódio", descricao: "pote 100g cx c/12", preco: 6.49, categoria: "Temperos e Sal", imagem: "assets/images/obj-1183.png", disponivel: true },
    { id: 107, nome: "Tempero Páprica Picante, sem glutamato de sódio", descricao: "pote 100g cx c/12", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1184.png", disponivel: true },
    { id: 108, nome: "Caldo de Carne sem glutamato de sódio", descricao: "pote 150g cx c/12", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1185.png", disponivel: true },
    { id: 109, nome: "Tempero Famoso, Edu Guedes, sem glutamato de sódio", descricao: "pote 100g cx c/12", preco: 6.49, categoria: "Temperos e Sal", imagem: "assets/images/obj-1186.png", disponivel: true },
    { id: 110, nome: "Colorau, sem glutamato de sódio", descricao: "pote 100g cx c/12", preco: 0, categoria: "Temperos e Sal", imagem: "assets/images/obj-1181.png", disponivel: true },
    { id: 111, nome: "Castanha de Cajú", descricao: "todos sem glutamato de sódio", preco: 9.9, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 112, nome: "Castanha do Pará", descricao: "todos sem glutamato de sódio", preco: 0, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 113, nome: "Pimenta preta moída", descricao: "todos sem glutamato de sódio", preco: 8.99, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 114, nome: "Tempero Baiano", descricao: "todos sem glutamato de sódio", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 115, nome: "Alho Frito", descricao: "todos sem glutamato de sódio", preco: 5.99, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 116, nome: "Bicarbonato de sódio", descricao: "todos sem glutamato de sódio", preco: 0, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 117, nome: "Chimichurri sem pimenta", descricao: "todos sem glutamato de sódio", preco: 6.49, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 118, nome: "Chimichurri com pimenta", descricao: "todos sem glutamato de sódio", preco: 6.49, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 119, nome: "Lemon Pepper", descricao: "todos sem glutamato de sódio", preco: 6.49, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 120, nome: "Açafrão", descricao: "todos sem glutamato de sódio", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 121, nome: "Cominho", descricao: "todos sem glutamato de sódio", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 122, nome: "Páprica doce", descricao: "todos sem glutamato de sódio", preco: 4.99, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 123, nome: "Páprica Defumada", descricao: "todos sem glutamato de sódio", preco: 5.29, categoria: "Temperos e Sal", imagem: "assets/images/sem-imagem.svg", disponivel: true },
    { id: 124, nome: "Sal de Parrilla Ex. Sabor 330g", descricao: "Lemon Pepper Cx/12", preco: 13.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1207.png", disponivel: true },
    { id: 125, nome: "Sal de Parrilla Ex. Sabor 330g", descricao: "Pimenta Preta Cx/12", preco: 13.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1198.png", disponivel: true },
    { id: 126, nome: "Sal de Parrilla Ex. Sabor 330g", descricao: "Uruguaio Cx/12", preco: 13.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1200.png", disponivel: true },
    { id: 127, nome: "Sal de Parrilla Ex. Sabor 330g", descricao: "Chimichurri Cx/12", preco: 13.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1202.png", disponivel: true },
    { id: 128, nome: "Sal de Parrilla Ex. Sabor 330g", descricao: "Frango Cx/12", preco: 13.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-1204.png", disponivel: true },
    { id: 129, nome: "Acendedor de Carvão, display", descricao: "com 12 cx cada uma c/6", preco: 5.99, categoria: "Temperos e Sal", imagem: "assets/images/obj-2106.png", disponivel: true },
    { id: 130, nome: "Óleo de Coco Extra Virgem 200ml", descricao: "", preco: 22.9, categoria: "Temperos e Sal", imagem: "assets/images/obj-2110.png", disponivel: true },
    { id: 131, nome: "Pimenta Gourmet Carolina Reaper, 60ml", descricao: "a pimenta mais gostosa do mundo, Fardo c/ 12 Unid.", preco: 15.2, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1220.png", disponivel: true },
    { id: 132, nome: "Pimenta Gourmet ao leite de Coco", descricao: "150ml, Fardo c/ 12 Unid.", preco: 8.5, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1221.png", disponivel: true },
    { id: 133, nome: "Pimenta Gourmet ao molho de Pequi", descricao: "150ml, Fardo c/ 12 Unid.", preco: 8.5, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1222.png", disponivel: true },
    { id: 134, nome: "Pimenta Especial gota serena", descricao: "150ml Fardo c/ 12 Unid.", preco: 6.3, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1223.png", disponivel: true },
    { id: 135, nome: "Pimenta especial em conserva", descricao: "150ml, fardo c/ 12 Unid.", preco: 9.3, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1235.png", disponivel: true },
    { id: 136, nome: "Pimenta especial Larva de Vulcão", descricao: "100ml, Fardo c/12 Unid.", preco: 8.5, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1238.png", disponivel: true },
    { id: 137, nome: "Molho Gourmet para preparo de vários pratos", descricao: "300ml, fardo c/12 unid.", preco: 6.99, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1237.png", disponivel: true },
    { id: 138, nome: "Molho Gourmet para Carnes", descricao: "300ml, fardos c/12 Unid.", preco: 6.99, categoria: "Pimentas Gourmet", imagem: "assets/images/obj-1236.png", disponivel: true },
    { id: 139, nome: "Molho Cremoso Extra Forte", descricao: "Cremoso especial de Pimenta Brasileiríssimo", preco: 5.99, categoria: "Molhos", imagem: "assets/images/obj-2152.png", disponivel: true },
    { id: 140, nome: "Molho Cremoso Delícia Picante", descricao: "Cremoso especial de Pimenta Brasileiríssimo", preco: 5.99, categoria: "Molhos", imagem: "assets/images/obj-2155.png", disponivel: true },
    { id: 141, nome: "Molho Cremoso Ervas Finas", descricao: "Cremoso especial de Pimenta Brasileiríssimo", preco: 5.99, categoria: "Molhos", imagem: "assets/images/obj-2158.png", disponivel: true },
    { id: 142, nome: "Molho Pequi", descricao: "Cremoso especial de Pimenta Brasileiríssimo", preco: 5.99, categoria: "Molhos", imagem: "assets/images/obj-2164.png", disponivel: true },
    { id: 143, nome: "Molho Carolina Reaper", descricao: "Cremoso especial de Pimenta Brasileiríssimo", preco: 10.37, categoria: "Molhos", imagem: "assets/images/obj-2167.png", disponivel: true },
    { id: 144, nome: "Molho Pimenta Vermelha", descricao: "Cremoso especial de Pimenta Brasileiríssimo", preco: 3.99, categoria: "Molhos", imagem: "assets/images/obj-2170.png", disponivel: true },
    { id: 145, nome: "Calabresa com especiarias", descricao: "", preco: 5.99, categoria: "Molhos", imagem: "assets/images/obj-2209.png", disponivel: true },
    { id: 146, nome: "Barbecue Chipotle", descricao: "", preco: 5.99, categoria: "Molhos", imagem: "assets/images/obj-2212.png", disponivel: true },
    { id: 147, nome: "Molho Shoyo", descricao: "", preco: 3.99, categoria: "Molhos", imagem: "assets/images/obj-2206.png", disponivel: true },
    { id: 148, nome: "Molho Salada Tipo Italiano", descricao: "", preco: 0, categoria: "Molhos", imagem: "assets/images/obj-2194.png", disponivel: true },
    { id: 149, nome: "Molho Salada Limão", descricao: "", preco: 0, categoria: "Molhos", imagem: "assets/images/obj-2197.png", disponivel: true },
    { id: 150, nome: "Molho Salada Rose", descricao: "", preco: 7.88, categoria: "Molhos", imagem: "assets/images/obj-2200.png", disponivel: true },
    { id: 151, nome: "Poderoso Multi inseticida Aerosol (Mata Tudo)", descricao: "É indicado contra mosquitos, baratas, escorpiões, moscas, aranhas, formigas, pulgas e carrapatos. Desenvolvido em base aquosa utilizando a mais moderna tecnologia. Disponíveis: Citronela, Eucalipto, Mata Baratas, Mata escorpião.", preco: 12.49, categoria: "Lar e Odorizantes", imagem: "assets/images/obj-1292.png", disponivel: true },
    { id: 152, nome: "Gel inseticida para baratas", descricao: "Gel inseticida para o combate a baratas alemãs – baratinhas (Blatella germânica) e também elimina a barata de esgoto ou voadeira (Periplaneta americana). Utilize o BARAKELL em casa e apartamentos.", preco: 8.7, categoria: "Lar e Odorizantes", imagem: "assets/images/obj-2224.png", disponivel: true },
    { id: 153, nome: "Formikell", descricao: "Eficaz contra formigas doceiras que são grandes causadoras de doenças.", preco: 8.7, categoria: "Lar e Odorizantes", imagem: "assets/images/obj-2225.png", disponivel: true },
    { id: 154, nome: "Inseticida para moscas", descricao: "Inseticida com atrativo sexual, eficaz contra moscas. Aplicar filetes de 10cm de distância onde as moscas pousam.", preco: 8.7, categoria: "Lar e Odorizantes", imagem: "assets/images/obj-2227.png", disponivel: true },
    { id: 155, nome: "Odorizadores de Ambientes", descricao: "Desenvolvido e formulado com exclusivas fragrâncias para refrescar o seu ambiente, criando um ambiente suavemente perfumado. É recomendado o uso em locais como banheiros, quartos, salas e escritórios. Disponíveis: Aquamarine, Chá Branco, Flores Campestres, Lavanda, Talco Baby e Verbena!", preco: 12.47, categoria: "Lar e Odorizantes", imagem: "assets/images/obj-1286.png", disponivel: true },
    { id: 156, nome: "Poderoso Limpa Tudo", descricao: "Espuma poderosa desenvolvida para a limpeza automotiva e doméstica em locais como partes internas do veículo, sofás, cortinas, carpetes, tecidos em geral, computadores, fórmicas, vinil, plástico, borrachas, tênis, sapatos, sandálias, bolsas, mochilas e couro.", preco: 0, categoria: "Limpeza e Higiene", imagem: "assets/images/obj-1305.png", disponivel: true },
    { id: 157, nome: "Poderoso Brilha Inox", descricao: "Produto desenvolvido para uso diário na limpeza de superfícies e utensílios de inox, alumínio, peças esmaltadas e plásticos, formando uma camada de proteção contra oxidação facilitando a limpeza e a manutenção. Pode ser aplicado em: elevadores, geladeiras, fogões, bandejas, churrasqueiras, corrimões, mesas, etc.", preco: 19.9, categoria: "Limpeza e Higiene", imagem: "assets/images/obj-1306.png", disponivel: true },
    { id: 158, nome: "Poderoso Limpa Forno", descricao: "Facilita limpeza de fornos, assadores, coifas, grills, espetos, louças e demais utensílios de cozinha em forma de espuma. Não contém soda cáustica.", preco: 0, categoria: "Limpeza e Higiene", imagem: "assets/images/obj-1307.png", disponivel: true },
    { id: 159, nome: "Skin Espuma de Barbear", descricao: "SKIN – ESPUMA DE BARBEAR é uma espuma hidratante, com perfume neutro que prepara a sua pele, para um barbear suave com um deslizamento incrível.", preco: 0, categoria: "Limpeza e Higiene", imagem: "assets/images/obj-1308.png", disponivel: true },
    { id: 160, nome: "Perfume Pé Deo Pédico", descricao: "Usado para manter os pés secos e perfumados. Agite bem a embalagem, aplique uma quantidade uniforme do Perfume Pé da Sortie entre os dedos previamente secos duas vezes ao dia, de preferência após o banho. Aumente a proteção usando o produto no calçado.", preco: 0, categoria: "Limpeza e Higiene", imagem: "assets/images/obj-1309.png", disponivel: true },
    { id: 161, nome: "Shampoo e condicionar neutro", descricao: "Indicação: Indicado para banho e higiene de cães e gatos, oferecendo uma melhor escovação da pelagem.", preco: 16.5, categoria: "Pets", imagem: "assets/images/obj-2258.png", disponivel: true },
    { id: 162, nome: "Shampoo e condicionar filhotes", descricao: "Indicação: Indicado para banho e higiene de filhotes de cães e gatos.", preco: 16.5, categoria: "Pets", imagem: "assets/images/obj-2260.png", disponivel: true },
    { id: 163, nome: "Shampoo e condicionar clareador", descricao: "Indicação: Contém branqueador óptico que destaca as cores claras sem prejudicar as cores escuras de cães e gatos.", preco: 16.5, categoria: "Pets", imagem: "assets/images/obj-2259.png", disponivel: true },
    { id: 164, nome: "Shampoo e condicionar, Normal e 6 em 1", descricao: "O Shampoo 6 em 1 é indicado para: Tratamento e prevenção de parasitas como pulgas, carrapatos, sarnas e piolhos em cães, gatos e equinos.", preco: 0, categoria: "Pets", imagem: "assets/images/obj-2257.png", disponivel: true },
    { id: 165, nome: "Shampoo & Condicionador Clorexidina 5 em 1", descricao: "Indicação de uso: Carrapato, Piolho, Pulga", preco: 0, categoria: "Pets", imagem: "assets/images/obj-2261.png", disponivel: true },
    { id: 166, nome: "Afasta Pet", descricao: "É um educador de cães e gatos desenvolvido para condicionar seu animal a manter distância dos locais, ambientes e objetos desejados. Pode ser aplicado com segurança em áreas internas e externas sem causar danos ao homem e aos animais.", preco: 20.39, categoria: "Controle de Pragas", imagem: "assets/images/obj-1339.png", disponivel: true },
    { id: 167, nome: "Afasta Pet Pipi Não Pode", descricao: "É indicado como educador de cães e gatos desenvolvido para condicionar seu animal a manter distância dos locais, ambientes e objetos desejados.", preco: 11.19, categoria: "Controle de Pragas", imagem: "assets/images/obj-1336.png", disponivel: true },
    { id: 168, nome: "Afasta Pet Pipi Pode", descricao: "É indicado como auxiliar no adestramento sanitário de cães/gatos, com consequente proteção de tapetes, estofados, canteiros e outros lugares indevidos visados pelos animais para micção.", preco: 10.39, categoria: "Controle de Pragas", imagem: "assets/images/obj-1337.png", disponivel: true },
    { id: 169, nome: "Afasta Pet Educador de Mordida", descricao: "É indicado para cães e gatos. Ajuda a proteger objetos e móveis que os animais possam lamber, mastigar ou morder destrutivamente como sapatos, móveis, tapetes, cortinas, bandagens, etc.", preco: 8.79, categoria: "Controle de Pragas", imagem: "assets/images/obj-1335.png", disponivel: true },
    { id: 170, nome: "Cupinicida Zodrin", descricao: "Eficaz contra cupins, baratas e formigas. Efetuar a aplicação por pulverização do cupinicida zodrin pronto para uso em residências, edifícios, industrias, galpões, escritórios e dependências comerciais onde os insetos normalmente são encontrados.", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1333.png", disponivel: true },
    { id: 171, nome: "Alpha Ciper - Ovinos, cães, aves, bovinos, ambientes, instalações", descricao: "e equipamentos. Auxilia no combate de carrapatos, pulgas, piolhos, moscas, sarnas e bernes.", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1354.png", disponivel: true },
    { id: 172, nome: "Kellmat Sementes de Cereais", descricao: "É indicado para o combate a ratos, ratazanas e camundongos em áreas internas e externas.", preco: 42, categoria: "Controle de Pragas", imagem: "assets/images/obj-1351.png", disponivel: true },
    { id: 173, nome: "Kellmat Raticida Granulado", descricao: "Indicado para o combate a ratos, ratazanas e camundongo em áreas internas e externas.", preco: 1.99, categoria: "Controle de Pragas", imagem: "assets/images/obj-1349.png", disponivel: true },
    { id: 174, nome: "Poderoso Cola Mosca", descricao: "Cartela cola mosca é uma armadilha não tóxica indicada para exterminar moscas, em locais onde venenos podem ser perigosos, como cozinhas, depósitos de alimentos, hospitais, escolas, indústrias, restaurantes, próximo a currasqueiras, plantações etc. Kellmat Cola Rato. Examinar a área e identificar os locais de passagem do roedor. Abrir lentamente. Colocar na passagem do roedor como rodapés e cantos de parede. Se preferir, fixar o Kellmat ratoeira adesiva no local escolhido. Para melhores resultados, colocar um atrativo como isca no centro da armadilha. Verificar diariamente se não houver captura após 2 dias, mudar a armadilha de lugar.", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1352.png", disponivel: true },
    { id: 175, nome: "Poderoso Pronto Uso", descricao: "Eficaz no combate a cupins, baratas e formigas. Efetuar a aplicação por pulverização do poderoso pronto para uso em residências, edifícios industriais, galpões, escritórios e dependências comerciais onde os insetos normalmente são encontrados.", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1370.png", disponivel: true },
    { id: 176, nome: "Poderoso Mosquicida Granulado", descricao: "Inseticida com atrativo sexual, eficaz contra moscas.", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1369.png", disponivel: true },
    { id: 177, nome: "Kelldrin SC25", descricao: "Indicação de uso: Aranha, Barata, Carrapato, Cupim, Escorpião, Formiga, Lagartas, Pulga, Pulgão, Traça", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1365.png", disponivel: true },
    { id: 178, nome: "Poderoso VET 30ml", descricao: "Indicado para cães e gatos, adultos e filhotes (a partir de 15 dias de vida). Tratamento e controle de infestações por pulgas, piolhos, carrapatos e sarna sarcóptica. O inseticida é indicado também para o controle de cupins, formigas, baratas e escorpiões no ambiente. (Fipronil 2,5% e Piriproxifen 2,5%)", preco: 12, categoria: "Controle de Pragas", imagem: "assets/images/obj-1368.png", disponivel: true },
    { id: 179, nome: "Kellthine Mata Cupim", descricao: "Combate de cupins em peças de madeira.", preco: 0, categoria: "Controle de Pragas", imagem: "assets/images/obj-1366.png", disponivel: true }
];

/* --------------------------------------------------------------------------
   CATEGORIAS DO CATÁLOGO
   --------------------------------------------------------------------------
   - A categoria "Todos" é especial: mostra todos os produtos.
   - Os botões de categoria são criados automaticamente a partir desta lista.
   - Para criar uma categoria nova: adicione o nome aqui E use o mesmo nome
     no campo "categoria" dos produtos acima.
   ========================================================================== */

const categorias = [
    "Todos",
    "Doces Amor de Minas",
    "Bombons e Chocolates",
    "Doces em Pote",
    "Amendoim Japonês",
    "Amendoins",
    "Paçocas e Cocadas",
    "Balas e Pirulitos",
    "Barras de Cereal",
    "Bananas e Frutas",
    "Méis e Derivados",
    "Doce de Leite",
    "Doce Lili",
    "Bebidas",
    "Temperos e Sal",
    "Pimentas Gourmet",
    "Molhos",
    "Lar e Odorizantes",
    "Limpeza e Higiene",
    "Pets",
    "Controle de Pragas"
];

/* --------------------------------------------------------------------------
   VARIÁVEIS DE ESTADO DO SITE
   --------------------------------------------------------------------------
   Guardam, durante o uso, as informações que mudam:
     - carrinho      : lista com os produtos escolhidos
                       (cada item: { id, quantidade, observacao })
     - filtroCategoria: categoria selecionada (começa em "Todos")
     - termoBusca    : texto digitado na busca (não usado, a leitura é direta)
     - produtoModalAtual: produto aberto no modal de detalhes
     - etapaAtual    : etapa do carrinho em que o cliente está (1 a 4)
   ========================================================================== */

let carrinho = [];
let filtroCategoria = "Todos";
let termoBusca = "";
let produtoModalAtual = null;
let etapaAtual = 1;

// Chave usada no localStorage. Cada empresa salva o carrinho de forma separada.
// O sufixo _v2 descarta carrinhos salvos antes da migração do catálogo, quando
// os ids 1-20 apontavam para produtos antigos que já não existem mais.
const CHAVE_LOCALSTORAGE = "pedido_" + (CONFIG.nomeEmpresa || "empresa") + "_v2";

/* ==========================================================================
   ATALHO PARA PEGAR ELEMENTOS DA PÁGINA
   --------------------------------------------------------------------------
   el("carrinho") é o mesmo que document.getElementById("carrinho").
   Só abrevia para o código ficar menor e mais limpo.
   ========================================================================== */

function el(id) {
    return document.getElementById(id);
}

/* ==========================================================================
   ÍCONES (SVG inline — mesmos desenhos usados no HTML)
   --------------------------------------------------------------------------
   São strings de SVG para o JavaScript conseguir inserir ícones dentro dos
   HTMLs que ele mesmo monta (cards, carrinho, avisos etc.).
   ========================================================================== */

function icone(caminhos, tamanho, preenchido) {
    const t = tamanho || 18;
    return (
        '<svg class="ic" width="' + t + '" height="' + t + '" viewBox="0 0 24 24" ' +
        'fill="' + (preenchido ? "currentColor" : "none") + '" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        caminhos +
        "</svg>"
    );
}

const ICONES = {
    carrinho: '<path d="M2.5 3.5h2.4l2.5 11.3A2 2 0 0 0 9.3 16.3H18a2 2 0 0 0 2-1.6l1.5-7.8H6.1"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/>',
    buscaVazia: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.2-4.2M9 9l4 4M13 9l-4 4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    alerta: '<path d="M10.6 4.1 2.9 17.4A1.7 1.7 0 0 0 4.4 20h15.2a1.7 1.7 0 0 0 1.5-2.6L13.4 4.1a1.7 1.7 0 0 0-2.8 0Z"/><path d="M12 9.5v4.2M12 16.8h.01"/>',
    mais: '<path d="M12 5.5v13M5.5 12h13"/>',
    caminhao: '<path d="M14.5 17.5V6.8a1.3 1.3 0 0 0-1.3-1.3H3.3a1.3 1.3 0 0 0-1.3 1.3v9.4a1.3 1.3 0 0 0 1.3 1.3h1"/><path d="M14.5 9.3h3.4l3.1 3.4v3.5a1.3 1.3 0 0 1-1.3 1.3h-1"/><circle cx="6.6" cy="17.9" r="2.1"/><circle cx="17.4" cy="17.9" r="2.1"/><path d="M8.7 17.9h6.6"/>',
    loja: '<path d="M4.5 10.5V19a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 19v-8.5"/><path d="M2.8 7.4 4.5 4a1.5 1.5 0 0 1 1.4-.9h12.2a1.5 1.5 0 0 1 1.4.9l1.7 3.4"/><path d="M2.8 7.4a2.4 2.4 0 0 0 4.7 0 2.4 2.4 0 0 0 4.7 0 2.4 2.4 0 0 0 4.7 0 2.4 2.4 0 0 0 4.7 0"/><path d="M9.5 20.5v-5h5v5"/>',
    zap: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5Z"/>'
};

/* ==========================================================================
   FORMATAR VALOR EM REAIS
   --------------------------------------------------------------------------
   Converte 6.5 em "R$ 6,50". Usa o formato brasileiro de moeda.
   ========================================================================== */

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

/* --------------------------------------------------------------------------
   Preços vindos da "lista de preços.PDF". Produtos com preco > 0 mostram o
   valor em reais; os que ainda não têm preço cadastrado (preco: 0) exibem
   "A combinar" e são combinados direto no WhatsApp.
   ========================================================================== */

function textoValor(valor) {
    return valor > 0 ? formatarMoeda(valor) : "A combinar";
}

/* ==========================================================================
   ENCONTRAR UM PRODUTO PELO ID
   --------------------------------------------------------------------------
   Varre o array "produtos" e devolve o produto que tem o id indicado.
   É usado para consultar preço, nome e imagem de um produto do carrinho.
   ========================================================================== */

function buscarProduto(id) {
    return produtos.find(function (produto) {
        return produto.id === id;
    });
}

/* ==========================================================================
   INICIAR O SITE
   --------------------------------------------------------------------------
   Executa uma vez, quando a página termina de carregar (DOMContentLoaded).
   Liga todas as partes do site.
   ========================================================================== */

function iniciar() {
    preencherDadosDaEmpresa(); // coloca nome, cidade, WhatsApp, etc. na página
    renderizarCategorias();    // desenha os botões de categoria
    carregarCarrinho();        // lê o pedido salvo no navegador (se houver)
    atualizarCarrinho();       // mostra o carrinho e o contador com os itens
    renderizarProdutos();      // desenha os cards de produtos
    configurarEventos();       // liga todos os cliques e ações da página
    configurarRevelacoes();    // anima os blocos ao entrar na tela
    configurarRolagemHeader(); // sombra no cabeçalho ao rolar a página
    el("anoAtual").textContent = String(new Date().getFullYear()); // ano do rodapé
}

/* --------------------------------------------------------------------------
   CORTINA DE CARREGAMENTO
   --------------------------------------------------------------------------
   A cortina fica na tela até a página (e as imagens) terminarem de carregar.
   Depois ela "abre" para os lados e some. Dois seguranças:
     - "load": disparado quando tudo terminou de baixar.
     - timeout: esconde mesmo se alguma imagem demorar ou falhar.
   ========================================================================== */

let cortinaEscondida = false;

function esconderCortina() {
    const cortina = el("cortinaCarregamento");
    if (!cortina || cortinaEscondida) {
        return;
    }
    cortinaEscondida = true;
    cortina.classList.add("saindo");          // abre as duas metades
    setTimeout(function () {
        cortina.hidden = true;                // remove do fluxo depois da animação
    }, 900);
}

function configurarCortina() {
    if (document.readyState === "complete") {
        // página já terminou de carregar antes do script rodar
        setTimeout(esconderCortina, 350);
    } else {
        window.addEventListener("load", function () {
            setTimeout(esconderCortina, 350);
        });
    }
    // Segurança: nunca deixa a cortina presa na tela
    setTimeout(esconderCortina, 5000);
}

// Ligado já na leitura do arquivo (o script fica no fim do body), para que a
// cortina seja removida mesmo que algo dê errado dentro de iniciar().
configurarCortina();

/* --------------------------------------------------------------------------
   ANIMAÇÃO DE ENTRADA (revelar ao rolar)
   --------------------------------------------------------------------------
   Os blocos com a classe "revelar" sobem suavemente quando entram na tela.
   ========================================================================== */

function configurarRevelacoes() {
    const elementos = document.querySelectorAll(".revelar");

    if (!("IntersectionObserver" in window)) {
        elementos.forEach(function (item) {
            item.classList.add("visivel");
        });
        return;
    }

    const observador = new IntersectionObserver(
        function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach(function (item) {
        observador.observe(item);
    });
}

/* --------------------------------------------------------------------------
   CABEÇALHO AO ROLAR
   --------------------------------------------------------------------------
   Ganha uma sombra suave quando a página sai do topo, dando sensação de
   profundidade sem mudar o layout.
   ========================================================================== */

function configurarRolagemHeader() {
    const header = el("header");
    if (!header) {
        return;
    }

    let agendado = false;
    const atualizar = function () {
        header.classList.toggle("rolado", window.scrollY > 12);
        agendado = false;
    };

    window.addEventListener(
        "scroll",
        function () {
            if (!agendado) {
                agendado = true;
                window.requestAnimationFrame(atualizar);
            }
        },
        { passive: true }
    );

    atualizar();
}

/* --------------------------------------------------------------------------
   PREENCHER OS TEXTOS DA PÁGINA COM O CONFIG
   --------------------------------------------------------------------------
   Pega os dados do CONFIG (nome, cidade, WhatsApp...) e escreve nos lugares
   certos do HTML. Assim o dono só precisa mudar o CONFIG, não o HTML.
   ========================================================================== */

function preencherDadosDaEmpresa() {
    // Título da aba do navegador
    document.title = CONFIG.nomeEmpresa + " | Doces, paçocas e pipocas";

    // Nome do logo e informações do topo
    el("logoNome").textContent = "ÁGUIA";
    el("horarioTexto").textContent = CONFIG.horario;
    el("cidadeTexto").textContent = CONFIG.cidade;
    el("estadoTexto").textContent = CONFIG.estado;

    // Selo acima do título do topo (segmento da empresa)
    if (el("heroSegmento")) {
        el("heroSegmento").textContent = CONFIG.segmento || "Catálogo online";
    }

    // Seção de contato
    el("contatoWhatsText").textContent = CONFIG.whatsappFornecedor;
    el("contatoInstaText").textContent = "@" + CONFIG.instagram.split("/").pop();
    el("contatoEnderecoText").textContent = CONFIG.endereco;
    el("contatoHorarioText").textContent = CONFIG.horario;

    // Links que abrem o WhatsApp e o Instagram em outra aba
    const linkWhats = urlWhatsApp();
    const linkInsta = CONFIG.instagram;

    el("contatoWhatsLink").setAttribute("href", linkWhats);
    el("contatoWhatsLink").setAttribute("target", "_blank");
    el("contatoWhatsLink").setAttribute("rel", "noopener");

    el("contatoInstaLink").setAttribute("href", linkInsta);
    el("footerWhatsLink").setAttribute("href", linkWhats);
    el("footerWhatsLink").setAttribute("target", "_blank");
    el("footerWhatsLink").setAttribute("rel", "noopener");
    el("footerInstaLink").setAttribute("href", linkInsta);

    // Botão "Falar conosco no WhatsApp" abre o WhatsApp com uma saudação
    el("botaoFalarWhats").addEventListener("click", function () {
        abrirWhatsApp("Olá! Gostaria de falar com a Distribuidora Águia sobre pedidos.");
    });
}

/* ==========================================================================
   DESENHAR OS BOTÕES DE CATEGORIA
   --------------------------------------------------------------------------
   Cada nome da lista "categorias" vira um botão. Clicar em um botão muda o
   "filtroCategoria" e redesenha os produtos (renderizarProdutos).
   ========================================================================== */

function renderizarCategorias() {
    const lista = el("categoriasLista");
    const rolagemAnterior = lista.scrollLeft; // guarda a posição horizontal
    lista.innerHTML = ""; // limpa os botões antigos antes de criar novos

    categorias.forEach(function (categoria) {
        // Cria o botão
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "categoria-chip" + (categoria === filtroCategoria ? " ativo" : "");
        botao.textContent = categoria;
        botao.setAttribute("aria-pressed", categoria === filtroCategoria);

        // Ao clicar: guarda a categoria escolhida e redesenha produtos e botões
        botao.addEventListener("click", function () {
            filtroCategoria = categoria;
            renderizarCategorias();
            renderizarProdutos();
        });

        lista.appendChild(botao); // coloca o botão na tela
    });

    // Faixa de filtros em rolagem horizontal (celular/tablet):
    // mantém a posição atual e depois centraliza o filtro ativo na tela.
    if (lista.scrollWidth > lista.clientWidth) {
        lista.scrollLeft = rolagemAnterior;
        const ativo = lista.querySelector(".categoria-chip.ativo");
        if (ativo) {
            const centro = ativo.offsetLeft - lista.clientWidth / 2 + ativo.offsetWidth / 2;
            lista.scrollTo({ left: Math.max(0, centro), behavior: "smooth" });
        }
    }
}

/* ==========================================================================
   DESENHAR OS PRODUTOS
   --------------------------------------------------------------------------
   Filtra a lista de produtos por:
     - categoria escolhida (filtroCategoria)
     - texto da busca (termo digitado em "buscaProdutos")
   E desenha um "card" (cartão) para cada produto encontrado.
   Os dois filtros funcionam JUNTOS.
   ========================================================================== */

function renderizarProdutos() {
    const grid = el("produtosGrid");
    const busca = el("buscaProdutos").value.trim().toLowerCase(); // texto da busca

    // Filtra: mantém só produtos da categoria ESCOLHIDA e que "casam" com a busca
    const listaFiltrada = produtos.filter(function (produto) {
        const temCategoria = filtroCategoria === "Todos" || produto.categoria === filtroCategoria;
        const temBusca =
            busca === "" ||
            produto.nome.toLowerCase().includes(busca) ||
            produto.descricao.toLowerCase().includes(busca);
        return temCategoria && temBusca;
    });

    grid.innerHTML = ""; // limpa os cards anteriores

    // Contagem de resultados (aparece entre os filtros e a grade)
    const contagem = el("produtosContagem");
    if (contagem) {
        contagem.innerHTML =
            "<strong>" + listaFiltrada.length + "</strong> " +
            (listaFiltrada.length === 1 ? "produto" : "produtos") +
            (filtroCategoria !== "Todos"
                ? " em <strong>" + filtroCategoria + "</strong>"
                : " no catálogo");
    }

    // Se não veio nenhum produto, mostra um aviso
    if (listaFiltrada.length === 0) {
        grid.innerHTML =
            '<div class="produtos-sem-resultado">' +
                icone(ICONES.buscaVazia, 42) +
                "<p>Nenhum produto encontrado.</p>" +
                "<p>Tente outra busca ou categoria.</p>" +
            "</div>";
        return;
    }

    // Desenha um card para cada produto filtrado
    listaFiltrada.forEach(function (produto, indice) {
        const card = document.createElement("article");
        card.className = "produto-card" + (produto.disponivel ? "" : " indisponivel");
        card.dataset.id = produto.id; // guarda o id no card (usado nos cliques)
        card.style.animationDelay = Math.min(indice * 0.04, 0.4) + "s"; // animação em cascata

        // Monta o HTML interno do card (imagem + tag + nome + descrição + preço + botão)
        card.innerHTML =
            '<div class="produto-imagem">' +
                '<img src="' + produto.imagem + '" alt="' + produto.nome +
                '" loading="lazy">' + /* loading=lazy: imagem carrega só quando aparece na tela */
                '<span class="produto-tag">' + produto.categoria + "</span>" +
                (produto.disponivel ? "" : '<div class="aviso-indisponivel">Indisponível</div>') +
            "</div>" +
            '<div class="produto-info">' +
                "<h3>" + produto.nome + "</h3>" +
                "<p>" + produto.descricao + "</p>" +
                '<div class="produto-rodape">' +
                    '<span class="preco">' + textoValor(produto.preco) + "</span>" +
                    '<button type="button" class="btn-adicionar" ' +
                        (produto.disponivel ? "" : "disabled") + ">" +
                        (produto.disponivel
                            ? icone(ICONES.mais, 15) + "Adicionar"
                            : "Indisponível") +
                    "</button>" +
                "</div>";

        grid.appendChild(card); // coloca o card na grade
    });
}

/* ==========================================================================
   MODAL DE DETALHES DO PRODUTO
   --------------------------------------------------------------------------
   O modal é a janelinha que abre ao clicar no nome/foto do produto.
   Ele mostra a descrição, o preço, a quantidade e um campo de observação.
   ========================================================================== */

function abrirModalProduto(id) {
    const produto = buscarProduto(id);
    if (!produto || !produto.disponivel) {
        return; // não abre modal de produto indisponível
    }

    // Guarda qual produto está aberto no modal
    produtoModalAtual = produto;

    // Preenche os campos do modal com os dados do produto
    el("modalImagem").src = produto.imagem;
    el("modalImagem").alt = produto.nome;
    el("modalCategoria").textContent = produto.categoria;
    el("modalNome").textContent = produto.nome;
    el("modalDescricao").textContent = produto.descricao;
    el("modalPreco").textContent = textoValor(produto.preco);
    el("modalQtd").textContent = "1";           // quantidade começa em 1
    el("modalObservacao").value = "";             // observação começa vazia

    // Mostra o modal
    el("modalProduto").hidden = false;
    document.body.style.overflow = "hidden";      // trava a rolagem atrás do modal
    el("fecharModalProdutoBtn").focus();          // acessibilidade: foco no X
}

function fecharModalProduto() {
    el("modalProduto").hidden = true;             // esconde o modal
    produtoModalAtual = null;
    document.body.style.overflow = "";            // libera a rolagem de novo
}

function alterarQuantidadeModal(delta) {
    // Aumenta ou diminui a quantidade do modal, mas nunca abaixo de 1
    let atual = parseInt(el("modalQtd").textContent, 10) || 1;
    atual = Math.max(1, atual + delta);
    el("modalQtd").textContent = String(atual);
}

/* ==========================================================================
   CARRINHO — ADICIONAR / MUDAR / REMOVER
   --------------------------------------------------------------------------
   O carrinho é um array. Cada item do array é:
       { id, quantidade, observacao }
   ========================================================================== */

function adicionarAoCarrinho(id, quantidade, observacao) {
    // Procura se o produto já está no carrinho
    const itemExistente = carrinho.find(function (item) {
        return item.id === id;
    });

    quantidade = quantidade || 1;
    observacao = observacao ? observacao.trim() : "";

    if (itemExistente) {
        // Já existe: só soma a quantidade (e atualiza a observação, se vier)
        itemExistente.quantidade += quantidade;
        if (observacao) {
            itemExistente.observacao = observacao;
        }
    } else {
        // Não existe: adiciona como item novo
        carrinho.push({
            id: id,
            quantidade: quantidade,
            observacao: observacao
        });
    }

    salvarCarrinho();      // grava no navegador
    atualizarCarrinho();   // redesenha o painel e o contador
    mostrarToast("Produto adicionado ao pedido"); // feedback visual
    animarContador();      // anima o número do carrinho no topo
}

function alterarQuantidade(id, delta) {
    // +1 ou -1 na quantidade de um item do carrinho
    const item = carrinho.find(function (i) {
        return i.id === id;
    });
    if (!item) {
        return;
    }

    item.quantidade += delta;

    // Se chegar a zero, o item é removido sozinho
    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }

    salvarCarrinho();
    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    // Remove o item que tem o id informado
    carrinho = carrinho.filter(function (item) {
        return item.id !== id;
    });
    salvarCarrinho();
    atualizarCarrinho();
}

function limparCarrinho() {
    // Esvazia todo o pedido
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    mostrarToast("Pedido limpo");
}

function quantidadeTotalNoCarrinho() {
    // Soma as quantidades de todos os itens (ex.: 2 paçocas + 1 pipoca = 3)
    return carrinho.reduce(function (total, item) {
        return total + item.quantidade;
    }, 0);
}

/* --------------------------------------------------------------------------
   CÁLCULOS DO PEDIDO
   ========================================================================== */

function calcularSubtotal() {
    // Soma o preço de cada item multiplicado pela quantidade
    return carrinho.reduce(function (total, item) {
        const produto = buscarProduto(item.id);
        return total + produto.preco * item.quantidade;
    }, 0);
}

function obterFormaRecebimento() {
    // Lê qual "radio" (Entrega ou Retirada) está marcado na etapa 2
    if (el("optEntrega").checked) {
        return "entrega";
    }
    if (el("optRetirada").checked) {
        return "retirada";
    }
    return ""; // nada marcado ainda
}

function calcularTaxa() {
    // Só existe taxa quando o cliente escolhe "Entrega"
    if (obterFormaRecebimento() !== "entrega") {
        return 0;
    }

    // Se houver taxas por bairro configuradas, usa o valor do bairro escolhido
    const bairro = el("bairroEntrega").value;
    if (Object.prototype.hasOwnProperty.call(taxasEntrega, bairro)) {
        return taxasEntrega[bairro];
    }

    // Caso contrário, usa a taxa fixa de taxaEntrega
    return taxaEntrega;
}

function calcularTotal() {
    // Total = subtotal dos produtos + taxa de entrega
    return calcularSubtotal() + calcularTaxa();
}

/* ==========================================================================
   ATUALIZAR O CARRINHO NA TELA
   --------------------------------------------------------------------------
   Redesenha:
     - o contador do carrinho no topo
     - a lista de itens dentro do painel
     - o estado "vazio" ou o resumo com os valores
     - a barra de total do rodapé
   Esta função é chamada após QUALQUER mudança no carrinho.
   ========================================================================== */

function atualizarCarrinho() {
    const contador = el("carrinhoContador");
    const quantidade = quantidadeTotalNoCarrinho();

    // Contador do topo: mostra só quando há itens
    if (quantidade > 0) {
        contador.hidden = false;
        contador.textContent = String(quantidade);
    } else {
        contador.hidden = true;
    }

    // Desenha a lista de itens dentro do painel
    const itens = el("carrinhoItens");
    itens.innerHTML = "";

    carrinho.forEach(function (item) {
        const produto = buscarProduto(item.id);
        const qtde = item.quantidade;

        // Cada item vira uma linha com foto, nome, observação, preço e botões
        const linha = document.createElement("div");
        linha.className = "carrinho-item";
        linha.dataset.id = produto.id;

        linha.innerHTML =
            '<img src="' + produto.imagem + '" alt="' + produto.nome + '" loading="lazy">' +
            '<div class="item-info">' +
                '<p class="item-nome">' + produto.nome + "</p>" +
                (item.observacao
                    ? '<p class="item-obs">Obs: ' + item.observacao + "</p>"
                    : "") +
                '<p class="item-preco">' +
                    (produto.preco > 0
                        ? formatarMoeda(produto.preco) + " • " + qtde + "x = " +
                          formatarMoeda(produto.preco * qtde)
                        : qtde + "x • A combinar") +
                "</p>" +
                '<div class="item-acoes">' +
                    '<button type="button" class="qt-btn" data-acao="menos" aria-label="Diminuir quantidade">−</button>' +
                    "<span>" + qtde + "</span>" +
                    '<button type="button" class="qt-btn" data-acao="mais" aria-label="Aumentar quantidade">+</button>' +
                    '<button type="button" class="remover" data-acao="remover">Remover</button>' +
                "</div>" +
            "</div>";

        itens.appendChild(linha);
    });

    // Troca entre o aviso "vazio" e o resumo de valores, na etapa 1
    const vazio = el("carrinhoVazio");
    const resumo = el("carrinhoResumo");
    const btnLimpar = el("limparPedidoBtn");
    const ehVazio = carrinho.length === 0;

    vazio.hidden = !ehVazio;
    resumo.hidden = ehVazio;
    btnLimpar.hidden = ehVazio;

    // Rodapé do carrinho (total + botões) só aparece quando há itens
    el("carrinhoFooter").style.display = ehVazio ? "none" : "flex";

    // Calcula os valores
    const subtotal = calcularSubtotal();
    const taxa = calcularTaxa();
    const total = calcularTotal();

    // Resumo da etapa 1 (Produtos)
    el("subtotalTxt").textContent = textoValor(subtotal);
    el("taxaTxt").textContent = formatarMoeda(taxa);
    el("totalTxt").textContent = textoValor(total);
    el("taxaLinha").hidden = taxa === 0; // só mostra a linha de taxa se houver taxa

    // Resumo da etapa 2 (Entrega)
    el("entSubtotalTxt").textContent = textoValor(subtotal);
    el("entTaxaTxt").textContent = formatarMoeda(taxa);
    el("entTotalTxt").textContent = textoValor(total);
    el("entTaxaLinha").hidden = taxa === 0;
    // Mostra o resumo da etapa 2 quando o cliente já escolheu uma forma
    // de recebimento OU quando existe taxa para ser exibida
    el("resumoEntrega").hidden = taxa === 0 && obterFormaRecebimento() === "";

    // Total fixo no rodapé do painel (visível em todas as etapas)
    el("totalBarTxt").textContent = textoValor(total);
}

/* --------------------------------------------------------------------------
   ABRIR E FECHAR O PAINEL DO CARRINHO
   --------------------------------------------------------------------------
   O painel é um "menu lateral" que desliza pela direita. O "overlay" é a
   camada escura que fica atrás dele e cobre o restante do site.

   ATENÇÃO (importante!): quando o carrinho fecha, o overlay precisa ser
   realmente ESCONDIDO (hidden = true). Se ele ficar na tela com transparência,
   continua bloqueando cliques e hover no site todo — foi isso que causou o
   "travamento" relatado. Por isso aqui, depois da animação, o overlay é
   removido de vez. Isso é resolvido por: el("overlay").hidden = true.
   ========================================================================== */

function abrirCarrinho() {
    atualizarCarrinho();
    irParaEtapa(1);              // sempre abre mostrando a etapa 1
    el("carrinho").classList.add("aberto");           // desliza o painel para dentro
    el("carrinho").setAttribute("aria-hidden", "false");

    // Mostra o overlay e, no próximo quadro, aplica a opacidade (animação suave)
    el("overlay").hidden = false;
    requestAnimationFrame(function () {
        el("overlay").classList.add("visivel");
    });

    document.body.style.overflow = "hidden"; // trava a rolagem da página atrás
}

function fecharCarrinho() {
    el("carrinho").classList.remove("aberto");        // desliza o painel para fora
    el("carrinho").setAttribute("aria-hidden", "true");

    const overlay = el("overlay");
    overlay.classList.remove("visivel");              // some a opacidade

    // Depois que a animação terminar (300ms), esconde o overlay POR COMPLETO.
    // Se o carrinho for aberto de novo nesse meio tempo, não esconde (proteção).
    setTimeout(function () {
        if (!el("carrinho").classList.contains("aberto")) {
            overlay.hidden = true; /* <<< ESSA LINHA ARRUMOU O TRAVAMENTO */
        }
    }, 300);

    document.body.style.overflow = "";                // libera a rolagem da página
}

/* --------------------------------------------------------------------------
   NAVEGAR ENTRE AS ETAPAS DO CARRINHO (WIZARD)
   --------------------------------------------------------------------------
   1 = Produtos | 2 = Entrega | 3 = Dados | 4 = Envio
   Cada etapa é mostrada uma de cada vez: ao passar para a próxima, a anterior
   some. Os botões "Voltar" e "Continuar/Enviar" do rodapé comandam essa troca.
   ========================================================================== */

function irParaEtapa(numero) {
    // Garante que o número esteja entre 1 e 4
    if (numero < 1) {
        numero = 1;
    }
    if (numero > 4) {
        numero = 4;
    }

    etapaAtual = numero;

    // Esconde todas as etapas e mostra somente a escolhida (uma por vez)
    el("carrinhoEtapa1").hidden = numero !== 1;
    el("carrinhoEtapa2").hidden = numero !== 2;
    el("carrinhoEtapa3").hidden = numero !== 3;
    el("carrinhoEtapa4").hidden = numero !== 4;

    // Atualiza a barra de progresso (etapa atual fica azul, as passadas vermelhas)
    const passos = document.querySelectorAll(".passo-item");
    passos.forEach(function (item, indice) {
        const n = indice + 1;
        item.classList.toggle("ativo", n === numero);
        item.classList.toggle("concluido", n < numero);
    });

    // Botão "Voltar" some na primeira etapa (não tem para onde voltar)
    el("btnVoltar").style.visibility = numero === 1 ? "hidden" : "visible";

    // Botão "Continuar" vira "Enviar para o WhatsApp" na última etapa
    const btContinuar = el("btnContinuar");
    if (numero === 4) {
        btContinuar.textContent = "Enviar para o WhatsApp";
        btContinuar.className = "btn btn-whatsapp";
    } else {
        btContinuar.textContent = "Continuar";
        btContinuar.className = "btn btn-primario";
    }

    esconderErro(); // limpa qualquer mensagem de erro de etapas anteriores

    // Preparos específicos de cada etapa
    if (numero === 2) {
        montarOpcoesBairro(); // recria a lista de bairros (caso exista taxa)
    }
    if (numero === 4) {
        montarConfirmacao(); // monta o resumo final do pedido
    }

    atualizarCarrinho(); // recalcula os totais para a etapa atual

    el("carrinhoBody").scrollTop = 0; // volta o painel para o topo
}

/* ==========================================================================
   ETAPA 2 — ENTREGA
   --------------------------------------------------------------------------
   O cliente escolhe "Entrega" ou "Retirada". Se escolher Entrega, aparecem
   os campos de endereço e bairro. Tudo é validado antes de continuar.
   ========================================================================== */

function montarOpcoesBairro() {
    // Cria as opções do "select" de bairro a partir do objeto taxasEntrega.
    // Se não houver taxas por bairro, o campo fica escondido.
    const select = el("bairroEntrega");
    const bairros = Object.keys(taxasEntrega);

    // Primeira opção é um texto explicativo
    select.innerHTML = '<option value="">Selecionar bairro (ajuda a calcular a entrega)</option>';

    // Uma opção para cada bairro que tiver taxa
    bairros.forEach(function (bairro) {
        const opcao = document.createElement("option");
        opcao.value = bairro;
        opcao.textContent = bairro + " — " + formatarMoeda(taxasEntrega[bairro]);
        select.appendChild(opcao);
    });

    // Sem bairros configurados => não mostra o campo
    select.style.display = bairros.length === 0 ? "none" : "";
}

function alternarCampoEndereco() {
    // Quando o cliente marca "Entrega", mostra o campo de endereço.
    // Quando marca "Retirada", esconde. E recalcula os totais.
    const forma = obterFormaRecebimento();
    el("divEndereco").hidden = forma !== "entrega";
    atualizarCarrinho();
}

function mascararTelefone(valor) {
    // Formata o número enquanto o cliente digita:
    // (89) 99999-9999
    const digitos = valor.replace(/\D/g, "").slice(0, 11); // só números, máx. 11
    if (digitos.length === 0) {
        return "";
    }
    if (digitos.length <= 2) {
        return "(" + digitos;
    }
    if (digitos.length <= 6) {
        return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
    }
    if (digitos.length <= 10) {
        return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 6) + "-" + digitos.slice(6);
    }
    return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 7) + "-" + digitos.slice(7);
}

function validarEtapaEntrega() {
    // Confere se a etapa 2 está preenchida corretamente
    const forma = obterFormaRecebimento();
    const mensagens = [];

    if (forma === "") {
        mensagens.push("Escolha entre Entrega ou Retirada no local.");
    }

    if (forma === "entrega" && el("enderecoEntrega").value.trim() === "") {
        mensagens.push("Informe o endereço de entrega.");
    }

    if (
        forma === "entrega" &&
        Object.keys(taxasEntrega).length > 0 &&
        el("bairroEntrega").value === ""
    ) {
        mensagens.push("Selecione o bairro de entrega.");
    }

    // Se houver erros, mostra e bloqueia
    if (mensagens.length > 0) {
        mostrarErro(mensagens);
        return false;
    }

    esconderErro();
    return true; // libera passar para a etapa 3
}

/* ==========================================================================
   ETAPA 3 — DADOS DO CLIENTE
   --------------------------------------------------------------------------
   Só pedimos nome, telefone e observações. Nada de senha ou cartão.
   ========================================================================== */

function validarEtapaDados() {
    // Confere se a etapa 3 está preenchida corretamente
    const nome = el("clienteNome").value.trim();
    const telefone = el("clienteTelefone").value.trim();
    const mensagens = [];

    if (nome === "") {
        mensagens.push("Informe seu nome.");
    }

    if (telefone === "") {
        mensagens.push("Informe seu telefone.");
    } else if (telefone.replace(/\D/g, "").length < 10) {
        mensagens.push("Informe um telefone válido com DDD.");
    }

    // Se houver erros, mostra e bloqueia
    if (mensagens.length > 0) {
        mostrarErro(mensagens);
        el("erroEtapa").scrollIntoView({ behavior: "smooth", block: "nearest" });
        return false;
    }

    esconderErro();
    return true; // libera passar para a etapa 4
}

function obterDadosDoFormulario() {
    // Pega todos os valores preenchidos nas etapas 2 e 3 de uma vez.
    // Usado na confirmação e na mensagem do WhatsApp.
    return {
        nome: el("clienteNome").value.trim(),
        telefone: el("clienteTelefone").value.trim(),
        forma: obterFormaRecebimento(),
        endereco: el("enderecoEntrega").value.trim(),
        bairro: el("bairroEntrega").value,
        observacoes: el("observacoesPedido").value.trim()
    };
}

/* ==========================================================================
   MENSAGENS DE ERRO (na tela, sem alert())
   --------------------------------------------------------------------------
   Mostra os avisos de validação dentro do próprio painel do carrinho.
   ========================================================================== */

function mostrarErro(mensagens) {
    const erro = el("erroEtapa");
    erro.hidden = false;
    erro.innerHTML =
        '<span class="erro-icone">' + icone(ICONES.alerta, 17) + "</span>" +
        mensagens.join("<br>");
}

function esconderErro() {
    const erro = el("erroEtapa");
    erro.hidden = true;
    erro.innerHTML = "";
}

/* ==========================================================================
   ETAPA 4 — CONFIRMAÇÃO E ENVIO
   --------------------------------------------------------------------------
   Monta o resumo final do pedido (cliente, produtos, valores, entrega e
   observações) para o cliente conferir antes de ir para o WhatsApp.
   ========================================================================== */

function montarConfirmacao() {
    const dados = obterDadosDoFormulario();
    const resumo = el("confirmacaoResumo");

    // Lista de produtos com quantidade e valor de cada um
    let produtosHtml = "";
    carrinho.forEach(function (item) {
        const produto = buscarProduto(item.id);
        produtosHtml +=
            "<li>" +
                "<span>" + item.quantidade + "x " + produto.nome + "</span>" +
                "<strong>" + textoValor(produto.preco * item.quantidade) + "</strong>" +
            "</li>";
    });

    const subtotal = calcularSubtotal();
    const taxa = calcularTaxa();
    const total = calcularTotal();

    const enderecoExibicao = dados.endereco
        ? dados.endereco + (dados.bairro ? " — " + dados.bairro : "")
        : "—";

    // Monta o HTML do resumo em blocos organizados
    resumo.innerHTML =
        '<div class="confirmacao-blocos">' +
            "<h4>Cliente</h4>" +
            "<p><strong>" + escapeHtml(dados.nome) + "</strong> — " + escapeHtml(dados.telefone) + "</p>" +
        "</div>" +

        '<div class="confirmacao-blocos">' +
            "<h4>Produtos</h4>" +
            "<ul>" + produtosHtml + "</ul>" +
        "</div>" +

        '<div class="confirmacao-blocos">' +
            "<h4>Resumo</h4>" +
            '<div class="resumo-linha"><span>Subtotal</span><span>' + textoValor(subtotal) + "</span></div>" +
            (taxa > 0
                ? '<div class="resumo-linha"><span>Taxa de entrega</span><span>' + formatarMoeda(taxa) + "</span></div>"
                : "") +
            '<div class="resumo-linha total"><span>Total estimado</span><span>' + textoValor(total) + "</span></div>" +
        "</div>" +

        '<div class="confirmacao-blocos">' +
            "<h4>Forma de recebimento</h4>" +
            "<p><strong>" +
                (dados.forma === "entrega"
                    ? icone(ICONES.caminhao, 17) + " Entrega"
                    : icone(ICONES.loja, 17) + " Retirada no local") +
            "</strong></p>" +
            (dados.forma === "entrega" ? "<p>" + escapeHtml(enderecoExibicao) + "</p>" : "") +
        "</div>" +

        (dados.observacoes
            ? '<div class="confirmacao-blocos">' +
                "<h4>Observações</h4>" +
                "<p>" + escapeHtml(dados.observacoes) + "</p>" +
              "</div>"
            : "");
}

function escapeHtml(texto) {
    // Evita que o cliente digite código capaz de "quebrar" a página.
    // Converte os caracteres especiais < > & " em texto simples.
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/* ==========================================================================
   WHATSAPP
   --------------------------------------------------------------------------
   O pedido viram um link do tipo:
       https://wa.me/NUMERO?text=OLÁ...
   O navegador abre esse link em outra aba e o WhatsApp já vem preenchido.
   ========================================================================== */

function urlWhatsApp() {
    // Só o endereço base do WhatsApp (sem a mensagem)
    return "https://wa.me/" + CONFIG.whatsappFornecedor;
}

function abrirWhatsApp(mensagem) {
    // encodeURIComponent protege acentos, espaços e quebras de linha do texto
    const url = urlWhatsApp() + "?text=" + encodeURIComponent(mensagem);
    window.open(url, "_blank"); // abre em nova aba
}

function gerarMensagemWhatsApp() {
    // Monta o texto da mensagem linha por linha, de forma organizada
    const dados = obterDadosDoFormulario();

    // *texto* no WhatsApp deixa em negrito
    const linhas = ["Olá! Gostaria de fazer um pedido pelo site.", ""];
    linhas.push("*NOVO PEDIDO*");
    linhas.push("");
    linhas.push("*Cliente:* " + dados.nome);
    linhas.push("*Telefone:* " + dados.telefone);
    linhas.push("");

    linhas.push("*PRODUTOS:*");

    // Um linha para cada produto + observação dele (se existir)
    carrinho.forEach(function (item) {
        const produto = buscarProduto(item.id);
        linhas.push(
            item.quantidade + "x " + produto.nome +
            (produto.preco > 0 ? " — " + formatarMoeda(produto.preco) : "")
        );
        if (item.observacao) {
            linhas.push("   Obs: " + item.observacao);
        }
    });

    // Resumo de valores
    linhas.push("");
    linhas.push("*RESUMO*");
    linhas.push("Subtotal: " + textoValor(calcularSubtotal()));
    const taxa = calcularTaxa();
    if (taxa > 0) {
        linhas.push("Taxa de entrega: " + formatarMoeda(taxa));
    }
    linhas.push("*Total estimado: " + textoValor(calcularTotal()) + "*");
    linhas.push("");
    linhas.push("*Forma de recebimento:* " + (dados.forma === "entrega" ? "Entrega" : "Retirada no local"));

    // Endereço só entra se for entrega
    if (dados.forma === "entrega") {
        linhas.push("Endereço:");
        linhas.push(dados.endereco + (dados.bairro ? "\nBairro: " + dados.bairro : ""));
    }

    // Observações gerais (se o cliente preencheu)
    if (dados.observacoes) {
        linhas.push("");
        linhas.push("*Observações:*");
        linhas.push(dados.observacoes);
    }

    linhas.push("");
    linhas.push("Enviado através do catálogo online da Distribuidora Águia. Aguardo a confirmação do pedido!");

    // Junta tudo, separando por quebra de linha
    return linhas.join("\n");
}

function enviarPedidoWhatsApp() {
    // Monta a mensagem, abre o WhatsApp e fecha o painel do carrinho
    const mensagem = gerarMensagemWhatsApp();
    abrirWhatsApp(mensagem);
    mostrarToast("Abrindo o WhatsApp com seu pedido...");

    setTimeout(fecharCarrinho, 800);
}

/* ==========================================================================
   TOAST — AVISOS RÁPIDOS NA TELA
   --------------------------------------------------------------------------
   Pequeno balão que aparece no rodapé para avisar "Produto adicionado" etc.
   Some sozinho depois de alguns segundos.
   ========================================================================== */

let timeoutToast = null; // guarda o "temporizador" para cancelar o anterior

function mostrarToast(mensagem) {
    const toast = el("toast");
    toast.innerHTML = icone(ICONES.check, 18) + "<span>" + mensagem + "</span>";
    toast.hidden = false;

    // No próximo quadro da animação, aplica a classe que faz o balão aparecer
    requestAnimationFrame(function () {
        toast.classList.add("visivel");
    });

    // Remove o balão após 2,4s
    clearTimeout(timeoutToast); // se já estava contando, zera e recomeça
    timeoutToast = setTimeout(function () {
        toast.classList.remove("visivel");
        setTimeout(function () {
            toast.hidden = true;
        }, 300);
    }, 2400);
}

function animarContador() {
    // Pequeno pulso no número do carrinho sempre que um produto é adicionado
    const contador = el("carrinhoContador");
    contador.classList.remove("pulso");
    void contador.offsetWidth; // força o navegador a "reiniciar" a animação
    contador.classList.add("pulso");
}

/* ==========================================================================
   LOCALSTORAGE — LEMBRAR O PEDIDO
   --------------------------------------------------------------------------
   - salvarCarrinho(): grava o carrinho no navegador (strings em JSON)
   - carregarCarrinho(): lê o carrinho salvo quando a página abre
   Assim, se o cliente fechar a página e voltar depois, o pedido continua lá.
   ========================================================================== */

function salvarCarrinho() {
    try {
        localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(carrinho));
    } catch (erro) {
        // Se o navegador bloquear o localStorage, o site continua funcionando
    }
}

function carregarCarrinho() {
    try {
        const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE);
        if (salvo) {
            carrinho = JSON.parse(salvo) || [];
        }
    } catch (erro) {
        carrinho = [];
    }
    // Descarta itens de ids que não existem mais no catálogo (carrinho antigo
    // ou arquivo adulterado), para o resto do código nunca receber undefined.
    carrinho = carrinho.filter(function (item) {
        return item && typeof item.id === "number" &&
            item.quantidade > 0 && buscarProduto(item.id);
    });
}

/* ==========================================================================
   EVENTOS DA PÁGINA
   --------------------------------------------------------------------------
   Aqui ficam todos os "ouvintes" de clique, digitação, etc.
   Cada listener "escuta" um elemento e reage quando o usuário interage.
   ========================================================================== */

function configurarEventos() {
    // ----- MENU HAMBÚRGUER (celular) -----
    // Clica no botão de 3 linhas => abre/fecha o menu
    const menuBtn = el("menuBtn");
    const navLista = el("navLista");

    menuBtn.addEventListener("click", function () {
        const aberto = navLista.classList.toggle("aberto");
        menuBtn.classList.toggle("ativo", aberto);
        menuBtn.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    // Clicar num link do menu fecha o menu
    navLista.addEventListener("click", function (evento) {
        if (evento.target.closest(".nav-link")) {
            navLista.classList.remove("aberto");
            menuBtn.classList.remove("ativo");
            menuBtn.setAttribute("aria-expanded", "false");
        }
    });

    // ----- CARRINHO (abrir / fechar / clique no fundo escuro) -----
    el("abrirCarrinhoBtn").addEventListener("click", abrirCarrinho);
    el("fecharCarrinhoBtn").addEventListener("click", fecharCarrinho);

    // Clicar no fundo escuro (overlay) fecha tudo
    el("overlay").addEventListener("click", function () {
        fecharCarrinho();
        fecharModalProduto();
    });

    // ----- BUSCA: filtra os produtos a cada tecla digitada -----
    el("buscaProdutos").addEventListener("input", renderizarProdutos);

    // ----- GRADE DE PRODUTOS (delegação de eventos) -----
    // Um único listener para todos os cards. "Delegação" = descobre em qual
    // card o clique aconteceu e age de acordo (botão "Adicionar" ou abrir modal).
    el("produtosGrid").addEventListener("click", function (evento) {
        const botaoAdicionar = evento.target.closest(".btn-adicionar");
        const card = evento.target.closest(".produto-card");

        if (!card) {
            return; // clicou fora de um card
        }

        const id = parseInt(card.dataset.id, 10);

        // Clique no botão "Adicionar ao pedido"
        if (botaoAdicionar) {
            evento.stopPropagation(); // impede de abrir o modal junto
            if (botaoAdicionar.disabled) {
                return; // produto indisponível
            }
            adicionarAoCarrinho(id, 1, "");
            return;
        }

        // Clique na foto/nome do produto => abre o modal de detalhes
        abrirModalProduto(id);
    });

    // ----- MODAL DO PRODUTO -----
    el("fecharModalProdutoBtn").addEventListener("click", fecharModalProduto);

    // Botões - e + da quantidade no modal
    el("modalQtdMenos").addEventListener("click", function () {
        alterarQuantidadeModal(-1);
    });
    el("modalQtdMais").addEventListener("click", function () {
        alterarQuantidadeModal(1);
    });

    // Botão "Adicionar ao pedido" do modal: usa quantidade e observação
    el("modalAdicionarBtn").addEventListener("click", function () {
        if (!produtoModalAtual) {
            return;
        }
        const quantidade = parseInt(el("modalQtd").textContent, 10) || 1;
        const observacao = el("modalObservacao").value;
        adicionarAoCarrinho(produtoModalAtual.id, quantidade, observacao);
        fecharModalProduto();
    });

    // ----- ITENS DO CARRINHO (delegação de eventos) -----
    // Os botões - / + / Remover de cada linha usam "data-acao" para dizer o que fazer
    el("carrinhoItens").addEventListener("click", function (evento) {
        const botao = evento.target.closest("button[data-acao]");
        if (!botao) {
            return;
        }

        const linha = botao.closest(".carrinho-item");
        const id = parseInt(linha.dataset.id, 10);
        const acao = botao.dataset.acao;

        if (acao === "mais") {
            alterarQuantidade(id, 1);
        } else if (acao === "menos") {
            alterarQuantidade(id, -1);
        } else if (acao === "remover") {
            removerDoCarrinho(id);
        }
    });

    // Botão "Ver produtos" (estado vazio) fecha o painel e rola até os produtos
    el("verProdutosBtn").addEventListener("click", function () {
        fecharCarrinho();
        document.querySelector("#produtos").scrollIntoView({ behavior: "smooth" });
    });

    el("limparPedidoBtn").addEventListener("click", limparCarrinho);

    // ----- NAVEGAÇÃO ENTRE ETAPAS -----
    // Botão "Voltar": volta uma etapa
    el("btnVoltar").addEventListener("click", function () {
        if (etapaAtual > 1) {
            irParaEtapa(etapaAtual - 1);
        }
    });

    // Botão "Continuar / Enviar": valida a etapa atual e avança
    el("btnContinuar").addEventListener("click", function () {
        if (etapaAtual === 1) {
            // Etapa 1: o carrinho não pode estar vazio
            if (carrinho.length === 0) {
                mostrarToast("Adicione pelo menos um produto ao seu pedido.");
                return;
            }
            irParaEtapa(2);
        } else if (etapaAtual === 2) {
            // Etapa 2: validar forma de recebimento/endereço
            if (validarEtapaEntrega()) {
                irParaEtapa(3);
            }
        } else if (etapaAtual === 3) {
            // Etapa 3: validar nome e telefone
            if (validarEtapaDados()) {
                irParaEtapa(4);
            }
        } else if (etapaAtual === 4) {
            // Etapa 4: enviar para o WhatsApp
            enviarPedidoWhatsApp();
        }
    });

    // ----- FORMULÁRIO DA ETAPA DE ENTREGA -----
    // Marcar "Entrega" ou "Retirada" mostra/esconde o endereço e recalcula total
    document.querySelectorAll('input[name="recebimento"]').forEach(function (radio) {
        radio.addEventListener("change", alternarCampoEndereco);
    });

    // Trocar o bairro recalcula a taxa de entrega
    el("bairroEntrega").addEventListener("change", atualizarCarrinho);

    // ----- FORMULÁRIO DA ETAPA DE DADOS -----
    // Máscara de telefone enquanto o cliente digita
    el("clienteTelefone").addEventListener("input", function () {
        const campo = el("clienteTelefone");
        campo.value = mascararTelefone(campo.value);
    });

    // ----- TECLA ESC (acessibilidade) -----
    // Escape fecha o modal do produto ou o carrinho
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            if (!el("modalProduto").hidden) {
                fecharModalProduto();
            } else if (el("carrinho").classList.contains("aberto")) {
                fecharCarrinho();
            }
        }
    });
}

/* ==========================================================================
   INICIAR
   --------------------------------------------------------------------------
   Só começa o site depois que a página HTML terminou de carregar.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", iniciar);