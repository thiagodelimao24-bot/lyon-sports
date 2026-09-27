/* ========================================
   LYON SPORTS
======================================== */


/* ========================================
   PRODUTOS INICIAIS
======================================== */

const produtosPadrao = [

    {
        id: 1,

        nome:
            "Real Madrid 2026/27",

        categoria:
            "Europeia",

        preco:
            149.99,

        imagem:
            "img/real.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 2,

        nome:
            "Barcelona 2026/27",

        categoria:
            "Europeia",

        preco:
            149.99,

        imagem:
            "img/barcelona.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 3,

        nome:
            "Flamengo 2026",

        categoria:
            "Brasileira",

        preco:
            149.99,

        imagem:
            "img/flamengo.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 4,

        nome:
            "Palmeiras 2026",

        categoria:
            "Brasileira",

        preco:
            149.99,

        imagem:
            "img/palmeiras.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 5,

        nome:
            "Corinthians 2026",

        categoria:
            "Brasileira",

        preco:
            149.99,

        imagem:
            "img/corinthias.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 6,

        nome:
            "Santos FC",

        categoria:
            "Brasileira",

        preco:
            149.99,

        imagem:
            "img/santos.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 7,

        nome:
            "Arsenal",

        categoria:
            "Europeia",

        preco:
            149.99,

        imagem:
            "img/arsenal.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 8,

        nome:
            "Portugal",

        categoria:
            "Seleção",

        preco:
            149.99,

        imagem:
            "img/portugal.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    },


    {
        id: 9,

        nome:
            "Santos Retrô",

        categoria:
            "Retrô",

        preco:
            179.99,

        imagem:
            "img/retro-santos.png",

        tamanhos:
            ["P", "M", "G", "GG"]
    }

];



/* ========================================
   INICIAR PRODUTOS
======================================== */

if (
    !localStorage.getItem(
        "lyonProdutos"
    )
) {

    localStorage.setItem(

        "lyonProdutos",

        JSON.stringify(
            produtosPadrao
        )

    );

}



/* ========================================
   VARIÁVEIS
======================================== */

let categoriaAtual =
    "Todos";


let carrinho =

    JSON.parse(
        localStorage.getItem(
            "lyonCarrinho"
        )
    ) || [];



/* ========================================
   LOADER
======================================== */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                const loader =
                    document.getElementById(
                        "loader"
                    );


                if (loader) {

                    loader.classList.add(
                        "hidden"
                    );

                }

            },
            1900
        );

    }
);



/* ========================================
   HEADER AO ROLAR
======================================== */

window.addEventListener(
    "scroll",
    () => {

        const header =
            document.querySelector(
                ".header"
            );


        if (!header) return;


        if (
            window.scrollY > 30
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }
);



/* ========================================
   PRODUTOS
======================================== */

function pegarProdutos() {

    return (

        JSON.parse(
            localStorage.getItem(
                "lyonProdutos"
            )
        ) || []

    );

}



function formatarPreco(valor) {

    return Number(valor)
        .toLocaleString(

            "pt-BR",

            {

                style:
                    "currency",

                currency:
                    "BRL"

            }

        );

}



function renderProdutos() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    const search = document.getElementById("search");
    const pesquisa = search ? search.value.toLowerCase().trim() : "";
    let produtos = pegarProdutos().filter(produto => {
        const categoriaOk = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;
        const pesquisaOk = produto.nome.toLowerCase().includes(pesquisa);
        return categoriaOk && pesquisaOk;
    });
    grid.innerHTML = "";
    if (!produtos.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:70px 20px;color:#667085"><div style="font-size:45px;margin-bottom:10px">👕</div><h3 style="color:#061a40;margin-bottom:5px">Nenhuma camisa encontrada</h3><p>Tente pesquisar outro time.</p></div>`;
        return;
    }
    produtos.forEach((produto,index) => {
        const card=document.createElement("article");
        card.className="product-card";
        card.style.animationDelay=`${index*.05}s`;
        const fotos=(produto.galeria&&produto.galeria.length?produto.galeria:[produto.imagem]).filter(Boolean);
        card.innerHTML=`
            <span class="product-category">${produto.categoria}</span>
            <div class="product-image product-clickable" onclick="abrirProduto(${produto.id})">
                <img id="produto-img-${produto.id}" src="${fotos[0]||produto.imagem}" alt="${produto.nome}" loading="lazy" onerror="this.src='https://placehold.co/600x700/f1f3f7/061a40?text=LYON+SPORTS'">
                ${fotos.length>1?`<span class="photo-count">📷 ${fotos.length} fotos</span>`:''}
            </div>
            <div class="product-info">
                <h3>${produto.nome}</h3>
                <p class="product-description">${produto.qualidade||'Qualidade Tailandesa'} • Modelo torcedor</p>
                <div class="price">${formatarPreco(produto.preco)}</div>
                <button class="add-button" onclick="abrirProduto(${produto.id})">VER DETALHES E COMPRAR →</button>
            </div>`;
        grid.appendChild(card);
    });
}

