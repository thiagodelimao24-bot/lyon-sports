/* VERIFICAR LOGIN */

if (
    sessionStorage.getItem(
        "lyonAdmin"
    )
    !== "true"
) {

    window.location.href =
        "login.html";

}



/* FORMULÁRIO */

const form =
    document.getElementById(
        "product-form"
    );



/* PEGAR PRODUTOS */

function pegarProdutos() {

    return (

        JSON.parse(
            localStorage.getItem(
                "lyonProdutos"
            )
        ) || []

    );

}



/* SALVAR */

function salvarProdutos(
    produtos
) {

    localStorage.setItem(

        "lyonProdutos",

        JSON.stringify(
            produtos
        )

    );

}



/* PREÇO */

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



/* MOSTRAR PRODUTOS */

function renderAdmin() {

    const produtos =
        pegarProdutos();


    const area =
        document.getElementById(
            "admin-products"
        );


    area.innerHTML = "";


    if (
        produtos.length === 0
    ) {

        area.innerHTML = `

            <p
                style="
                    color:#667085;
                    padding:20px 0;
                "
            >

                Nenhum produto cadastrado.

            </p>

        `;


        return;

    }



    produtos.forEach(

        produto => {

            area.innerHTML += `

                <div
                    class="admin-product"
                >


                    <img
                        src="${produto.imagem}"

                        alt="${produto.nome}"

                        onerror="
                            this.src='https://placehold.co/200x200?text=Lyon'
                        "
                    >


                    <div>

                        <h3>
                            ${produto.nome}
                        </h3>

                        <p>

                            ${produto.categoria}

                            •

                            ${formatarPreco(
                                produto.preco
                            )}

                        </p>

                        <p>

                            Tamanhos:

                            ${produto.tamanhos.join(
                                ", "
                            )}

                        </p>

                    </div>


                    <div
                        class="
                            admin-product-actions
                        "
                    >


                        <button

                            class="edit-btn"

                            onclick="
                                editarProduto(
                                    ${produto.id}
                                )
                            "

                        >

                            Editar

                        </button>


                        <button

                            class="delete-btn"

                            onclick="
                                excluirProduto(
                                    ${produto.id}
                                )
                            "

                        >

                            Excluir

                        </button>


                    </div>

                </div>

            `;

        }

    );

}



/* SALVAR / EDITAR */

form.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        let produtos =
            pegarProdutos();


        const idCampo =

            document
            .getElementById(
                "product-id"
            )
            .value;


        const nome =

            document
            .getElementById(
                "product-name"
            )
            .value
            .trim();


        const categoria =

            document
            .getElementById(
                "product-category"
            )
            .value;


        const clube = document.getElementById("product-club")?.value.trim() || "";
        const temporada = document.getElementById("product-season")?.value.trim() || "";
        const qualidade = document.getElementById("product-quality")?.value.trim() || "Qualidade Tailandesa";


        const precoTexto = document.getElementById("product-price").value.trim().replace(",", ".");
        const preco = Number(precoTexto);


        const imagem =

            document
            .getElementById(
                "product-image"
            )
            .value
            .trim();


        const galeria = JSON.parse(document.getElementById("product-gallery")?.value || "[]");

        const tamanhos =

            document
            .getElementById(
                "product-sizes"
            )
            .value

            .split(",")

            .map(
                tamanho =>
                    tamanho.trim()
            )

            .filter(Boolean);



        if (
            !nome
            ||
            !imagem
            ||
            preco <= 0
        ) {

            alert(
                "Preencha os dados corretamente."
            );

            return;

        }



        if (idCampo) {

            const id =
                Number(idCampo);


            const index =

                produtos.findIndex(

                    produto =>
                        produto.id
                        === id

                );


            if (
                index !== -1
            ) {

                produtos[index] = {

                    id,

                    nome,

                    categoria,
                    clube,
                    temporada,
                    qualidade,

                    preco,

                    imagem,
                    galeria,

                    tamanhos

                };

            }

        } else {

            produtos.push(

                {

                    id:
                        Date.now(),

                    nome,

                    categoria,
                    clube,
                    temporada,
                    qualidade,

                    preco,

                    imagem,
                    galeria,

                    tamanhos

                }

            );

        }



        salvarProdutos(
            produtos
        );


        limparFormulario();


        renderAdmin();


        alert(
            "Produto salvo com sucesso!"
        );

    }

);



/* EDITAR */

function editarProduto(id) {

    const produtos =
        pegarProdutos();


    const produto =

        produtos.find(

            produto =>
                produto.id === id

        );


    if (!produto) return;


    document
        .getElementById(
            "product-id"
        )
        .value =
        produto.id;


    document
        .getElementById(
            "product-name"
        )
        .value =
        produto.nome;


    document
        .getElementById(
            "product-category"
        )
        .value =
        produto.categoria;


    document
        .getElementById(
            "product-price"
        )
        .value =
        produto.preco;


    document.getElementById("product-club").value = produto.clube || "";
    document.getElementById("product-season").value = produto.temporada || "";
    document.getElementById("product-quality").value = produto.qualidade || "Qualidade Tailandesa";

    document
        .getElementById(
            "product-image"
        )
        .value =
        produto.imagem;

    definirGaleria((produto.galeria && produto.galeria.length) ? produto.galeria : [produto.imagem]);


    document
        .getElementById(
            "product-sizes"
        )
        .value =
        produto.tamanhos
        .join(",");


    document
        .getElementById(
            "form-title"
        )
        .textContent =
        "Editar camisa";


    window.scrollTo(

        {

            top: 0,

            behavior:
                "smooth"

        }

    );

}



/* EXCLUIR */