/* ========================================
   FILTROS
======================================== */

function filtrar(
    categoria,
    botao
) {

    categoriaAtual =
        categoria;


    document
        .querySelectorAll(
            ".filter"
        )
        .forEach(

            btn => {

                btn.classList.remove(
                    "active"
                );

            }

        );


    if (botao) {

        botao.classList.add(
            "active"
        );

    }


    renderProdutos();

}



/* ========================================
   ADICIONAR AO CARRINHO
======================================== */

function adicionarCarrinho(id) {

    const produtos =
        pegarProdutos();


    const produto =
        produtos.find(

            p =>
                p.id === id

        );


    if (!produto) return;


    const select =
        document.getElementById(
            `size-${id}`
        );


    const tamanho =
        select
            ? select.value
            : "M";


    const existente =
        carrinho.find(

            item =>

                item.id === id

                &&

                item.tamanho
                === tamanho

        );



    if (existente) {

        existente.quantidade++;

    } else {

        carrinho.push(

            {

                ...produto,

                tamanho,

                quantidade: 1

            }

        );

    }


    salvarCarrinho();


    animarCarrinho();


    mostrarToast();


    abrirCarrinho();

}



/* ========================================
   SALVAR CARRINHO
======================================== */

function salvarCarrinho() {

    localStorage.setItem(

        "lyonCarrinho",

        JSON.stringify(
            carrinho
        )

    );


    atualizarContador();

    renderCarrinho();

}



/* ========================================
   CONTADOR
======================================== */

function atualizarContador() {

    const contador =
        document.getElementById(
            "cart-count"
        );


    if (!contador) return;


    const quantidade =

        carrinho.reduce(

            (
                total,
                item
            ) =>

                total
                +
                item.quantidade,

            0

        );


    contador.textContent =
        quantidade;

}



/* ========================================
   ANIMAÇÃO CARRINHO
======================================== */

function animarCarrinho() {

    const botao =
        document.querySelector(
            ".cart-button"
        );


    if (!botao) return;


    botao.classList.remove(
        "bump"
    );


    void botao.offsetWidth;


    botao.classList.add(
        "bump"
    );

}



/* ========================================
   TOAST
======================================== */

function mostrarToast() {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        1800
    );

}



/* ========================================
   RENDER CARRINHO
======================================== */

function renderCarrinho() {

    const area =
        document.getElementById(
            "cart-items"
        );


    const totalElemento =
        document.getElementById(
            "cart-total"
        );


    if (
        !area
        ||
        !totalElemento
    ) {

        return;

    }


    area.innerHTML = "";



    if (
        carrinho.length === 0
    ) {

        area.innerHTML = `

            <div
                class="empty-cart"
            >

                <div
                    class="empty-cart-icon"
                >
                    🛒
                </div>

                <h3>
                    Seu carrinho está vazio
                </h3>

                <p>
                    Escolha seu manto
                    e adicione ao carrinho.
                </p>

            </div>

        `;

    }



    carrinho.forEach(

        (item, index) => {

            const subtotal =

                item.preco
                *
                item.quantidade;


            area.innerHTML += `

                <div
                    class="cart-item"
                >

                    <img
                        src="${item.imagem}"
                        alt="${item.nome}"
                    >


                    <div>

                        <h4>
                            ${item.nome}
                        </h4>


                        <p>Tamanho: ${item.tamanho}</p>
                        ${item.personalizacao ? `<p>Personalizada: ${item.nomePersonalizado} #${item.numeroPersonalizado}</p>` : ""}


                        <strong>

                            ${formatarPreco(
                                subtotal
                            )}

                        </strong>


                        <div
                            class="quantity-controls"
                        >

                            <button
                                onclick="
                                    alterarQuantidade(
                                        ${index},
                                        -1
                                    )
                                "
                            >
                                −
                            </button>


                            <span>
                                ${item.quantidade}
                            </span>


                            <button
                                onclick="
                                    alterarQuantidade(
                                        ${index},
                                        1
                                    )
                                "
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button

                        class="remove-item"

                        onclick="
                            removerCarrinho(
                                ${index}
                            )
                        "

                        title="Excluir"

                    >
                        🗑
                    </button>

                </div>

            `;

        }

    );



    const total =

        carrinho.reduce(

            (
                soma,
                item
            ) =>

                soma
                +
                item.preco
                *
                item.quantidade,

            0

        );


    totalElemento.textContent =
        formatarPreco(
            total
        );

}



/* ========================================
   ALTERAR QUANTIDADE
======================================== */

function alterarQuantidade(
    index,
    valor
) {

    if (
        !carrinho[index]
    ) {

        return;

    }


    carrinho[index]
        .quantidade += valor;


    if (
        carrinho[index]
        .quantidade <= 0
    ) {

        carrinho.splice(
            index,
            1
        );

    }


    salvarCarrinho();

}



/* ========================================
   REMOVER
======================================== */

function removerCarrinho(index) {

    carrinho.splice(
        index,
        1
    );


    salvarCarrinho();

}



/* ========================================
   LIMPAR
======================================== */

function limparCarrinho() {

    if (
        carrinho.length === 0
    ) {

        return;

    }


    const confirmar =
        confirm(
            "Deseja limpar todo o carrinho?"
        );


    if (!confirmar) return;


    carrinho = [];


    salvarCarrinho();

}



/* ========================================
   ABRIR CARRINHO
======================================== */

function abrirCarrinho() {

    const cart =
        document.getElementById(
            "cart"
        );


    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    if (cart) {

        cart.classList.add(
            "active"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "no-scroll"
    );

}



/* ========================================
   FECHAR CARRINHO
======================================== */

function fecharCarrinho() {

    const cart =
        document.getElementById(
            "cart"
        );


    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    if (cart) {

        cart.classList.remove(
            "active"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "no-scroll"
    );

}



/* ========================================
   FECHAR COM ESC
======================================== */

document.addEventListener(

    "keydown",

    event => {

        if (
            event.key
            === "Escape"
        ) {

            fecharCarrinho();

        }

    }

);



/* ========================================
   WHATSAPP
======================================== */

function finalizarWhatsApp() {

    if (
        carrinho.length === 0
    ) {

        alert(
            "Seu carrinho está vazio."
        );

        return;

    }


    /*
        =================================

        COLOQUE O WHATSAPP
        DA LYON SPORTS AQUI

        Exemplo:

        5519999999999

        55 = Brasil
        19 = DDD

        =================================
    */


    const telefone =
        "5519998638425";


    let mensagem =

        "🦁 *LYON SPORTS*\n"
        +
        "Olá! Quero fazer um pedido ⚽👕\n\n";


    let total = 0;



    carrinho.forEach(

        item => {

            const subtotal =

                item.preco
                *
                item.quantidade;


            total +=
                subtotal;


            mensagem +=

                `👕 *${item.nome}*\n`
                +
                `📏 Tamanho: ${item.tamanho}\n`
                +
                (item.personalizacao ? `✍️ Personalização: ${item.nomePersonalizado} #${item.numeroPersonalizado}\n` : "")
                +
                `🔢 Quantidade: ${item.quantidade}\n`
                +
                `💰 ${formatarPreco(subtotal)}\n`
                +
                "------------------------\n";

        }

    );


    mensagem +=

        `\n💵 *TOTAL: ${formatarPreco(total)}*\n\n`
        +
        "Gostaria de finalizar meu pedido.";



    const url =

        `https://wa.me/${telefone}?text=${
            encodeURIComponent(
                mensagem
            )
        }`;


    window.open(
        url,
        "_blank"
    );

}



/* ========================================
   INICIALIZAR
======================================== */

renderProdutos();

renderCarrinho();

atualizarContador();

function trocarFotoCard(id, fotoCodificada, botao) {
 const img=document.getElementById(`produto-img-${id}`); if(img) img.src=decodeURIComponent(fotoCodificada);
 botao?.parentElement?.querySelectorAll('.gallery-dot').forEach(b=>b.classList.remove('active')); botao?.classList.add('active');
}


/* ========================================
   DETALHES / GALERIA / PERSONALIZAÇÃO
======================================== */
let produtoModalAtual = null;
let fotoModalAtual = 0;
let touchStartX = 0;