function excluirProduto(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta camisa?"
        );


    if (!confirmar) {

        return;

    }


    let produtos =
        pegarProdutos();


    produtos =

        produtos.filter(

            produto =>
                produto.id !== id

        );


    salvarProdutos(
        produtos
    );


    renderAdmin();

}



/* LIMPAR FORM */

function limparFormulario() {

    form.reset();


    document
        .getElementById(
            "product-id"
        )
        .value = "";

    document.getElementById("product-image").value = "";
    document.getElementById("product-image-url").value = "";
    document.getElementById("product-gallery").value = "[]";
    document.getElementById("product-quality").value = "Qualidade Tailandesa";
    esconderPreviewImagem();


    document
        .getElementById(
            "product-price"
        )
        .value =
        "149.99";


    document
        .getElementById(
            "product-sizes"
        )
        .value =
        "P,M,G,GG";


    document
        .getElementById(
            "form-title"
        )
        .textContent =
        "Nova camisa";

}



/* LOGOUT */

function logout() {

    sessionStorage.removeItem(
        "lyonAdmin"
    );


    window.location.href =
        "login.html";

}



/* UPLOAD / ARRASTAR VÁRIAS IMAGENS */
const imageDropZone = document.getElementById("image-drop-zone");
const imageFileInput = document.getElementById("product-image-file");
const imageHiddenInput = document.getElementById("product-image");
const galleryHiddenInput = document.getElementById("product-gallery");
const imageUrlInput = document.getElementById("product-image-url");
const selectImageBtn = document.getElementById("select-image-btn");
const addMoreImagesBtn = document.getElementById("add-more-images-btn");
const multiPreview = document.getElementById("multi-image-preview");
let galeriaAtual = [];

function salvarGaleriaNoForm() {
    galleryHiddenInput.value = JSON.stringify(galeriaAtual);
    imageHiddenInput.value = galeriaAtual[0] || "";
    renderGaleriaPreview();
}
function definirGaleria(lista) {
    galeriaAtual = (lista || []).filter(Boolean);
    salvarGaleriaNoForm();
}
function renderGaleriaPreview() {
    if (!multiPreview) return;
    multiPreview.innerHTML = galeriaAtual.map((src, i) => `
      <div class="multi-preview-item ${i===0?'cover':''}">
        <img src="${src}" alt="Foto ${i+1}">
        <span>${i===0?'CAPA':`FOTO ${i+1}`}</span>
        <div class="multi-preview-actions">
          ${i!==0 ? `<button type="button" onclick="tornarCapa(${i})">Capa</button>` : ''}
          <button type="button" class="danger" onclick="removerFotoGaleria(${i})">✕</button>
        </div>
      </div>`).join('');
}
function tornarCapa(i) {
    const [foto] = galeriaAtual.splice(i,1); galeriaAtual.unshift(foto); salvarGaleriaNoForm();
}
function removerFotoGaleria(i) {
    galeriaAtual.splice(i,1); salvarGaleriaNoForm();
}
function arquivoParaDataURL(arquivo) {
    return new Promise((resolve,reject)=>{
        if (!arquivo.type.startsWith("image/")) return reject(new Error("Formato inválido: " + arquivo.name));
        if (arquivo.size > 12*1024*1024) return reject(new Error(`${arquivo.name} passa de 12 MB`));

        const leitor = new FileReader();
        leitor.onerror = reject;
        leitor.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("Não foi possível ler " + arquivo.name));
            img.onload = () => {
                // Reduz as fotos antes de salvar no navegador para caber várias no localStorage.
                const max = 1100;
                let w = img.width, h = img.height;
                if (w > max || h > max) {
                    const escala = Math.min(max / w, max / h);
                    w = Math.round(w * escala);
                    h = Math.round(h * escala);
                }
                const canvas = document.createElement("canvas");
                canvas.width = w; canvas.height = h;
                canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL("image/jpeg", 0.72));
            };
            img.src = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    });
}

async function processarArquivosImagem(arquivos) {
    const lista = [...arquivos];
    if (!lista.length) return;

    let adicionadas = 0;
    for (const arquivo of lista) {
        try {
            const foto = await arquivoParaDataURL(arquivo);
            galeriaAtual.push(foto);
            adicionadas++;
        } catch (e) {
            alert(e.message || `Não foi possível carregar ${arquivo.name}.`);
        }
    }

    imageFileInput.value = ""; // permite escolher mais fotos depois
    imageUrlInput.value = "";
    salvarGaleriaNoForm();

    if (adicionadas > 0) {
        const texto = adicionadas === 1 ? "1 foto adicionada." : `${adicionadas} fotos adicionadas.`;
        console.log(texto);
    }
}

selectImageBtn?.addEventListener("click", e=>{
    e.stopPropagation();
    imageFileInput.click();
});
addMoreImagesBtn?.addEventListener("click", e=>{
    e.stopPropagation();
    imageFileInput.click();
});
imageDropZone?.addEventListener("click", e=>{
    if (e.target.closest("button")) return;
    imageFileInput.click();
});
imageFileInput?.addEventListener("change", ()=>processarArquivosImagem(imageFileInput.files));
["dragenter","dragover"].forEach(t=>imageDropZone?.addEventListener(t,e=>{e.preventDefault();imageDropZone.classList.add("dragover");}));
["dragleave","drop"].forEach(t=>imageDropZone?.addEventListener(t,e=>{e.preventDefault();imageDropZone.classList.remove("dragover");}));
imageDropZone?.addEventListener("drop", e=>processarArquivosImagem(e.dataTransfer.files));
imageUrlInput?.addEventListener("change", ()=>{
    const url=imageUrlInput.value.trim();
    if(url){galeriaAtual.push(url);imageUrlInput.value="";salvarGaleriaNoForm();}
});

/* INICIAR */
renderAdmin();