function fotosDoProduto(produto){
    const fotos=(produto?.galeria&&produto.galeria.length?produto.galeria:[produto?.imagem]).filter(Boolean);
    return [...new Set(fotos)];
}
function abrirProduto(id){
    produtoModalAtual=pegarProdutos().find(p=>p.id===id);
    if(!produtoModalAtual)return;
    fotoModalAtual=0;
    document.getElementById('modal-name').textContent=produtoModalAtual.nome;
    document.getElementById('modal-category').textContent=[produtoModalAtual.categoria,produtoModalAtual.temporada].filter(Boolean).join(' • ');
    document.getElementById('modal-description').textContent=produtoModalAtual.descricao || `${produtoModalAtual.qualidade||'Qualidade Tailandesa'}, com ótimo acabamento e detalhes pensados para quem vive futebol. Confira os ângulos, escolha o modelo e o tamanho antes de adicionar ao carrinho.`;
    document.getElementById('modal-personalize').checked=false;
    document.getElementById('modal-custom-name').value='';
    document.getElementById('modal-custom-number').value='';
    alternarPersonalizacao();
    document.getElementById('modal-size').innerHTML=(produtoModalAtual.tamanhos||['P','M','G','GG']).map(t=>`<option value="${t}">${t}</option>`).join('');
    renderGaleriaModal(); atualizarPrecoModal();
    document.getElementById('product-modal').classList.add('open');
    document.getElementById('product-modal-overlay').classList.add('open');
    document.body.classList.add('modal-open');
}
function fecharProduto(){
    document.getElementById('product-modal')?.classList.remove('open');
    document.getElementById('product-modal-overlay')?.classList.remove('open');
    document.body.classList.remove('modal-open');
}
function renderGaleriaModal(){
    const fotos=fotosDoProduto(produtoModalAtual); if(!fotos.length)return;
    fotoModalAtual=(fotoModalAtual+fotos.length)%fotos.length;
    const img=document.getElementById('modal-product-image'); img.src=fotos[fotoModalAtual]; img.alt=produtoModalAtual.nome;
    document.getElementById('modal-thumbnails').innerHTML=fotos.map((f,i)=>`<button class="modal-thumb ${i===fotoModalAtual?'active':''}" onclick="irParaFoto(${i})"><img src="${f}" alt="Ângulo ${i+1}"></button>`).join('');
}
function mudarFotoProduto(delta){fotoModalAtual+=delta;renderGaleriaModal()}
function irParaFoto(i){fotoModalAtual=i;renderGaleriaModal()}
function alternarPersonalizacao(){
    const ativo=document.getElementById('modal-personalize')?.checked;
    document.getElementById('personalize-fields')?.classList.toggle('show',!!ativo);
}
function precoConfiguradoModal(){
    if(!produtoModalAtual)return 0;
    let preco=Number(produtoModalAtual.preco)||0;
    if(document.getElementById('modal-personalize')?.checked)preco+=5;
    return preco;
}
function atualizarPrecoModal(){
    const el=document.getElementById('modal-price'); if(el)el.textContent=formatarPreco(precoConfiguradoModal());
}
function adicionarProdutoModal(){
    if(!produtoModalAtual)return;
    const personalizacao=document.getElementById('modal-personalize').checked;
    const nomePersonalizado=document.getElementById('modal-custom-name').value.trim();
    const numeroPersonalizado=document.getElementById('modal-custom-number').value.trim();
    if(personalizacao&&(!nomePersonalizado||!numeroPersonalizado)){alert('Preencha o nome e o número da personalização.');return;}
    const item={...produtoModalAtual,preco:precoConfiguradoModal(),tamanho:document.getElementById('modal-size').value,personalizacao,nomePersonalizado,numeroPersonalizado,quantidade:1};
    const existente=carrinho.find(x=>x.id===item.id&&x.tamanho===item.tamanho&&!!x.personalizacao===!!item.personalizacao&&x.nomePersonalizado===item.nomePersonalizado&&x.numeroPersonalizado===item.numeroPersonalizado);
    if(existente)existente.quantidade++; else carrinho.push(item);
    salvarCarrinho(); animarCarrinho(); mostrarToast(); fecharProduto(); abrirCarrinho();
}
const modalImg=document.getElementById('modal-product-image');
modalImg?.addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].screenX,{passive:true});
modalImg?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchStartX;if(Math.abs(dx)>35)mudarFotoProduto(dx<0?1:-1)},{passive:true});
document.addEventListener('keydown',e=>{if(!document.getElementById('product-modal')?.classList.contains('open'))return;if(e.key==='Escape')fecharProduto();if(e.key==='ArrowRight')mudarFotoProduto(1);if(e.key==='ArrowLeft')mudarFotoProduto(-1)});
